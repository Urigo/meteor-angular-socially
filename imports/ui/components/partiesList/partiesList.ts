import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import * as uiRouter from 'angular-ui-router';
import * as utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

import webTemplate from './web.html';
import mobileTemplate from './mobile.html';
import { Parties } from '../../../api/parties';
import { PartiesSortNg1Module } from '../partiesSort/partiesSort';
import { PartiesMapNg1Module } from '../partiesMap/partiesMap';
import { PartyAddButtonNg1Module } from '../partyAddButton/partyAddButton';
import { PartyRemoveNg1Module } from '../partyRemove/partyRemove';
import { PartyCreatorNg1Module } from '../partyCreator/partyCreator';
import { PartyRsvpNg1Module } from '../partyRsvp/partyRsvp';
import { PartyRsvpsListNg1Module } from '../partyRsvpsList/partyRsvpsList';
import { PartyImageNg1Module } from '../partyImage/partyImage';

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
export const PartiesListNg1Module = angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  PartiesSortNg1Module.name,
  PartiesMapNg1Module.name,
  PartyAddButtonNg1Module.name,
  PartyRemoveNg1Module.name,
  PartyCreatorNg1Module.name,
  PartyRsvpNg1Module.name,
  PartyRsvpsListNg1Module.name,
  PartyImageNg1Module.name
]);

export function registerPartiesList() {
  PartiesListNg1Module
    .component(name, {
      template,
      controllerAs: name,
      controller: PartiesList
    })
    .config(config);
}

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('parties', {
      url: '/parties',
      template: '<parties-list></parties-list>'
    });
}
