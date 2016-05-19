import { name as PartyRemove } from '../partyRemove';
import { Parties } from '../../../../api/parties';
import 'angular-mocks';

describe('PartyRemove', () => {
  beforeEach(() => {
    window.module(PartyRemove);
  });

  describe('controller', () => {
    let controller;
    const party = {
      _id: 'partyId'
    };

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(PartyRemove, {
          $scope: $rootScope.$new(true)
        }, {
          party
        });
      });
    });

    describe('remove()', () => {
      beforeEach(() => {
        spyOn(Parties, 'remove');
        controller.remove();
      });

      it('should remove a party', () => {
        expect(Parties.remove).toHaveBeenCalledWith(party._id);
      });
    });
  });
});
