import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import template from './partiesSort.html';

class PartiesSort {
  constructor($timeout) {
    'ngInject';

    $timeout(() => this.changed());
  }

  changed() {
    this.onChange({
      sort: {
        [this.property]: parseInt(this.order)
      }
    });
  }
}

const name = 'partiesSort';

// create a module
export const PartiesSortNg1Module = angular.module(name, [
  angularMeteor
]);

export function registerPartiesSort() {
  PartiesSortNg1Module
    .component(name, {
      template,
      bindings: {
        onChange: '&',
        property: '@',
        order: '@'
      },
      controllerAs: name,
      controller: PartiesSort
    });
}
