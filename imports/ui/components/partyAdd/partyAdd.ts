import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './partyAdd.html';
import { Parties } from '../../../api/parties';
import { PartyUploadNg1Module } from '../partyUpload/partyUpload';

class PartyAdd {
  constructor() {
    this.party = {};
  }

  submit() {
    this.party.owner = Meteor.userId();
    Parties.insert(this.party);

    if(this.done) {
      this.done();
    }

    this.reset();
  }

  reset() {
    this.party = {};
  }
}

const name = 'partyAdd';

// create a module
export const PartyAddNg1Module = angular.module(name, [
  angularMeteor,
  PartyUploadNg1Module.name
]);

export function registerPartyAdd() {
  PartyAddNg1Module
    .component(name, {
      template,
      bindings: {
        done: '&?'
      },
      controllerAs: name,
      controller: PartyAdd
    });
}
