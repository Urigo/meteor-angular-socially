In this step, we will implement the party details view, which is displayed when a user clicks on a party in the parties list.
The user will also be able to change the party's details.

To implement the party details view we will use `helpers`.

We used `helpers` in the previous Component we implemented, but now we will demonstrate how to use it with a single object instead of a Mongo.Collection cursor.

# Implement the component

We'll expand the `PartyDetails` by using `helpers` method, and we will use [findOne](http://docs.meteor.com/#/full/findone) method from the Mongo.Collection, which returns a single object.

{{{diff_step 6.1}}}

In our example we find our relevant party by its id, and used a regular MongoDB syntax to create our `findOne` query, which is explained in Meteor's [collection.findOne](http://docs.meteor.com/#/full/findone) documentation.

So after declaring this helper, we can just use `this.party` in our Component's Controller, or `partyDetails.party` in our HTML view.

# Component template

In `partyDetails.html` let's replace the binding to the `partyDetails.partyId` with a binding to `partyDetails.party.name` and `partyDetails.party.description`:

{{{diff_step 6.2}}}

We used `ng-model` and created a form with the party details, now we just missing the "Save" button!

# Add Save logic

First, let's add a button, and we will use `ng-click` with the name of the method that we will later implement:

{{{diff_step 6.3}}}

> We also added a "Back" button with uses `ui-sref` attribute, which is a shorthand for creating a link for a state.

And now let's implement the logic of the "Save" button on the controller:

{{{diff_step 6.4}}}

We used [Parties.update](http://docs.meteor.com/#/full/update) method which is a method that comes from the Mongo.Collection object.

The first parameter is the parties we want to update, in this case, we send the specific party's id, just like we did with `findOne`.

In the second parameter we specify the action we want to perform, in our case we used the `$set` operator to update the actual relevant fields.

We can also handle success or fail when using `Parties.update` by adding a callback as the third argument, for example:

{{{diff_step 6.5}}}

# Testing

{{{diff_step 6.6}}}


# Summary

We've seen the power of using Meteor.Collection API and how we can get single object from the collections.

We also learned how to update an object with the user's data!

Let's move on to provide some order and structure in our application.
