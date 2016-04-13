import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngFileUpload from 'ng-file-upload';
import 'ng-img-crop/compile/minified/ng-img-crop';
import 'ng-img-crop/compile/minified/ng-img-crop.css';


import { Meteor } from 'meteor/meteor';

import './partyUpload.html';
import { upload } from '../../../api/images';

class PartyUpload {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.uploaded = [];
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

  save() {
    upload(this.myCroppedImage, this.currentFile.name, this.$bindToContext((file) => {
      this.uploaded.push(file);
      this.reset();
    }), (e) => {
      console.log('Oops, something went wrong', e);
    });
  }

  reset() {
    this.cropImgSrc = undefined;
    this.myCroppedImage = '';
  }
}

const name = 'partyUpload';

// create a module
export default angular.module(name, [
  angularMeteor,
  ngFileUpload,
  'ngImgCrop'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PartyUpload
});
