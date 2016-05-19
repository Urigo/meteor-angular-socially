import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import { Component } from '@angular/core';

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
class PartyUninvited {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);

    this.helpers({
      users() {
        return Meteor.users.find({});
      }
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
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    party: '<'
  },
  controller: PartyUninvited
});
