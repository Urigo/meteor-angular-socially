[{]: <region> (header)
# Step 15: Conditional template directives with AngularJS
[}]: #
[{]: <region> (body)
Angular 1 has great and very simple directives that help us show and hide DOM elements conditionally.
You can bind them to an expression, variables or functions.

# ng-show and ng-hide

First, let's learn about [ng-show](https://docs.angularjs.org/api/ng/directive/ngShow) and [ng-hide](https://docs.angularjs.org/api/ng/directive/ngHide).

So one thing we want to hide and show is the form for creating a new party. If a user is not logged in, they can't create a party, so why displaying the form for them?
If the user is not logged in, we want to display a message saying they need to log in to create a new party.

In `PartiesList` add a `ng-show` directive to the PartyAdd like that:

[{]: <helper> (diff_step 15.1)
#### Step 15.1: Add ngShow to PartyAdd

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊<party-add></party-add>
+┊ ┊1┊<party-add ng-show="partiesList.isLoggedIn"></party-add>
 ┊2┊2┊
 ┊3┊3┊<input type="search" ng-model="partiesList.searchText" placeholder="Search" />
```
[}]: #

Now, we need to add the ability to detect if there is a user logged in at the moment, so let's add a helper for that:

[{]: <helper> (diff_step 15.2)
#### Step 15.2: Add isLoggedIn helper

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -45,6 +45,9 @@
 ┊45┊45┊      },
 ┊46┊46┊      partiesCount() {
 ┊47┊47┊        return Counts.get('numberOfParties');
+┊  ┊48┊      },
+┊  ┊49┊      isLoggedIn() {
+┊  ┊50┊        return !!Meteor.userId();
 ┊48┊51┊      }
 ┊49┊52┊    });
 ┊50┊53┊  }
```
[}]: #

Then right after the form, add this HTML:

[{]: <helper> (diff_step 15.3)
#### Step 15.3: Add usage for ng-hide

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -1,4 +1,7 @@
 ┊1┊1┊<party-add ng-show="partiesList.isLoggedIn"></party-add>
+┊ ┊2┊<div ng-hide="partiesList.isLoggedIn">
+┊ ┊3┊  Log in to create a party!
+┊ ┊4┊</div>
 ┊2┊5┊
 ┊3┊6┊<input type="search" ng-model="partiesList.searchText" placeholder="Search" />
```
[}]: #

That is exactly the opposite - if `isLoggedIn` is true or we're in the processing of logging in, hide that div.

Now add the same to the PartyRsvp:

[{]: <helper> (diff_step 15.4)
#### Step 15.4: Add ngShow to PartyRsvp

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -14,7 +14,7 @@
 ┊14┊14┊    </a>
 ┊15┊15┊    <p>{{party.description}}</p>
 ┊16┊16┊    <party-remove party="party"></party-remove>
-┊17┊  ┊    <party-rsvp party="party"></party-rsvp>
+┊  ┊17┊    <party-rsvp party="party" ng-show="partiesList.isLoggedIn"></party-rsvp>
 ┊18┊18┊    <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
 ┊19┊19┊    <party-unanswered party="party"></party-unanswered>
 ┊20┊20┊    <party-creator party="party"></party-creator>
```
[}]: #

Add let's add this after the RSVP buttons:

[{]: <helper> (diff_step 15.5)
#### Step 15.5: Add message for not-logged in users on the RSVP buttons

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -15,6 +15,10 @@
 ┊15┊15┊    <p>{{party.description}}</p>
 ┊16┊16┊    <party-remove party="party"></party-remove>
 ┊17┊17┊    <party-rsvp party="party" ng-show="partiesList.isLoggedIn"></party-rsvp>
+┊  ┊18┊    <div ng-hide="partiesList.isLoggedIn">
+┊  ┊19┊      <i>Sign in to RSVP for this party.</i>
+┊  ┊20┊    </div>
+┊  ┊21┊    
 ┊18┊22┊    <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
 ┊19┊23┊    <party-unanswered party="party"></party-unanswered>
 ┊20┊24┊    <party-creator party="party"></party-creator>
```
[}]: #

Next thing we want to hide is the 'delete party' option, in case the logged-in user is not the party's owner.

Lets add ng-show to the delete button like that:

[{]: <helper> (diff_step 15.7)
#### Step 15.7: Add ngShow to PartyRemove

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -13,12 +13,12 @@
 ┊13┊13┊      {{party.name}}
 ┊14┊14┊    </a>
 ┊15┊15┊    <p>{{party.description}}</p>
-┊16┊  ┊    <party-remove party="party"></party-remove>
+┊  ┊16┊    <party-remove party="party" ng-show="partiesList.isOwner(party)"></party-remove>
 ┊17┊17┊    <party-rsvp party="party" ng-show="partiesList.isLoggedIn"></party-rsvp>
 ┊18┊18┊    <div ng-hide="partiesList.isLoggedIn">
 ┊19┊19┊      <i>Sign in to RSVP for this party.</i>
 ┊20┊20┊    </div>
-┊21┊  ┊    
+┊  ┊21┊
 ┊22┊22┊    <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
 ┊23┊23┊    <party-unanswered party="party"></party-unanswered>
 ┊24┊24┊    <party-creator party="party"></party-creator>
```
[}]: #

In here you can see that `ng-show` can get a statement, in our case - the user exists (logged in) and is also the party's owner.

But we just missing the helper we used:

[{]: <helper> (diff_step 15.6)
#### Step 15.6: Add isOwner method

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -48,10 +48,17 @@
 ┊48┊48┊      },
 ┊49┊49┊      isLoggedIn() {
 ┊50┊50┊        return !!Meteor.userId();
+┊  ┊51┊      },
+┊  ┊52┊      currentUserId() {
+┊  ┊53┊        return Meteor.userId();
 ┊51┊54┊      }
 ┊52┊55┊    });
 ┊53┊56┊  }
 ┊54┊57┊
+┊  ┊58┊  isOwner(party) {
+┊  ┊59┊    return this.isLoggedIn && party.owner === this.currentUserId;
+┊  ┊60┊  }
+┊  ┊61┊
 ┊55┊62┊  pageChanged(newPage) {
 ┊56┊63┊    this.page = newPage;
 ┊57┊64┊  }
```
[}]: #

# ng-if

[ng-if](https://docs.angularjs.org/api/ng/directive/ngIf) acts almost the same as `ng-show` but the difference between them
is that `ng-show` hides the element by changing the display css property and `ng-if` simply removes it from the DOM completely.

So let's use `ng-if` to hide the outstanding invitations from a party, if the party is public (everyone is invited!):

[{]: <helper> (diff_step 15.8)
#### Step 15.8: Add ngIf to PartyUnanswered

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -20,7 +20,12 @@
 ┊20┊20┊    </div>
 ┊21┊21┊
 ┊22┊22┊    <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
-┊23┊  ┊    <party-unanswered party="party"></party-unanswered>
+┊  ┊23┊
+┊  ┊24┊    <party-unanswered party="party" ng-if="!party.public"></party-unanswered>
+┊  ┊25┊    <div ng-if="party.public">
+┊  ┊26┊      Everyone is invited
+┊  ┊27┊    </div>
+┊  ┊28┊
 ┊24┊29┊    <party-creator party="party"></party-creator>
 ┊25┊30┊  </li>
 ┊26┊31┊</ul>
```
[}]: #

# Assigning a function

Now lets hide the 'PartyUninvited' inside `PartyDetails` in case the user is not logged in or can't invite to the party:

To do that we will create a scope function that returns a boolean and associate it with `ng-show`:

Create a new function inside `partyDetails` component, called `canInvite`:

[{]: <helper> (diff_step 15.9)
#### Step 15.9: Add canInvite method to the component

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -31,6 +31,14 @@
 ┊31┊31┊    });
 ┊32┊32┊  }
 ┊33┊33┊
+┊  ┊34┊  canInvite() {
+┊  ┊35┊    if (!this.party) {
+┊  ┊36┊      return false;
+┊  ┊37┊    }
+┊  ┊38┊
+┊  ┊39┊    return !this.party.public && this.party.owner === Meteor.userId();
+┊  ┊40┊  }
+┊  ┊41┊
 ┊34┊42┊  save() {
 ┊35┊43┊    Parties.update({
 ┊36┊44┊      _id: this.party._id
```
[}]: #

and add the `ng-show` to the `PartyUninvited`:

[{]: <helper> (diff_step 15.10)
#### Step 15.10: Add ngShow to PartyUninvited

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -8,4 +8,4 @@
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊<button ui-sref="parties">Back</button>
 ┊10┊10┊
-┊11┊  ┊<party-uninvited party="partyDetails.party"></party-uninvited>
+┊  ┊11┊<party-uninvited party="partyDetails.party" ng-show="partyDetails.canInvite()"></party-uninvited>
```
[}]: #

Let's add a `li` that tells the user that everyone is already invited, if that is the case

[{]: <helper> (diff_step 15.11)
#### Step 15.11: Add info that everyone are already invited

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -4,4 +4,7 @@
 ┊ 4┊ 4┊    <div>{{ user | displayNameFilter }}</div>
 ┊ 5┊ 5┊    <button ng-click="partyUninvited.invite(user)">Invite</button>
 ┊ 6┊ 6┊  </li>
+┊  ┊ 7┊  <li ng-if="(partyUninvited.users | uninvitedFilter:partyUninvited.party).length <= 0">
+┊  ┊ 8┊    Everyone are already invited.
+┊  ┊ 9┊  </li>
 ┊ 7┊10┊</ul>
```
[}]: #

Here, we are taking the result of the uninvited users and checking for its length.

But we are just missing the helpers in this component, so let's add it here as well:

[{]: <helper> (diff_step 15.12)
#### Step 15.12: Add isOwner helper to the party details component

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -27,6 +27,16 @@
 ┊27┊27┊      },
 ┊28┊28┊      users() {
 ┊29┊29┊        return Meteor.users.find({});
+┊  ┊30┊      },
+┊  ┊31┊      isLoggedIn() {
+┊  ┊32┊        return !!Meteor.userId();
+┊  ┊33┊      },
+┊  ┊34┊      isOwner() {
+┊  ┊35┊        if (!this.party) {
+┊  ┊36┊          return false;
+┊  ┊37┊        }
+┊  ┊38┊
+┊  ┊39┊        return this.party.owner === Meteor.userId();
 ┊30┊40┊      }
 ┊31┊41┊    });
 ┊32┊42┊  }
```
[}]: #


# ng-disabled

Now lets disable the `PartyDetails` input fields in case the user doesn't have permission to change them (currently, the server is stopping the user, but there is no visual feedback aside from the server overriding the local edit immediately after):

[{]: <helper> (diff_step 15.13)
#### Step 15.13: Add usage for ng-disabled

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -1,8 +1,8 @@
 ┊1┊1┊The party you selected is:
 ┊2┊2┊<form>
-┊3┊ ┊  Party name: <input type="text" ng-model="partyDetails.party.name" />
-┊4┊ ┊  Description: <input type="text" ng-model="partyDetails.party.description" />
-┊5┊ ┊  Public Party? <input type="checkbox" ng-model="partyDetails.party.public">
+┊ ┊3┊  Party name: <input type="text" ng-model="partyDetails.party.name" ng-disabled="!partyDetails.isOwner"/>
+┊ ┊4┊  Description: <input type="text" ng-model="partyDetails.party.description" ng-disabled="!partyDetails.isOwner"/>
+┊ ┊5┊  Public Party? <input type="checkbox" ng-model="partyDetails.party.public" ng-disabled="!partyDetails.isOwner"/>
 ┊6┊6┊  <button ng-click="partyDetails.save()">Save</button>
 ┊7┊7┊</form>
```
[}]: #

# Summary

So now our example looks much better after we hide things based on the current situation.

In the next chapters we will add Google Maps and some CSS and styling to our app.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step14.md) | [Next Step >](step16.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #