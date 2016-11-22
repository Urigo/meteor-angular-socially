[{]: <region> (header)
# Step 14: Meteor Methods
[}]: #
[{]: <region> (body)
In this step we will learn how to use [Meteor methods](http://docs.meteor.com/#/full/meteor_methods) and how to use `Meteor.call` method from our AngularJS code.

Meteor methods are a way to perform more complex logic than the direct Mongo.Collection API.
The Meteor methods are also responsible for checking permissions, just like the allow method does.

In our case, we will create an invite method that invites a user to a party.

Create a new file under `imports/api/parties` called `methods.js` and paste the following code into it:

[{]: <helper> (diff_step 14.2)
#### Step 14.2: Create invite method

##### Added imports/api/parties/methods.js
```diff
@@ -0,0 +1,66 @@
+┊  ┊ 1┊import _ from 'underscore';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊import { check } from 'meteor/check';
+┊  ┊ 4┊
+┊  ┊ 5┊import { Parties } from './collection';
+┊  ┊ 6┊
+┊  ┊ 7┊function getContactEmail(user) {
+┊  ┊ 8┊  if (user.emails && user.emails.length)
+┊  ┊ 9┊    return user.emails[0].address;
+┊  ┊10┊
+┊  ┊11┊  if (user.services && user.services.facebook && user.services.facebook.email)
+┊  ┊12┊    return user.services.facebook.email;
+┊  ┊13┊
+┊  ┊14┊  return null;
+┊  ┊15┊}
+┊  ┊16┊
+┊  ┊17┊export function invite(partyId, userId) {
+┊  ┊18┊  check(partyId, String);
+┊  ┊19┊  check(userId, String);
+┊  ┊20┊
+┊  ┊21┊  if (!this.userId) {
+┊  ┊22┊    throw new Meteor.Error(400, 'You have to be logged in!');
+┊  ┊23┊  }
+┊  ┊24┊
+┊  ┊25┊  const party = Parties.findOne(partyId);
+┊  ┊26┊
+┊  ┊27┊  if (!party) {
+┊  ┊28┊    throw new Meteor.Error(404, 'No such party!');
+┊  ┊29┊  }
+┊  ┊30┊
+┊  ┊31┊  if (party.owner !== this.userId) {
+┊  ┊32┊    throw new Meteor.Error(404, 'No permissions!');
+┊  ┊33┊  }
+┊  ┊34┊
+┊  ┊35┊  if (party.public) {
+┊  ┊36┊    throw new Meteor.Error(400, 'That party is public. No need to invite people.');
+┊  ┊37┊  }
+┊  ┊38┊
+┊  ┊39┊  if (userId !== party.owner && ! _.contains(party.invited, userId)) {
+┊  ┊40┊    Parties.update(partyId, {
+┊  ┊41┊      $addToSet: {
+┊  ┊42┊        invited: userId
+┊  ┊43┊      }
+┊  ┊44┊    });
+┊  ┊45┊
+┊  ┊46┊    const replyTo = getContactEmail(Meteor.users.findOne(this.userId));
+┊  ┊47┊    const to = getContactEmail(Meteor.users.findOne(userId));
+┊  ┊48┊
+┊  ┊49┊    if (Meteor.isServer && to) {
+┊  ┊50┊      Email.send({
+┊  ┊51┊        to,
+┊  ┊52┊        replyTo,
+┊  ┊53┊        from: 'noreply@socially.com',
+┊  ┊54┊        subject: `PARTY: ${party.title}`,
+┊  ┊55┊        text: `
+┊  ┊56┊          Hey, I just invited you to ${party.title} on Socially.
+┊  ┊57┊          Come check it out: ${Meteor.absoluteUrl()}
+┊  ┊58┊        `
+┊  ┊59┊      });
+┊  ┊60┊    }
+┊  ┊61┊  }
+┊  ┊62┊}
+┊  ┊63┊
+┊  ┊64┊Meteor.methods({
+┊  ┊65┊  invite
+┊  ┊66┊});
```
[}]: #

We have to import it in the `index.js`

[{]: <helper> (diff_step 14.3)
#### Step 14.3: Import methods

##### Changed imports/api/parties/index.js
```diff
@@ -1,3 +1,4 @@
 ┊1┊1┊import './publish';
+┊ ┊2┊import './methods';
 ┊2┊3┊
 ┊3┊4┊export * from './collection';
```
[}]: #

Let's look at the code.

First, all Meteor methods are defined inside `Meteor.methods({});` object.

Each property of that object is a method and the name of that property in the name of the method. In our case - invite.

Then the value of the property is the function we call. In our case it takes 2 parameters - the party id and the invited user id.

As you can see, `invite` function is exported. It's just to make testing easier.

First, we check validation with the the [check](http://docs.meteor.com/#check_package) function.

To use [check](http://docs.meteor.com/#check_package) we need to add the [check package](https://atmospherejs.com/meteor/check):

    meteor add check

The rest of the code is pretty much self explanatory, but important thing to notice is the Email function that sends email to the invited client.
This function can't be called from the client side so we have to put it inside an `isServer` statement.

Don't forget to add the email package to your project in the command line:

    meteor add email

And import Email object from its module:

[{]: <helper> (diff_step 14.5)
#### Step 14.5: Import email from module

##### Changed imports/api/parties/methods.js
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import _ from 'underscore';
 ┊2┊2┊import { Meteor } from 'meteor/meteor';
 ┊3┊3┊import { check } from 'meteor/check';
+┊ ┊4┊import { Email } from 'meteor/email';
 ┊4┊5┊
 ┊5┊6┊import { Parties } from './collection';
```
[}]: #

Now let's call that method from the client.

Add a method to the component called `PartyUninvited`:

[{]: <helper> (diff_step 14.6)
#### Step 14.6: Add invite method to PartyUninvited

##### Changed imports/ui/components/partyUninvited/partyUninvited.js
```diff
@@ -19,6 +19,18 @@
 ┊19┊19┊      }
 ┊20┊20┊    });
 ┊21┊21┊  }
+┊  ┊22┊
+┊  ┊23┊  invite(user) {
+┊  ┊24┊    Meteor.call('invite', this.party._id, user._id,
+┊  ┊25┊      (error) => {
+┊  ┊26┊        if (error) {
+┊  ┊27┊          console.log('Oops, unable to invite!');
+┊  ┊28┊        } else {
+┊  ┊29┊          console.log('Invited!');
+┊  ┊30┊        }
+┊  ┊31┊      }
+┊  ┊32┊    );
+┊  ┊33┊  }
 ┊22┊34┊}
 ┊23┊35┊
 ┊24┊36┊const name = 'partyUninvited';
```
[}]: #

We just used a regular Meteor API to call a method, inside our component.

Note that we also used another parameter, a callback function that called when Meteor is done with our method.

The callback have 2 parameters:

* Parameter 1 - `error` - which is `undefined` when the call succeeded.
* Parameter 2 - `result` - which is the return value from the server method.

Now let's add a button to invite each user we want. Edit the users list to look like this:

[{]: <helper> (diff_step 14.7)
#### Step 14.7: Add invite button

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -2,5 +2,6 @@
 ┊2┊2┊  Users to invite:
 ┊3┊3┊  <li ng-repeat="user in partyUninvited.users | uninvitedFilter:partyUninvited.party">
 ┊4┊4┊    <div>{{ user | displayNameFilter }}</div>
+┊ ┊5┊    <button ng-click="partyUninvited.invite(user)">Invite</button>
 ┊5┊6┊  </li>
 ┊6┊7┊</ul>
```
[}]: #

Now that we have the invite function working, we also want to publish the parties to the invited users.
Let's add that permission to the publish parties method:

[{]: <helper> (diff_step 14.8)
#### Step 14.8: Update the parties subscription to include invited

##### Changed imports/api/parties/publish.js
```diff
@@ -24,6 +24,15 @@
 ┊24┊24┊            $exists: true
 ┊25┊25┊          }
 ┊26┊26┊        }]
+┊  ┊27┊      }, {
+┊  ┊28┊        // when logged in user is one of invited
+┊  ┊29┊        $and: [{
+┊  ┊30┊          invited: this.userId
+┊  ┊31┊        }, {
+┊  ┊32┊          invited: {
+┊  ┊33┊            $exists: true
+┊  ┊34┊          }
+┊  ┊35┊        }]
 ┊27┊36┊      }]
 ┊28┊37┊    };
```
[}]: #

### Serve Email

If you would like test email functionality locally with your own GMail account, create a new file called located in `server/startup/environments.js`, and add the following lines substituting [YOUR_EMAIL] and [YOUR_PASSWORD]:

```js
Meteor.startup(function () {
    process.env.MAIL_URL="smtp://[YOUR_EMAIL]@gmail.com:[YOUR_PASSWORD]@smtp.gmail.com:465/";
})
```

You may need to set your GMail account to use [Less Secure Apps](https://www.google.com/settings/u/2/security/lesssecureapps). Once it's done, you can use Meteor's [emailing package](https://docs.meteor.com/api/email.html) which can be installed by typing the following command:

    $ meteor add email

For development, setting your own email explicitly is a good practice because it's quick and easy. However, you don't want to set your email account in production mode, since everyone can see it. A recommended solution would be using an emailing service like `EmailJS`. More information about EmailJS can be found [here](emailjs.com).

Great!

Now test the app. Create a private party with user1. Then invite user2. Log in as user2 and check if he can see the party in his own parties list.

Now let's add the RSVP functionality so invited users can respond to invitations.

First let's add a `Meteor.method` to `methods.js` in the parties folder (remember to place it as a property inside the `Meteor.methods` object):

[{]: <helper> (diff_step 14.9)
#### Step 14.9: Add rsvp method

##### Changed imports/api/parties/methods.js
```diff
@@ -62,6 +62,83 @@
 ┊ 62┊ 62┊  }
 ┊ 63┊ 63┊}
 ┊ 64┊ 64┊
+┊   ┊ 65┊export function rsvp(partyId, rsvp) {
+┊   ┊ 66┊  check(partyId, String);
+┊   ┊ 67┊  check(rsvp, String);
+┊   ┊ 68┊
+┊   ┊ 69┊  if (!this.userId) {
+┊   ┊ 70┊    throw new Meteor.Error(403, 'You must be logged in to RSVP');
+┊   ┊ 71┊  }
+┊   ┊ 72┊
+┊   ┊ 73┊  if (!_.contains(['yes', 'no', 'maybe'], rsvp)) {
+┊   ┊ 74┊    throw new Meteor.Error(400, 'Invalid RSVP');
+┊   ┊ 75┊  }
+┊   ┊ 76┊
+┊   ┊ 77┊  const party = Parties.findOne({
+┊   ┊ 78┊    _id: partyId,
+┊   ┊ 79┊    $or: [{
+┊   ┊ 80┊      // is public
+┊   ┊ 81┊      $and: [{
+┊   ┊ 82┊        public: true
+┊   ┊ 83┊      }, {
+┊   ┊ 84┊        public: {
+┊   ┊ 85┊          $exists: true
+┊   ┊ 86┊        }
+┊   ┊ 87┊      }]
+┊   ┊ 88┊    },{
+┊   ┊ 89┊      // is owner
+┊   ┊ 90┊      $and: [{
+┊   ┊ 91┊        owner: this.userId
+┊   ┊ 92┊      }, {
+┊   ┊ 93┊        owner: {
+┊   ┊ 94┊          $exists: true
+┊   ┊ 95┊        }
+┊   ┊ 96┊      }]
+┊   ┊ 97┊    }, {
+┊   ┊ 98┊      // is invited
+┊   ┊ 99┊      $and: [{
+┊   ┊100┊        invited: this.userId
+┊   ┊101┊      }, {
+┊   ┊102┊        invited: {
+┊   ┊103┊          $exists: true
+┊   ┊104┊        }
+┊   ┊105┊      }]
+┊   ┊106┊    }]
+┊   ┊107┊  });
+┊   ┊108┊
+┊   ┊109┊  if (!party) {
+┊   ┊110┊    throw new Meteor.Error(404, 'No such party');
+┊   ┊111┊  }
+┊   ┊112┊
+┊   ┊113┊  const hasUserRsvp = _.findWhere(party.rsvps, {
+┊   ┊114┊    user: this.userId
+┊   ┊115┊  });
+┊   ┊116┊
+┊   ┊117┊  if (!hasUserRsvp) {
+┊   ┊118┊    // add new rsvp entry
+┊   ┊119┊    Parties.update(partyId, {
+┊   ┊120┊      $push: {
+┊   ┊121┊        rsvps: {
+┊   ┊122┊          rsvp,
+┊   ┊123┊          user: this.userId
+┊   ┊124┊        }
+┊   ┊125┊      }
+┊   ┊126┊    });
+┊   ┊127┊  } else {
+┊   ┊128┊    // update rsvp entry
+┊   ┊129┊    const userId = this.userId;
+┊   ┊130┊    Parties.update({
+┊   ┊131┊      _id: partyId,
+┊   ┊132┊      'rsvps.user': userId
+┊   ┊133┊    }, {
+┊   ┊134┊      $set: {
+┊   ┊135┊        'rsvps.$.rsvp': rsvp
+┊   ┊136┊      }
+┊   ┊137┊    });
+┊   ┊138┊  }
+┊   ┊139┊}
+┊   ┊140┊
 ┊ 65┊141┊Meteor.methods({
-┊ 66┊   ┊  invite
+┊   ┊142┊  invite,
+┊   ┊143┊  rsvp
 ┊ 67┊144┊});
```
[}]: #

The function gets the party's id and the response ('yes', 'maybe' or 'no').

Like the invite method, first we check for all kinds of validations, then we do the wanted logic.

Now let's create the `PartyRsvp` component with action buttons to call the right rsvp!

[{]: <helper> (diff_step 14.10)
#### Step 14.10: Create PartyRsvp component

##### Added imports/ui/components/partyRsvp/partyRsvp.js
```diff
@@ -0,0 +1,44 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './partyRsvp.html';
+┊  ┊ 7┊
+┊  ┊ 8┊class PartyRsvp {
+┊  ┊ 9┊  yes() {
+┊  ┊10┊    this.answer('yes');
+┊  ┊11┊  }
+┊  ┊12┊
+┊  ┊13┊  maybe() {
+┊  ┊14┊    this.answer('maybe');
+┊  ┊15┊  }
+┊  ┊16┊
+┊  ┊17┊  no() {
+┊  ┊18┊    this.answer('no');
+┊  ┊19┊  }
+┊  ┊20┊
+┊  ┊21┊  answer(answer) {
+┊  ┊22┊    Meteor.call('rsvp', this.party._id, answer, (error) => {
+┊  ┊23┊      if (error) {
+┊  ┊24┊        console.error('Oops, unable to rsvp!');
+┊  ┊25┊      } else {
+┊  ┊26┊        console.log('RSVP done!')
+┊  ┊27┊      }
+┊  ┊28┊    });
+┊  ┊29┊  }
+┊  ┊30┊}
+┊  ┊31┊
+┊  ┊32┊const name = 'partyRsvp';
+┊  ┊33┊
+┊  ┊34┊// create a module
+┊  ┊35┊export default angular.module(name, [
+┊  ┊36┊  angularMeteor
+┊  ┊37┊]).component(name, {
+┊  ┊38┊  template,
+┊  ┊39┊  controllerAs: name,
+┊  ┊40┊  bindings: {
+┊  ┊41┊    party: '<'
+┊  ┊42┊  },
+┊  ┊43┊  controller: PartyRsvp
+┊  ┊44┊});
```
[}]: #

[{]: <helper> (diff_step 14.11)
#### Step 14.11: Create template

##### Added imports/ui/components/partyRsvp/partyRsvp.html
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊<input type="button" value="I'm going!" ng-click="partyRsvp.yes()"/>
+┊ ┊2┊<input type="button" value="Maybe" ng-click="partyRsvp.maybe()"/>
+┊ ┊3┊<input type="button" value="No" ng-click="partyRsvp.no()"/>
```
[}]: #

Add this component to the PartiesList:

[{]: <helper> (diff_step 14.12)
#### Step 14.12: Add component to the view

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -11,6 +11,7 @@
 ┊11┊11┊    </a>
 ┊12┊12┊    <p>{{party.description}}</p>
 ┊13┊13┊    <party-remove party="party"></party-remove>
+┊  ┊14┊    <party-rsvp party="party"></party-rsvp>
 ┊14┊15┊    <party-creator party="party"></party-creator>
 ┊15┊16┊  </li>
 ┊16┊17┊</ul>
```
[}]: #

[{]: <helper> (diff_step 14.13)
#### Step 14.13: Add as a dependency

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -11,6 +11,7 @@
 ┊11┊11┊import { name as PartyAdd } from '../partyAdd/partyAdd';
 ┊12┊12┊import { name as PartyRemove } from '../partyRemove/partyRemove';
 ┊13┊13┊import { name as PartyCreator } from '../partyCreator/partyCreator';
+┊  ┊14┊import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
 ┊14┊15┊
 ┊15┊16┊class PartiesList {
 ┊16┊17┊  constructor($scope, $reactive) {
```
```diff
@@ -63,7 +64,8 @@
 ┊63┊64┊  PartiesSort,
 ┊64┊65┊  PartyAdd,
 ┊65┊66┊  PartyRemove,
-┊66┊  ┊  PartyCreator
+┊  ┊67┊  PartyCreator,
+┊  ┊68┊  PartyRsvp
 ┊67┊69┊]).component(name, {
 ┊68┊70┊  template,
 ┊69┊71┊  controllerAs: name,
```
[}]: #

Now let's display who is coming for each party.

Create the `PartyRsvpsList` component:

[{]: <helper> (diff_step 14.14)
#### Step 14.14: Create view for PartyRsvpsList component

##### Added imports/ui/components/partyRsvpsList/partyRsvpsList.html
```diff
@@ -0,0 +1,6 @@
+┊ ┊1┊Who is coming: Yes -
+┊ ┊2┊{{ (partyRsvpsList.rsvps | filter:{rsvp:'yes'}).length }}
+┊ ┊3┊Maybe -
+┊ ┊4┊{{ (partyRsvpsList.rsvps | filter:{rsvp:'maybe'}).length }}
+┊ ┊5┊No -
+┊ ┊6┊{{ (partyRsvpsList.rsvps | filter:{rsvp:'no'}).length }}
```
[}]: #

[{]: <helper> (diff_step 14.15)
#### Step 14.15: Create component

##### Added imports/ui/components/partyRsvpsList/partyRsvpsList.js
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import template from './partyRsvpsList.html';
+┊  ┊ 5┊
+┊  ┊ 6┊class PartyRsvpsList { }
+┊  ┊ 7┊
+┊  ┊ 8┊const name = 'partyRsvpsList';
+┊  ┊ 9┊
+┊  ┊10┊// create a module
+┊  ┊11┊export default angular.module(name, [
+┊  ┊12┊  angularMeteor
+┊  ┊13┊]).component(name, {
+┊  ┊14┊  template,
+┊  ┊15┊  controllerAs: name,
+┊  ┊16┊  bindings: {
+┊  ┊17┊    rsvps: '<'
+┊  ┊18┊  },
+┊  ┊19┊  controller: PartyRsvpsList
+┊  ┊20┊});
```
[}]: #

Take a look at the use of filter with length to find how many people responded with each response type.

We have to add it to PartiesList:

[{]: <helper> (diff_step 14.16)
#### Step 14.16: Add to the view

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -12,6 +12,7 @@
 ┊12┊12┊    <p>{{party.description}}</p>
 ┊13┊13┊    <party-remove party="party"></party-remove>
 ┊14┊14┊    <party-rsvp party="party"></party-rsvp>
+┊  ┊15┊    <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
 ┊15┊16┊    <party-creator party="party"></party-creator>
 ┊16┊17┊  </li>
 ┊17┊18┊</ul>
```
[}]: #

[{]: <helper> (diff_step 14.17)
#### Step 14.17: Also as a dependency

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -12,6 +12,7 @@
 ┊12┊12┊import { name as PartyRemove } from '../partyRemove/partyRemove';
 ┊13┊13┊import { name as PartyCreator } from '../partyCreator/partyCreator';
 ┊14┊14┊import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
+┊  ┊15┊import { name as PartyRsvpsList } from '../partyRsvpsList/partyRsvpsList';
 ┊15┊16┊
 ┊16┊17┊class PartiesList {
 ┊17┊18┊  constructor($scope, $reactive) {
```
```diff
@@ -65,7 +66,8 @@
 ┊65┊66┊  PartyAdd,
 ┊66┊67┊  PartyRemove,
 ┊67┊68┊  PartyCreator,
-┊68┊  ┊  PartyRsvp
+┊  ┊69┊  PartyRsvp,
+┊  ┊70┊  PartyRsvpsList
 ┊69┊71┊]).component(name, {
 ┊70┊72┊  template,
 ┊71┊73┊  controllerAs: name,
```
[}]: #

And we also want to see list of users. Let's create `PartyRsvpUsers`:

[{]: <helper> (diff_step 14.18)
#### Step 14.18: Create view for PartyRsvpUsers component

##### Added imports/ui/components/partyRsvpUsers/partyRsvpUsers.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<div ng-repeat="rsvp in partyRsvpUsers.rsvps | filter:{ rsvp: partyRsvpUsers.type }">
+┊ ┊2┊  {{ partyRsvpUsers.getUserById(rsvp.user) | displayNameFilter }}
+┊ ┊3┊  -
+┊ ┊4┊  {{ partyRsvpUsers.type }}
+┊ ┊5┊</div>
```
[}]: #

[{]: <helper> (diff_step 14.19)
#### Step 14.19: Create component

##### Added imports/ui/components/partyRsvpUsers/partyRsvpUsers.js
```diff
@@ -0,0 +1,29 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './partyRsvpUsers.html';
+┊  ┊ 7┊import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
+┊  ┊ 8┊
+┊  ┊ 9┊class PartyRsvpUsers {
+┊  ┊10┊  getUserById(userId) {
+┊  ┊11┊    return Meteor.users.findOne(userId);
+┊  ┊12┊  }
+┊  ┊13┊}
+┊  ┊14┊
+┊  ┊15┊const name = 'partyRsvpUsers';
+┊  ┊16┊
+┊  ┊17┊// create a module
+┊  ┊18┊export default angular.module(name, [
+┊  ┊19┊  angularMeteor,
+┊  ┊20┊  DisplayNameFilter
+┊  ┊21┊]).component(name, {
+┊  ┊22┊  template,
+┊  ┊23┊  controllerAs: name,
+┊  ┊24┊  bindings: {
+┊  ┊25┊    rsvps: '<',
+┊  ┊26┊    type: '@'
+┊  ┊27┊  },
+┊  ┊28┊  controller: PartyRsvpUsers
+┊  ┊29┊});
```
[}]: #

Add it to `PartyRsvpsList`:

[{]: <helper> (diff_step 14.20)
#### Step 14.20: Use recently created component

##### Changed imports/ui/components/partyRsvpsList/partyRsvpsList.html
```diff
@@ -4,3 +4,7 @@
 ┊ 4┊ 4┊{{ (partyRsvpsList.rsvps | filter:{rsvp:'maybe'}).length }}
 ┊ 5┊ 5┊No -
 ┊ 6┊ 6┊{{ (partyRsvpsList.rsvps | filter:{rsvp:'no'}).length }}
+┊  ┊ 7┊
+┊  ┊ 8┊<party-rsvp-users rsvps="partyRsvpsList.rsvps" type="yes"></party-rsvp-users>
+┊  ┊ 9┊<party-rsvp-users rsvps="partyRsvpsList.rsvps" type="maybe"></party-rsvp-users>
+┊  ┊10┊<party-rsvp-users rsvps="partyRsvpsList.rsvps" type="no"></party-rsvp-users>
```
[}]: #

[{]: <helper> (diff_step 14.21)
#### Step 14.21: Add as a dependency

##### Changed imports/ui/components/partyRsvpsList/partyRsvpsList.js
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊
 ┊4┊4┊import template from './partyRsvpsList.html';
+┊ ┊5┊import { name as PartyRsvpUsers } from '../partyRsvpUsers/partyRsvpUsers';
 ┊5┊6┊
 ┊6┊7┊class PartyRsvpsList { }
 ┊7┊8┊
```
```diff
@@ -9,7 +10,8 @@
 ┊ 9┊10┊
 ┊10┊11┊// create a module
 ┊11┊12┊export default angular.module(name, [
-┊12┊  ┊  angularMeteor
+┊  ┊13┊  angularMeteor,
+┊  ┊14┊  PartyRsvpUsers
 ┊13┊15┊]).component(name, {
 ┊14┊16┊  template,
 ┊15┊17┊  controllerAs: name,
```
[}]: #

Now let's add a list of the users who haven't responded yet. To do this we will create the `PartyUnanswered` component:

[{]: <helper> (diff_step 14.22)
#### Step 14.22: Create view for PartyUnanswered

##### Added imports/ui/components/partyUnanswered/partyUnanswered.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<ul>
+┊ ┊2┊  <li ng-repeat="invitedUser in partyUnanswered.getUnanswered()">
+┊ ┊3┊    {{ partyUnanswered.getUserById(invitedUser) | displayNameFilter }}
+┊ ┊4┊  </li>
+┊ ┊5┊</ul>
```
[}]: #

[{]: <helper> (diff_step 14.23)
#### Step 14.23: Create component

##### Added imports/ui/components/partyUnanswered/partyUnanswered.js
```diff
@@ -0,0 +1,39 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊import _ from 'underscore';
+┊  ┊ 4┊
+┊  ┊ 5┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 6┊
+┊  ┊ 7┊import template from './partyUnanswered.html';
+┊  ┊ 8┊import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
+┊  ┊ 9┊
+┊  ┊10┊class PartyUnanswered {
+┊  ┊11┊  getUnanswered() {
+┊  ┊12┊    if (!this.party || !this.party.invited) {
+┊  ┊13┊      return;
+┊  ┊14┊    }
+┊  ┊15┊
+┊  ┊16┊    return this.party.invited.filter((user) => {
+┊  ┊17┊      return !_.findWhere(this.party.rsvps, { user });
+┊  ┊18┊    });
+┊  ┊19┊  }
+┊  ┊20┊
+┊  ┊21┊  getUserById(userId) {
+┊  ┊22┊    return Meteor.users.findOne(userId)
+┊  ┊23┊  }
+┊  ┊24┊}
+┊  ┊25┊
+┊  ┊26┊const name = 'partyUnanswered';
+┊  ┊27┊
+┊  ┊28┊// create a module
+┊  ┊29┊export default angular.module(name, [
+┊  ┊30┊  angularMeteor,
+┊  ┊31┊  DisplayNameFilter
+┊  ┊32┊]).component(name, {
+┊  ┊33┊  template,
+┊  ┊34┊  controllerAs: name,
+┊  ┊35┊  bindings: {
+┊  ┊36┊    party: '<'
+┊  ┊37┊  },
+┊  ┊38┊  controller: PartyUnanswered
+┊  ┊39┊});
```
[}]: #

Here we are using `filter` method, and underscore's `findWhere()` to extract the users who are invited to the party but are not exist in the rsvps array.

Add that function inside the `PartiesList` component:

[{]: <helper> (diff_step 14.24)
#### Step 14.24: Use recently created component

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -13,6 +13,7 @@
 ┊13┊13┊    <party-remove party="party"></party-remove>
 ┊14┊14┊    <party-rsvp party="party"></party-rsvp>
 ┊15┊15┊    <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
+┊  ┊16┊    <party-unanswered party="party"></party-unanswered>
 ┊16┊17┊    <party-creator party="party"></party-creator>
 ┊17┊18┊  </li>
 ┊18┊19┊</ul>
```
[}]: #

[{]: <helper> (diff_step 14.25)
#### Step 14.25: Add as a dependency

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -13,6 +13,7 @@
 ┊13┊13┊import { name as PartyCreator } from '../partyCreator/partyCreator';
 ┊14┊14┊import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
 ┊15┊15┊import { name as PartyRsvpsList } from '../partyRsvpsList/partyRsvpsList';
+┊  ┊16┊import { name as PartyUnanswered } from '../partyUnanswered/partyUnanswered';
 ┊16┊17┊
 ┊17┊18┊class PartiesList {
 ┊18┊19┊  constructor($scope, $reactive) {
```
```diff
@@ -67,7 +68,8 @@
 ┊67┊68┊  PartyRemove,
 ┊68┊69┊  PartyCreator,
 ┊69┊70┊  PartyRsvp,
-┊70┊  ┊  PartyRsvpsList
+┊  ┊71┊  PartyRsvpsList,
+┊  ┊72┊  PartyUnanswered
 ┊71┊73┊]).component(name, {
 ┊72┊74┊  template,
 ┊73┊75┊  controllerAs: name,
```
[}]: #

Also, we forgot to subscribe!

[{]: <helper> (diff_step 14.26)
#### Step 14.26: Subscribe `users`

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -35,6 +35,8 @@
 ┊35┊35┊      }, this.getReactively('searchText')
 ┊36┊36┊    ]);
 ┊37┊37┊
+┊  ┊38┊    this.subscribe('users');
+┊  ┊39┊
 ┊38┊40┊    this.helpers({
 ┊39┊41┊      parties() {
 ┊40┊42┊        return Parties.find({}, {
```
[}]: #

# Summary

Run the application.

Looks like we have all the functionality we need but there is a lot of mess in the display.
There are stuff that we can hide if the user is not authorized to see or if they are empty.

So in the next chapter we are going to learn about a few simple but very useful Angular 1 directive to help us conditionally add or remove DOM.

# Testing

[{]: <helper> (diff_step 14.27)
#### Step 14.27: Tests of invite method

##### Added imports/api/parties/methods.tests.js
```diff
@@ -0,0 +1,126 @@
+┊   ┊  1┊import { invite } from './methods';
+┊   ┊  2┊import { Parties } from './collection';
+┊   ┊  3┊
+┊   ┊  4┊import { Meteor } from 'meteor/meteor';
+┊   ┊  5┊
+┊   ┊  6┊if (Meteor.isServer) {
+┊   ┊  7┊  describe('Parties / Methods', () => {
+┊   ┊  8┊    describe('invite', () => {
+┊   ┊  9┊      function loggedIn(userId = 'userId') {
+┊   ┊ 10┊        return {
+┊   ┊ 11┊          userId
+┊   ┊ 12┊        };
+┊   ┊ 13┊      }
+┊   ┊ 14┊
+┊   ┊ 15┊      it('should be called from Method', () => {
+┊   ┊ 16┊        spyOn(invite, 'apply');
+┊   ┊ 17┊
+┊   ┊ 18┊        try {
+┊   ┊ 19┊          Meteor.call('invite');
+┊   ┊ 20┊        } catch (e) {}
+┊   ┊ 21┊
+┊   ┊ 22┊        expect(invite.apply).toHaveBeenCalled();
+┊   ┊ 23┊      });
+┊   ┊ 24┊
+┊   ┊ 25┊      it('should fail on missing partyId', () => {
+┊   ┊ 26┊        expect(() => {
+┊   ┊ 27┊          invite.call({});
+┊   ┊ 28┊        }).toThrowError();
+┊   ┊ 29┊      });
+┊   ┊ 30┊
+┊   ┊ 31┊      it('should fail on missing userId', () => {
+┊   ┊ 32┊        expect(() => {
+┊   ┊ 33┊          invite.call({}, 'partyId');
+┊   ┊ 34┊        }).toThrowError();
+┊   ┊ 35┊      });
+┊   ┊ 36┊
+┊   ┊ 37┊      it('should fail on not logged in', () => {
+┊   ┊ 38┊        expect(() => {
+┊   ┊ 39┊          invite.call({}, 'partyId', 'userId');
+┊   ┊ 40┊        }).toThrowError(/logged in/i);
+┊   ┊ 41┊      });
+┊   ┊ 42┊
+┊   ┊ 43┊      it('should look for a party', () => {
+┊   ┊ 44┊        const partyId = 'partyId';
+┊   ┊ 45┊        spyOn(Parties, 'findOne');
+┊   ┊ 46┊
+┊   ┊ 47┊        try {
+┊   ┊ 48┊          invite.call(loggedIn(), partyId, 'userId');
+┊   ┊ 49┊        } catch (e) {}
+┊   ┊ 50┊
+┊   ┊ 51┊        expect(Parties.findOne).toHaveBeenCalledWith(partyId);
+┊   ┊ 52┊      });
+┊   ┊ 53┊
+┊   ┊ 54┊      it('should fail if party does not exist', () => {
+┊   ┊ 55┊        spyOn(Parties, 'findOne').and.returnValue(undefined);
+┊   ┊ 56┊
+┊   ┊ 57┊        expect(() => {
+┊   ┊ 58┊          invite.call(loggedIn(), 'partyId', 'userId');
+┊   ┊ 59┊        }).toThrowError(/404/);
+┊   ┊ 60┊      });
+┊   ┊ 61┊
+┊   ┊ 62┊      it('should fail if logged in user is not the owner', () => {
+┊   ┊ 63┊        spyOn(Parties, 'findOne').and.returnValue({
+┊   ┊ 64┊          owner: 'notUserId'
+┊   ┊ 65┊        });
+┊   ┊ 66┊
+┊   ┊ 67┊        expect(() => {
+┊   ┊ 68┊          invite.call(loggedIn(), 'partyId', 'userId');
+┊   ┊ 69┊        }).toThrowError(/404/);
+┊   ┊ 70┊      });
+┊   ┊ 71┊
+┊   ┊ 72┊      it('should fail on public party', () => {
+┊   ┊ 73┊        spyOn(Parties, 'findOne').and.returnValue({
+┊   ┊ 74┊          owner: 'userId',
+┊   ┊ 75┊          public: true
+┊   ┊ 76┊        });
+┊   ┊ 77┊
+┊   ┊ 78┊        expect(() => {
+┊   ┊ 79┊          invite.call(loggedIn(), 'partyId', 'userId');
+┊   ┊ 80┊        }).toThrowError(/400/);
+┊   ┊ 81┊      });
+┊   ┊ 82┊
+┊   ┊ 83┊      it('should NOT invite user who is the owner', () => {
+┊   ┊ 84┊        spyOn(Parties, 'findOne').and.returnValue({
+┊   ┊ 85┊          owner: 'userId'
+┊   ┊ 86┊        });
+┊   ┊ 87┊        spyOn(Parties, 'update');
+┊   ┊ 88┊
+┊   ┊ 89┊        invite.call(loggedIn(), 'partyId', 'userId');
+┊   ┊ 90┊
+┊   ┊ 91┊        expect(Parties.update).not.toHaveBeenCalled();
+┊   ┊ 92┊      });
+┊   ┊ 93┊
+┊   ┊ 94┊      it('should NOT invite user who has been already invited', () => {
+┊   ┊ 95┊        spyOn(Parties, 'findOne').and.returnValue({
+┊   ┊ 96┊          owner: 'userId',
+┊   ┊ 97┊          invited: ['invitedId']
+┊   ┊ 98┊        });
+┊   ┊ 99┊        spyOn(Parties, 'update');
+┊   ┊100┊
+┊   ┊101┊        invite.call(loggedIn(), 'partyId', 'invitedId');
+┊   ┊102┊
+┊   ┊103┊        expect(Parties.update).not.toHaveBeenCalled();
+┊   ┊104┊      });
+┊   ┊105┊
+┊   ┊106┊      it('should invite user who has not been invited and is not the owner', () => {
+┊   ┊107┊        const partyId = 'partyId';
+┊   ┊108┊        const userId = 'notInvitedId';
+┊   ┊109┊        spyOn(Parties, 'findOne').and.returnValue({
+┊   ┊110┊          owner: 'userId',
+┊   ┊111┊          invited: ['invitedId']
+┊   ┊112┊        });
+┊   ┊113┊        spyOn(Parties, 'update');
+┊   ┊114┊        spyOn(Meteor.users, 'findOne').and.returnValue({});
+┊   ┊115┊
+┊   ┊116┊        invite.call(loggedIn(), partyId, userId);
+┊   ┊117┊
+┊   ┊118┊        expect(Parties.update).toHaveBeenCalledWith(partyId, {
+┊   ┊119┊          $addToSet: {
+┊   ┊120┊            invited: userId
+┊   ┊121┊          }
+┊   ┊122┊        });
+┊   ┊123┊      });
+┊   ┊124┊    });
+┊   ┊125┊  });
+┊   ┊126┊}
```
[}]: #

[{]: <helper> (diff_step 14.28)
#### Step 14.28: Tests of rsvp Method

##### Changed imports/api/parties/methods.tests.js
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊import { invite } from './methods';
+┊ ┊1┊import { invite, rsvp } from './methods';
 ┊2┊2┊import { Parties } from './collection';
 ┊3┊3┊
 ┊4┊4┊import { Meteor } from 'meteor/meteor';
```
```diff
@@ -122,5 +122,57 @@
 ┊122┊122┊        });
 ┊123┊123┊      });
 ┊124┊124┊    });
+┊   ┊125┊
+┊   ┊126┊    describe('rsvp', () => {
+┊   ┊127┊      function loggedIn(userId = 'userId') {
+┊   ┊128┊        return {
+┊   ┊129┊          userId
+┊   ┊130┊        };
+┊   ┊131┊      }
+┊   ┊132┊
+┊   ┊133┊      it('should be called from Method', () => {
+┊   ┊134┊        spyOn(rsvp, 'apply');
+┊   ┊135┊
+┊   ┊136┊        try {
+┊   ┊137┊          Meteor.call('rsvp');
+┊   ┊138┊        } catch (e) {}
+┊   ┊139┊
+┊   ┊140┊        expect(rsvp.apply).toHaveBeenCalled();
+┊   ┊141┊      });
+┊   ┊142┊
+┊   ┊143┊      it('should fail on missing partyId', () => {
+┊   ┊144┊        expect(() => {
+┊   ┊145┊          rsvp.call({});
+┊   ┊146┊        }).toThrowError();
+┊   ┊147┊      });
+┊   ┊148┊
+┊   ┊149┊      it('should fail on missing rsvp', () => {
+┊   ┊150┊        expect(() => {
+┊   ┊151┊          rsvp.call({}, 'partyId');
+┊   ┊152┊        }).toThrowError();
+┊   ┊153┊      });
+┊   ┊154┊
+┊   ┊155┊      it('should fail if not logged in', () => {
+┊   ┊156┊        expect(() => {
+┊   ┊157┊          rsvp.call({}, 'partyId', 'rsvp');
+┊   ┊158┊        }).toThrowError(/403/);
+┊   ┊159┊      });
+┊   ┊160┊
+┊   ┊161┊      it('should fail on wrong answer', () => {
+┊   ┊162┊        expect(() => {
+┊   ┊163┊          rsvp.call(loggedIn(), 'partyId', 'wrong');
+┊   ┊164┊        }).toThrowError(/400/);
+┊   ┊165┊      });
+┊   ┊166┊
+┊   ┊167┊      ['yes', 'maybe', 'no'].forEach((answer) => {
+┊   ┊168┊        it(`should pass on '${answer}'`, () => {
+┊   ┊169┊          expect(() => {
+┊   ┊170┊            rsvp.call(loggedIn(), 'partyId', answer);
+┊   ┊171┊          }).not.toThrowError(/400/);
+┊   ┊172┊        });
+┊   ┊173┊      });
+┊   ┊174┊
+┊   ┊175┊      // TODO: more tests  
+┊   ┊176┊    });
 ┊125┊177┊  });
 ┊126┊178┊}
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step13.md) | [Next Step >](step15.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #