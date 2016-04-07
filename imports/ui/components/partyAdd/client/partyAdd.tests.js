import { name as PartyAdd } from '../partyAdd';
import { Parties } from '../../../../api/parties';
import 'angular-mocks';

describe('PartyAdd', () => {
  beforeEach(() => {
    window.module(PartyAdd);
  });

  describe('controller', () => {
    let controller;
    const party = {
      name: 'Foo',
      description: 'Birthday of Foo'
    };

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(PartyAdd, {
          $scope: $rootScope.$new(true)
        });
      });
    });

    describe('reset()', () => {
      it('should clean up party object', () => {
        controller.party = party;
        controller.reset();

        expect(controller.party).toEqual({});
      });
    });

    describe('submit()', () => {
      beforeEach(() => {
        spyOn(Parties, 'insert');
        spyOn(controller, 'reset').and.callThrough();

        controller.party = party;

        controller.submit();
      });

      it('should insert a new party', () => {
        expect(Parties.insert).toHaveBeenCalledWith(party);
      });

      it('should call reset()', () => {
        expect(controller.reset).toHaveBeenCalled();
      });
    });
  });
});
