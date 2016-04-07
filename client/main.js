import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Parties } from '../collections/parties';

angular.module('socially', [
    angularMeteor
  ])
  .controller('PartiesListCtrl', function($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
      parties() {
        return Parties.find({});
      }
    });
  });
