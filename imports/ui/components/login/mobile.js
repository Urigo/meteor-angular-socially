import { Accounts } from 'meteor/accounts-base';

export class Login {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.isStepTwo = false;
    this.phoneNumber = '';
    this.verificationCode = '';
    this.error = '';
  }

  verifyPhone() {
    Accounts.requestPhoneVerification(this.phoneNumber, this.$bindToContext((err) => {
      if (err) {
        // display also reason of Meteor.Error
        this.error = err.reason || err;
      } else {
        this.error = '';
        // move to code verification
        this.isStepTwo = true;
      }
    }));
  }
}
