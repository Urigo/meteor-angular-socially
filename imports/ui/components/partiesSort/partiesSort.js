import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './partiesSort.html';

class PartiesSort {
  constructor() {
    this.changed();
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
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    onChange: '&',
    property: '@',
    order: '@'
  },
  controllerAs: name,
  controller: PartiesSort
});
