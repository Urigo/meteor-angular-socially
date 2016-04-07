import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-simple-logger';
import 'angular-google-maps';

import './partyMap.css';
import template from './partyMap.html';

class PartyMap {
  constructor($scope) {
    'ngInject';

    this.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8,
      events: {}
    };

    this.marker = {
      options: {
        draggable: true
      },
      events: {}
    };
  }
}

const name = 'partyMap';

// create a module
export default angular.module(name, [
  angularMeteor,
  'nemLogging', // https://github.com/angular-ui/angular-google-maps/issues/1633
  'uiGmapgoogle-maps'
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    location: '='
  },
  controller: PartyMap
});
