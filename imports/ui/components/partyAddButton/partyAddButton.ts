import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import * as buttonTemplate from './partyAddButton.html';
import * as modalTemplate from './partyAddModal.html';
import PartyAdd from '../partyAdd/partyAdd';

class PartyAddButton {
  constructor($mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia
  }

  open(event) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'partyAddModal',
      template: modalTemplate,
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    });
  }
}

const name = 'partyAddButton';

// create a module
export default angular.module(name, [
  angularMeteor,
  PartyAdd.name
]).component(name, {
  template: buttonTemplate,
  controllerAs: name,
  controller: PartyAddButton
});
