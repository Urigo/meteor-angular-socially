import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngFileUpload from 'ng-file-upload';

import { Meteor } from 'meteor/meteor';

import './partyUpload.html';

class PartyUpload {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);
  }

  addImages(files) {
    if (files.length) {
      this.currentFile = files[0];

      const reader = new FileReader;

      reader.onload = this.$bindToContext((e) => {
        this.cropImgSrc = e.target.result;
        this.myCroppedImage = '';
      });

      reader.readAsDataURL(files[0]);
    } else {
      this.cropImgSrc = undefined;
    }
  }
}

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
