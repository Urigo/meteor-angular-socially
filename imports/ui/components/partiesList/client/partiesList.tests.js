import { name as PartiesList } from '../partiesList';
import 'angular-mocks';

describe('PartiesList', () => {
  beforeEach(() => {
    window.module(PartiesList);
  });

  describe('controller', () => {
    let controller;

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(PartiesList, {
          $scope: $rootScope.$new(true)
        });
      });
    });

    it('should have perPage that equals 3 by default', () => {
      expect(controller.perPage).toEqual(3);
    });

    it('should have page that equals 1 by default', () => {
      expect(controller.page).toEqual(1);
    });

    it('should sort by name - ASC', () => {
      expect(controller.sort).toEqual({
        name: 1
      });
    });

    it('should be able to change sorting', () => {
      controller.sortChanged({
        name: -1
      });

      expect(controller.sort).toEqual({
        name: -1
      });
    });

    it('should be able to change page', () => {
      controller.pageChanged(2);

      expect(controller.page).toEqual(2);
    });
  });
});
