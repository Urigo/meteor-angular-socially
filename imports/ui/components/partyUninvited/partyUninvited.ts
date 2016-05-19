import { Component, Input } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';

import { Meteor } from 'meteor/meteor';

import * as template from './partyUninvited.html';
import { UninvitedPipe } from '../../filters/uninvitedPipe';
import { DisplayNamePipe } from '../../filters/displayNamePipe';

@Component({
  template,
  selector: 'party-uninvited',
  pipes: [
    UninvitedPipe,
    DisplayNamePipe
  ]
})
export default class PartyUninvited extends MeteorComponent {
  @Input() party: any;

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
