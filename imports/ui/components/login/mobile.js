import { Accounts } from 'meteor/accounts-base';

export class Login {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

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

  verifyCode() {
    Accounts.verifyPhone(this.phoneNumber, this.verificationCode, this.$bindToContext((err) => {
      if (err) {
        this.error = err.reason || err;
      } else {
        // redirect to parties list
        this.$state.go('parties');
      }
    }));
  }
}
