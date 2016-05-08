import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

class Register {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    this.credentials = {
      email: ''
    };

    this.error = '';
  }

  reset() {
    Accounts.forgotPassword(this.credentials, this.$bindToContext((err) => {
      if (err) {
        this.error = err;
      } else {
        this.$state.go('parties');
      }
    }));
  }
}

const name = 'password';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Register
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('password', {
    url: '/password',
    template: '<password></password>'
  });
}
