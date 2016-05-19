import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import template from './partyImage.html';
import { Images } from '../../../api/images';
import DisplayImageFilter from '../../filters/displayImageFilter';

class PartyImage {
  constructor($scope, $reactive) {
    'ngInject';
    $reactive(this).attach($scope);

    this.helpers({
      mainImage() {
        const images = this.getReactively('images', true);
        if (images) {
          return Images.findOne({
            _id: images[0]
          });
        }
      }
    });
  }
}

const name = 'partyImage';

// create a module
export const PartyImageNg1Module = angular.module(name, [
  angularMeteor,
  DisplayImageFilter.name
]);

export function registerPartyImage() {
  PartyImageNg1Module
    .component(name, {
      template,
      bindings: {
        images: '<'
      },
      controllerAs: name,
      controller: PartyImage
    });
}
