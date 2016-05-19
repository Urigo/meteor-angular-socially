import * as angular from 'angular';

import { Meteor } from 'meteor/meteor';

import Socially from '../imports/ui/components/socially/socially';

function onReady() {
  angular.bootstrap(document, [
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
