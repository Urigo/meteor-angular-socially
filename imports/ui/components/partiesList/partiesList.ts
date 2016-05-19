import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import * as uiRouter from 'angular-ui-router';
import * as utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

import * as webTemplate from './web.html';
import * as mobileTemplate from './mobile.html';
import { Parties } from '../../../api/parties';
import PartiesSort from '../partiesSort/partiesSort';
import PartiesMap from '../partiesMap/partiesMap';
import PartyAddButton from '../partyAddButton/partyAddButton';
import PartyRemove from '../partyRemove/partyRemove';
import PartyCreator from '../partyCreator/partyCreator';
import PartyRsvp from '../partyRsvp/partyRsvp';
import PartyRsvpsList from '../partyRsvpsList/partyRsvpsList';
import PartyImage from '../partyImage/partyImage';

class PartiesList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('parties', () => [{
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.subscribe('users');
    this.subscribe('images');

    this.helpers({
      parties() {
        return Parties.find({}, {
          sort : this.getReactively('sort')
        });
      },
      partiesCount() {
        return Counts.get('numberOfParties');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });
  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}

const name = 'partiesList';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  PartiesSort.name,
  PartiesMap.name,
  PartyAddButton.name,
  PartyRemove.name,
  PartyCreator.name,
  PartyRsvp.name,
  PartyRsvpsList.name,
  PartyImage.name
]).component(name, {
  template,
  controllerAs: name,
  controller: PartiesList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('parties', {
      url: '/parties',
      template: '<parties-list></parties-list>'
    });
}
