import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import 'angular-simple-logger';
import 'angular-google-maps';

import template from './partiesMap.html';

/**
 * PartiesMap component
 */
class PartiesMap {
  constructor() {
    this.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };
  }
}

const name = 'partiesMap';

// create a module
export const PartiesMapNg1Module = angular.module(name, [
  angularMeteor,
  'nemLogging', // https://github.com/angular-ui/angular-google-maps/issues/1633
  'uiGmapgoogle-maps'
]);

export function registerPartiesMap() {
  PartiesMapNg1Module
    .component(name, {
      template,
      controllerAs: name,
      bindings: {
        parties: '='
      },
      controller: PartiesMap
    });
}
