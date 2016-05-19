import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import * as _ from 'underscore';

import { Meteor } from 'meteor/meteor';

import template from './partyRsvp.html';

class PartyRsvp {
  yes() {
    this.answer('yes');
  }
  isYes() {
    return this.isAnswer('yes');
  }

  maybe() {
    this.answer('maybe');
  }
  isMaybe() {
    return this.isAnswer('maybe');
  }

  no() {
    this.answer('no');
  }
  isNo() {
    return this.isAnswer('no');
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
  isAnswer(answer) {
    if(this.party) {
      return !!_.findWhere(this.party.rsvps, {
        user: Meteor.userId(),
        rsvp: answer
      });
    }
  }
}

const name = 'partyRsvp';

// create a module
export const PartyRsvpNg1Module = angular.module(name, [
  angularMeteor
])

export function registerPartyRsvp() {
  PartyRsvpNg1Module
    .component(name, {
      template,
      controllerAs: name,
      bindings: {
        party: '<'
      },
      controller: PartyRsvp
    });
}
