import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import * as uiRouter from 'angular-ui-router';
import { Component } from '@angular/core';

import { Meteor } from 'meteor/meteor';

import template from './partyDetails.html';
import { Parties } from '../../../api/parties';
import { PartyUninvitedNg1Module } from '../partyUninvited/partyUninvited';
import { PartyMapNg1Module } from '../partyMap/partyMap';

@Component({
  template,
  selector: 'party-details'
})
export class PartyDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.partyId = $stateParams.partyId;

    this.subscribe('parties');
    this.subscribe('users');

    this.helpers({
      party() {
        return Parties.findOne({
          _id: $stateParams.partyId
        });
      },
      users() {
        return Meteor.users.find({});
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      isOwner() {
        if (!this.party) {
          return false;
        }

        return this.party.owner === Meteor.userId();
      }
    });
  }

  canInvite() {
    if (!this.party) {
      return false;
    }

    return !this.party.public && this.party.owner === Meteor.userId();
  }

  save() {
    Parties.update({
      _id: this.party._id
    }, {
      $set: {
        name: this.party.name,
        description: this.party.description,
        public: this.party.public,
        location: this.party.location
      }
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the party...');
      } else {
        console.log('Done!');
      }
    });
  }
}

const name = 'partyDetails';

// create a module
export const PartyDetailsNg1Module = angular.module(name, [
  angularMeteor,
  uiRouter,
  PartyUninvitedNg1Module.name,
  PartyMapNg1Module.name
]);

export function registerPartyDetails() {
  PartyDetailsNg1Module
    .component(name, {
      template,
      controllerAs: name,
      controller: PartyDetails
    })
    .config(config);
}

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('partyDetails', {
    url: '/parties/:partyId',
    template: '<party-details></party-details>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  });
}
