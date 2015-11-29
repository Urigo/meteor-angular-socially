angular.module('socially').directive('partiesList', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/parties/parties-list/parties-list.html',
    controllerAs: 'partiesList',
    controller: function ($scope, $reactive) {
      $reactive(this).attach($scope);

      this.newParty = {};
      this.perPage = 3;
      this.page = 1;
      this.sort = {
        name: 1
      };
      this.orderProperty = '1';
      this.searchText = '';

      this.helpers({
        parties: () => {
          return Parties.find({}, { sort : this.getReactively('sort') });
        },
        partiesCount: () => {
          return Counts.get('numberOfParties');
        }
      });

      this.subscribe('users');

      this.subscribe('parties', () => {
        return [
          {
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.addParty = () => {
        this.newParty.owner = Meteor.user()._id;
        Parties.insert(this.newParty);
        this.newParty = {};
      };

      this.removeParty = (party) => {
        Parties.remove({_id: party._id});
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.updateSort = () => {
        this.sort = {
          name: parseInt(this.orderProperty)
        }
      };

      this.getPartyCreator = function(party){
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
      };

      this.rsvp = (partyId, rsvp) => {
        Meteor.call('rsvp', partyId, rsvp, (error) => {
          if (error) {
            console.log('Oops, unable to rsvp!');
          }
          else {
            console.log('RSVP Done!');
          }
        });
      };
    }
  }
});