import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './partyAdd.html';
import { Parties } from '../../../api/parties';

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
  angularMeteor
]).component(name, {
  template,
  bindings: {
    done: '&?'
  },
  controllerAs: name,
  controller: PartyAdd
});
