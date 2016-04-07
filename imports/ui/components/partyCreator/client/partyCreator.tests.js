import { name as PartyCreator } from '../partyCreator';
import { Meteor } from 'meteor/meteor';
import 'angular-mocks';

describe('PartyCreator', () => {
  beforeEach(() => {
    window.module(PartyCreator);
  });

  describe('controller', () => {
    let $rootScope;
    let $componentController;
    const party = {
      _id: 'partyId'
    };

    beforeEach(() => {
      inject((_$rootScope_, _$componentController_) => {
        $rootScope = _$rootScope_;
        $componentController = _$componentController_;
      });
    });

    function component(bindings) {
      return $componentController(PartyCreator, {
        $scope: $rootScope.$new(true)
      }, bindings);
    }

    it('should return an empty string if there is no party', () => {
      const controller = component({
        party: undefined
      });

      expect(controller.creator).toEqual('');
    });

    it('should say `me` if logged in is the owner', () => {
      const owner = 'userId';
      // logged in
      spyOn(Meteor, 'userId').and.returnValue(owner);
      const controller = component({
        party: {
          owner
        }
      });

      expect(controller.creator).toEqual('me');
    });

    it('should say `nobody` if user does not exist', () => {
      const owner = 'userId';
      // not logged in
      spyOn(Meteor, 'userId').and.returnValue(null);
      // no user found
      spyOn(Meteor.users, 'findOne').and.returnValue(undefined);
      const controller = component({
        party: {
          owner
        }
      });

      expect(controller.creator).toEqual('nobody');
    });

    it('should return user data if user exists and it is not logged one', () => {
      const owner = 'userId';
      // not logged in
      spyOn(Meteor, 'userId').and.returnValue(null);
      // user found
      spyOn(Meteor.users, 'findOne').and.returnValue('found');
      const controller = component({
        party: {
          owner
        }
      });

      expect(controller.creator).toEqual('found');
    });
  });
});
