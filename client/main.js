import 'angular'
import 'reflect-metadata'
import 'rxjs'
import 'zone.js/dist/zone'
import { upgradeAdapter } from '../imports/ui/upgradeAdapter'
 
import angular from 'angular';

import { Meteor } from 'meteor/meteor';

import { name as Socially } from '../imports/ui/components/socially/socially';

function onReady() {
  
  upgradeAdapter.bootstrap(document, [
    Socially
  ], {
    strictDi: true
  });
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
