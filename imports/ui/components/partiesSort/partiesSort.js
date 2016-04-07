import angular from 'angular';
import angularMeteor from 'angular-meteor';

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
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  bindings: {
    onChange: '&',
    property: '@',
    order: '@'
  },
  controllerAs: name,
  controller: PartiesSort
});
