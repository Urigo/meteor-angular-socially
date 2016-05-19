import { invite, rsvp } from './methods';
import { Parties } from './collection';

import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  describe('Parties / Methods', () => {
    describe('invite', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        };
      }

      it('should be called from Method', () => {
        spyOn(invite, 'apply');

        try {
          Meteor.call('invite');
        } catch (e) {}

        expect(invite.apply).toHaveBeenCalled();
      });

      it('should fail on missing partyId', () => {
        expect(() => {
          invite.call({});
        }).toThrowError();
      });

      it('should fail on missing userId', () => {
        expect(() => {
          invite.call({}, 'partyId');
        }).toThrowError();
      });

      it('should fail on not logged in', () => {
        expect(() => {
          invite.call({}, 'partyId', 'userId');
        }).toThrowError(/logged in/i);
      });

      it('should look for a party', () => {
        const partyId = 'partyId';
        spyOn(Parties, 'findOne');

        try {
          invite.call(loggedIn(), partyId, 'userId');
        } catch (e) {}

        expect(Parties.findOne).toHaveBeenCalledWith(partyId);
      });

      it('should fail if party does not exist', () => {
        spyOn(Parties, 'findOne').and.returnValue(undefined);

        expect(() => {
          invite.call(loggedIn(), 'partyId', 'userId');
        }).toThrowError(/404/);
      });

      it('should fail if logged in user is not the owner', () => {
        spyOn(Parties, 'findOne').and.returnValue({
          owner: 'notUserId'
        });

        expect(() => {
          invite.call(loggedIn(), 'partyId', 'userId');
        }).toThrowError(/404/);
      });

      it('should fail on public party', () => {
        spyOn(Parties, 'findOne').and.returnValue({
          owner: 'userId',
          public: true
        });

        expect(() => {
          invite.call(loggedIn(), 'partyId', 'userId');
        }).toThrowError(/400/);
      });

      it('should NOT invite user who is the owner', () => {
        spyOn(Parties, 'findOne').and.returnValue({
          owner: 'userId'
        });
        spyOn(Parties, 'update');

        invite.call(loggedIn(), 'partyId', 'userId');

        expect(Parties.update).not.toHaveBeenCalled();
      });

      it('should NOT invite user who has been already invited', () => {
        spyOn(Parties, 'findOne').and.returnValue({
          owner: 'userId',
          invited: ['invitedId']
        });
        spyOn(Parties, 'update');

        invite.call(loggedIn(), 'partyId', 'invitedId');

        expect(Parties.update).not.toHaveBeenCalled();
      });

      it('should invite user who has not been invited and is not the owner', () => {
        const partyId = 'partyId';
        const userId = 'notInvitedId';
        spyOn(Parties, 'findOne').and.returnValue({
          owner: 'userId',
          invited: ['invitedId']
        });
        spyOn(Parties, 'update');
        spyOn(Meteor.users, 'findOne').and.returnValue({});

        invite.call(loggedIn(), partyId, userId);

        expect(Parties.update).toHaveBeenCalledWith(partyId, {
          $addToSet: {
            invited: userId
          }
        });
      });
    });

    describe('rsvp', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        };
      }

      it('should be called from Method', () => {
        spyOn(rsvp, 'apply');

        try {
          Meteor.call('rsvp');
        } catch (e) {}

        expect(rsvp.apply).toHaveBeenCalled();
      });

      it('should fail on missing partyId', () => {
        expect(() => {
          rsvp.call({});
        }).toThrowError();
      });

      it('should fail on missing rsvp', () => {
        expect(() => {
          rsvp.call({}, 'partyId');
        }).toThrowError();
      });

      it('should fail if not logged in', () => {
        expect(() => {
          rsvp.call({}, 'partyId', 'rsvp');
        }).toThrowError(/403/);
      });

      it('should fail on wrong answer', () => {
        expect(() => {
          rsvp.call(loggedIn(), 'partyId', 'wrong');
        }).toThrowError(/400/);
      });

      ['yes', 'maybe', 'no'].forEach((answer) => {
        it(`should pass on '${answer}'`, () => {
          expect(() => {
            rsvp.call(loggedIn(), 'partyId', answer);
          }).not.toThrowError(/400/);
        });
      });

      // TODO: more tests  
    });
  });
}
