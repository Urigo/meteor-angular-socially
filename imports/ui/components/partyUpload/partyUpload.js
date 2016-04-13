import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngFileUpload from 'ng-file-upload';

import { Meteor } from 'meteor/meteor';

import './partyUpload.html';

class PartyUpload {}

const name = 'partyUpload';

// create a module
export default angular.module(name, [
  angularMeteor,
  ngFileUpload
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PartyUpload
});
