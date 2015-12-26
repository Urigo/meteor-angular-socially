let {Component, View, SetModule, Inject, MeteorReactive} = angular2now;

SetModule('socially');

@Component({selector: 'socially'})
@View({templateUrl: () => {
  if (Meteor.isCordova) {
    return '/packages/socially-mobile/client/socially/socially.html';
  }
  else {
    return '/packages/socially-browser/client/socially/socially.html';
  }
}})
@Inject('$reactive', '$scope')
class socially {
  constructor($reactive, $scope) {
    $reactive(this).attach($scope);

    this.helpers({
      isLoggedIn: () => {
        return Meteor.userId() !== null;
      },
      currentUser: () => {
        return Meteor.user();
      }
    });

    this.logout = () => {
      Accounts.logout();
    }
  }
}