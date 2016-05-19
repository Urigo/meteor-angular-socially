import { Component, Input } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';

import { Meteor } from 'meteor/meteor';

import template from './partyUninvited.html';

@Component({
  template,
  selector: 'party-uninvited'
})
export class PartyUninvited extends MeteorComponent {
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
