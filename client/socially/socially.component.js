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
@MeteorReactive
class socially {
  constructor() {
    this.helpers({
      isLoggedIn: this.isLoggedIn,
      currentUser: this.currentUser
    });
  }

  currentUser() {
    return Meteor.user();
  }

  isLoggedIn() {
    return Meteor.userId() !== null;
  }

  logout() {
    Accounts.logout();
  }
}