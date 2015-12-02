angular.module('socially').directive('addNewPartyModal', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/parties/add-new-party-modal/add-new-party-modal.html',
    controllerAs: 'addNewPartyModal',
    controller: function ($scope, $stateParams, $reactive, $mdDialog) {
      $reactive(this).attach($scope);

      this.helpers({
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        }
      });

      this.newParty = {};

      this.addNewParty = () => {
        this.newParty.owner = Meteor.userId();
        this.newParty.images = (this.newParty.images || {}).map((image) => {
          return image._id;
        });

        Parties.insert(this.newParty);
        this.newParty = {};
        $mdDialog.hide();
      };

      this.close = () => {
        $mdDialog.hide();
      };

      this.addImages = (files) => {
        if (files.length > 0) {
          let reader = new FileReader();

          reader.onload = (e) => {
            $scope.$apply(() => {
              this.cropImgSrc = e.target.result;
              this.myCroppedImage = '';
            });
          };

          reader.readAsDataURL(files[0]);
        }
        else {
          this.cropImgSrc = undefined;
        }
      };

      this.saveCroppedImage = () => {
        if (this.myCroppedImage !== '') {
          Images.insert(this.myCroppedImage, (err, fileObj) => {
            if (!this.newParty.images) {
              this.newParty.images = [];
            }

            this.newParty.images.push(fileObj);
            this.cropImgSrc = undefined;
            this.myCroppedImage = '';
          });
        }
      };

      this.updateDescription = ($data, image) => {
        Images.update({_id: image._id}, {$set: {'metadata.description': $data}});
      };
    }
  }
});