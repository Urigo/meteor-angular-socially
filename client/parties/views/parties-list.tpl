<div class="row parties-list">
  <div class="col-md-6 col-md-offset-3">
    <form ng-show="$root.currentUser">
      <h2>Create a new party:</h2>
      <label>Name</label>
      <input ng-model="newParty.name">
      <label>Description</label>
      <input ng-model="newParty.description">
      <label>Public</label>
      <input type="checkbox" ng-model="newParty.public">
      <button ng-click="newParty.owner=$root.currentUser._id;parties.push(newParty)" class="btn btn-default">Add</button>
    </form>
    <h1 ng-hide="$root.currentUser">
      Log in to create a party!
    </h1>
    <ul class="list-unstyled">
      <h1>Parties:</h1>
      <div>
        <input type="search" ng-model="search" placeholder="Search">
        <select ng-model="orderProperty">
          <option value="1">Ascending</option>
          <option value="-1">Descending</option>
        </select>
      </div>
      <div class="angular-google-map-container">
        <ui-gmap-google-map center="map.center" zoom="map.zoom">
          <ui-gmap-markers models="filteredParties" coords="'location'" click="'onClicked'"
                           fit="true" idkey="'_id'" doRebuildAll="true">
          </ui-gmap-markers>
        </ui-gmap-google-map>
      </div>
      <li dir-paginate="party in parties | itemsPerPage: perPage | filter:search"
          class="party" total-items="partiesCount.count">
        <h1><a href="/parties/{{party._id}}">{{party.name}}</a></h1>

        <p>{{party.description}}</p>
        <button ng-click="remove(party)" ng-show="$root.currentUser && $root.currentUser._id == party.owner">X</button>
        <div ng-show="$root.currentUser">
          <input type="button" value="I'm going!" ng-click="rsvp(party._id, 'yes')" class="btn btn-default btn-sm">
          <input type="button" value="Maybe" ng-click="rsvp(party._id, 'maybe')" class="btn btn-default btn-sm">
          <input type="button" value="No" ng-click="rsvp(party._id, 'no')" class="btn btn-default btn-sm">
        </div>
        <div ng-hide="$root.currentUser">
          <i>Sign in to RSVP for this party.</i>
        </div>
        <div class="attendance well well-small">
          <div class="text-muted"><b>Who is coming:</b></div>
          <div>Yes - {{ (party.rsvps | filter:{rsvp:'yes'}).length }}</div>
          <div>Maybe - {{ (party.rsvps | filter:{rsvp:'maybe'}).length }}</div>
          <div>No - {{ (party.rsvps | filter:{rsvp:'no'}).length }}</div>
          <div ng-repeat="rsvp in party.rsvps | filter:{rsvp:'yes'}">
            {{ getUserById(rsvp.user) | displayName }} - <span class="label label-success">{{ rsvp.rsvp }}</span>
          </div>
          <div ng-repeat="rsvp in party.rsvps | filter:{rsvp:'maybe'}">
            {{ getUserById(rsvp.user) | displayName }} - <span class="label label-info">{{ rsvp.rsvp }}</span>
          </div>
          <div ng-repeat="rsvp in party.rsvps | filter:{rsvp:'no'}">
            {{ getUserById(rsvp.user) | displayName }} - <span class="label label-danger">{{ rsvp.rsvp }}</span>
          </div>
          <ul ng-if="!party.public">
            <div class="text-muted"><b>Users who not responded:</b></div>
            <li ng-repeat="invitedUser in outstandingInvitations(party)">
              {{ invitedUser | displayName }}  - <span class="label label-primary">Invited</span>
            </li>
          </ul>
          <div ng-if="party.public">
            <div class="text-muted"><b>Everyone is invited</b></div>
          </div>
        </div>

        <p><small>Posted by {{ creator(party) | displayName }}</small></p>
      </li>
    </ul>
    <dir-pagination-controls on-page-change="pageChanged(newPageNumber)"></dir-pagination-controls>
  </div>
</div>