<form>
  <label>Name</label>
  <input ng-model="newParty.name">
  <label>Description</label>
  <input ng-model="newParty.description">
  <button ng-click="newParty.owner=$root.currentUser._id;parties.push(newParty)">Add</button>
</form>
<ul>
  <li ng-repeat="party in parties">
    <a href="/parties/{{party._id}}">{{party.name}}</a>
    <p>{{party.description}}</p>
    <button ng-click="remove(party)">X</button>
  </li>
</ul>
