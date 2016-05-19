import 'reflect-metadata';
import 'zone.js/dist/zone';
import * as angular from 'angular';
import { upgradeAdapter } from '../imports/ui/upgradeAdapter';

import { Meteor } from 'meteor/meteor';

import Socially from '../imports/ui/components/socially/socially';

function onReady() {
  upgradeAdapter.bootstrap(document.body, [
    Socially.name
  ], {
    strictDi: true
  });
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
