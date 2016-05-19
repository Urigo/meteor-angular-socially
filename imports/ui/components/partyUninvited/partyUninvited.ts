import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import { Component } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';

import { Meteor } from 'meteor/meteor';

import * as template from './partyUninvited.html';
import { UninvitedPipe } from '../../filters/uninvitedPipe';
import { DisplayNamePipe } from '../../filters/displayNamePipe';
import { upgradeAdapter } from '../../upgradeAdapter';

@Component({
  template,
  selector: 'party-uninvited',
  pipes: [
    UninvitedPipe,
    DisplayNamePipe
  ]
})
class PartyUninvited extends MeteorComponent {
  constructor() {
    super();

    this.autorun(() => {
      this.users = Meteor.users.find({}).fetch();
    });
  }

  invite(user) {
    Meteor.call('invite', this.party._id, user._id,
      (error) => {
        if (error) {
          console.log('Oops, unable to invite!');
        } else {
          console.log('Invited!');
        }
      }
    );
  }
}

const name = 'partyUninvited';

// create a module
export default angular.module(name, [
  angularMeteor
]).directive(name, upgradeAdapter.downgradeNg2Component(PartyUninvited));
