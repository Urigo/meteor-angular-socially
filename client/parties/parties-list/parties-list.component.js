let {Component, View, SetModule, Inject, MeteorReactive} = angular2now;

SetModule('socially');

@Component({selector: 'parties-list'})
@View({
  templateUrl: () => {
    if (Meteor.isCordova) {
      return '/packages/socially-mobile/client/parties/parties-list/parties-list.html';
    }

    return '/packages/socially-browser/client/parties/parties-list/parties-list.html';
  }
})
@Inject('$mdDialog', '$filter')
@MeteorReactive
class partiesList {
  constructor($mdDialog, $filter) {
    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.orderProperty = '1';
    this.searchText = '';

    this.helpers({
      parties: this._partiesCollection,
      users: this._usersCollection,
      partiesCount: this._partiesCount,
      isLoggedIn: this._isLoggedIn,
      currentUserId: this._currentUserId,
      images: this._imagesCollection
    });

    this.subscribe('images');
    this.subscribe('users');
    this.subscribe('parties', this._partiesSubscription.bind(this));
    this.defineMapProperties();
  }

  _imagesCollection() {
    return Images.find({});
  }

  _currentUserId() {
    return Meteor.userId();
  }

  _isLoggedIn() {
    return Meteor.userId() !== null;
  }

  _partiesCount() {
    return Counts.get('numberOfParties');
  }

  _usersCollection() {
    return Meteor.users.find({});
  }

  _partiesCollection() {
    return Parties.find({}, {sort: this.getReactively('sort')});
  }

  _partiesSubscription() {
    return [
      {
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      },
      this.getReactively('searchText')
    ]
  }

  removeParty(party) {
    Parties.remove({_id: party._id});
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  updateSort() {
    this.sort = {
      name: parseInt(this.orderProperty)
    }
  }

  getPartyCreator(party) {
    if (!party) {
      return '';
    }

    let owner = Meteor.users.findOne(party.owner);

    if (!owner) {
      return 'nobody';
    }

    if (Meteor.userId() !== null && owner._id === Meteor.userId()) {
      return 'me';
    }

    return owner;
  }

  rsvp(partyId, rsvp) {
    Meteor.call('rsvp', partyId, rsvp, (error) => {
      if (error) {
        console.log('Oops, unable to rsvp!');
      }
      else {
        console.log('RSVP Done!');
      }
    });
  }

  getUserById(userId) {
    return Meteor.users.findOne(userId);
  }

  outstandingInvitations(party) {
    return _.filter(this.users, (user) => {
      return (_.contains(party.invited, user._id) && !_.findWhere(party.rsvps, {user: user._id}));
    });
  }

  openAddNewPartyModal() {
    $mdDialog.show({
      template: '<add-new-party-modal></add-new-party-modal>',
      clickOutsideToClose: true
    });
  }

  isRSVP(rsvp, party) {
    if (Meteor.userId() == null) {
      return false;
    }

    let rsvpIndex = party.myRsvpIndex;
    rsvpIndex = rsvpIndex || _.indexOf(_.pluck(party.rsvps, 'user'), Meteor.userId());

    if (rsvpIndex !== -1) {
      party.myRsvpIndex = rsvpIndex;

      return party.rsvps[rsvpIndex].rsvp === rsvp;
    }
  }

  getMainImage(images, onlyUrl) {
    if (images && images.length && images[0] && images[0]) {
      var url = $filter('filter')(this.images, {_id: images[0]})[0].url();

      if (onlyUrl) {
        return url;
      }

      return {
        'background-image': 'url("' + url + '")'
      }
    }
  }

  defineMapProperties() {
    this.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      options: {
        maxZoom: 10,
        styles: [{
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#444444"}]
        }, {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [{"color": "#f2f2f2"}]
        }, {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        }, {
          "featureType": "road",
          "elementType": "all",
          "stylers": [{"saturation": -100}, {"lightness": 45}]
        }, {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [{"visibility": "simplified"}]
        }, {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [{"visibility": "off"}]
        }, {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        }, {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
        }]
      },
      zoom: 8
    };
  }
}