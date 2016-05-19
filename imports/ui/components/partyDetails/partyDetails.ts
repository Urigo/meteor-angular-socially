import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import * as uiRouter from 'angular-ui-router';
import { Component } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';

import { Meteor } from 'meteor/meteor';

import * as template from './partyDetails.html';
import { Parties } from '../../../api/parties';
import PartyUninvited from '../partyUninvited/partyUninvited';
import PartyMap from '../partyMap/partyMap';
import { upgradeAdapter } from '../../upgradeAdapter';

@Component({
  template,
  selector: 'party-details',
  directives: [
    PartyUninvited,
    upgradeAdapter.upgradeNg1Component('partyMap'),
  ]
})
class PartyDetails extends MeteorComponent {
  partyId: string;
  party: Object = {};
  users: Object[];
  isLoggedIn: boolean;

  constructor() {
    super();

    this.subscribe('parties');
    this.subscribe('users');

    this.autorun(() => {
      this.party = Parties.findOne({
        _id: this.partyId
      });

      this.users = Meteor.users.find({}).fetch();

      this.isLoggedIn = !!Meteor.userId();
    }, true);
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
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  PartyUninvited.name,
  PartyMap.name
]).component(name, {
  template,
  controllerAs: name,
  controller: PartyDetails
})
  .config(config);

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
