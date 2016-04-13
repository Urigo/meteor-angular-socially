import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngFileUpload from 'ng-file-upload';
import 'angular-sortable-view';
import 'ng-img-crop/compile/minified/ng-img-crop';
import 'ng-img-crop/compile/minified/ng-img-crop.css';


import { Meteor } from 'meteor/meteor';

import './partyUpload.html';
import { Thumbs, upload } from '../../../api/images';

class PartyUpload {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.uploaded = [];

    this.subscribe('thumbs', () => [
      this.getReactively('files', true) || []
    ]);

    this.helpers({
      thumbs() {
        return Thumbs.find({
          originalStore: 'images',
          originalId: {
            $in: this.getReactively('files', true) || []
          }
        });
      }
    });
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

      if (!this.files || !this.files.length) {
        this.files = [];
      }
      this.files.push(file._id);

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
  'ngImgCrop',
  'angular-sortable-view'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    files: '=?'
  },
  controllerAs: name,
  controller: PartyUpload
});
