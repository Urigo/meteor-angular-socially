Here you will see and change the details of the party:

<input ng-model="party.name" ng-disabled="party.owner != $root.currentUser._id">
<input ng-model="party.description" ng-disabled="party.owner != $root.currentUser._id">
<label>Is public</label>
<input type="checkbox" ng-model="party.public" ng-disabled="party.owner != $root.currentUser._id">

<ul ng-show="canInvite()">
  Users to invite:
  <li ng-repeat="user in users | uninvited:party">
    <div>{{ user | displayName }}</div>
    <button ng-click="invite(user)">Invite</button>
  </li>
  <li ng-if="(users | uninvited:party).length <= 0">
    Everyone are already invited.
  </li>
</ul>