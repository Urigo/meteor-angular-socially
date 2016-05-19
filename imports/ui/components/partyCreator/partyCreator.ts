import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './partyCreator.html';
import DisplayNameFilter from '../../filters/displayNameFilter';

/**
 * PartyCreator component
 */
class PartyCreator {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);

    this.subscribe('users');

    this.helpers({
      creator() {
        if (!this.party) {
          return '';
        }

        const owner = this.party.owner;

        if (Meteor.userId() !== null && owner === Meteor.userId()) {
          return 'me';
        }

        return Meteor.users.findOne(owner) || 'nobody';
      }
    });
  }
}

const name = 'partyCreator';

// create a module
export const PartyCreatorNg1Module = angular.module(name, [
  angularMeteor,
  DisplayNameFilter.name
]);

export function registerPartyCreator() {
  PartyCreatorNg1Module
    .component(name, {
      template,
      controllerAs: name,
      bindings: {
        party: '<'
      },
      controller: PartyCreator
    });
}
