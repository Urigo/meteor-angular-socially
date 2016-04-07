import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import './partyRsvp.html';

class PartyRsvp {
  yes() {
    this.answer('yes');
  }

  maybe() {
    this.answer('maybe');
  }

  no() {
    this.answer('no');
  }

  answer(answer) {
    Meteor.call('rsvp', this.party._id, answer, (error) => {
      if (error) {
        console.error('Oops, unable to rsvp!');
      } else {
        console.log('RSVP done!')
      }
    });
  }
}

const name = 'partyRsvp';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  bindings: {
    party: '<'
  },
  controller: PartyRsvp
});
