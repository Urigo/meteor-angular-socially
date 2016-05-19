import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import * as template from './partyAdd.html';
import { Parties } from '../../../api/parties';
import PartyUpload from '../partyUpload/partyUpload';

class PartyAdd {
  constructor() {
    this.party = {};
  }

  submit() {
    this.party.owner = Meteor.user()._id;
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
export default angular.module(name, [
  angularMeteor,
  PartyUpload.name
]).component(name, {
  template,
  bindings: {
    done: '&?'
  },
  controllerAs: name,
  controller: PartyAdd
});
