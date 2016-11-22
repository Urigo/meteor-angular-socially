Publications and subscriptions are one of Meteor's most powerful features. It will take care of privacy and make sure that you don't to access someone else's information unless you have permissions to do so. You can look at it as a replacement for a RESTful API. More information and a deeper look at Meteor's publication and subscription system can be found [here](https://docs.meteor.com/api/pubsub.html#Meteor-publish).

So back to our app implementation, why is this even relevant? Because our app doesn't have any privacy. Each user can see all parties available on database, a behavior which we're not interested in. But let's set an exception, an exception, a party which is flagged as `party` can be viewed by anyone.

By default, a newly created Meteor project will be initialized with an `autopublish` package, a package which will publish all datasets. This is a good practice for development, not for production. So the first thing we should before implementing any publication would be typing the following command in the terminal:

    meteor remove autopublish

Obviously, if you will refresh the app now you will see no parties, because the auto-publication has been removed and you have access to non of them. To set a new publication we will use a method called [Meteor.publish()](http://docs.meteor.com/#/full/meteor_publish). The publication function is relevant only to the server, because it's its job to publish the data, and the user should subscribe to that data, but no need to jump the gun, we will get to it in a glance.

Let's create a new file located under `imports/api/parties/publish.js` where all our parties publications are going to be defined. Here's how the initial publication should look like:

{{{diff_step 9.2}}}

The first parameter of a publication should be its name and the second parameter should be it's handler. A publication should **always** return a cursor. That cursor we determine which data will be available to our client once he subscribes to that publication. More information about `Mongo.Collection.prototype.find()` can be found [here](http://docs.mongodb.org/manual/reference/method/db.collection.find/).

The returned cursor is returned by a Mongo query so it's easy to understand if you're familiar with MongoDB's API, but in our case what the query does it basically fetches all the parties owned by the currently logged in user and it fetches all the public parties, since they are relevant to the logged in user as well regardless of who he is.

Now we will move the parties collection file from `parties.js` to `parties/collection.js` so our code can be organized properly and we won't have party files spread all over:

{{{diff_step 9.3}}}

Now we want existing importations of the parties collection to stay the same, so we will make our `parties` dir export the parties collection whenever we import it by creating the following file:

{{{diff_step 9.4}}}

Our parties publication is finally set. Let's go ahead and add a subscription to the `parties` dataset in the client using a function provided to us by `angular-meteor` called [this.subscribe()](https://www.angular-meteor.com/api/1.3.11/subscribe):

{{{diff_step 9.6}}}

The first argument of the subscription is gonna be the name of its belonging publication and the rest of the arguments are gonna be the parameters sent to the publication's handler. More information about `Meteor.subscribe()` can be found [here](https://docs.meteor.com/api/pubsub.html#Meteor-subscribe).

If you remember, our publication had an exception of parties which are public. Right no there is no functionality which reveals public parties in the view, in which case we will have to update it. We will start by adding a check-box to the `PartyAdd` view representing if the party currently being added is public or not:

{{{diff_step 9.7}}}

Notice how easy it is to bind the view to a model when using Angular's API. Let's apply the same additions to the `PartyDetails` component.

{{{diff_step 9.8}}}

This requires us to update its controller as well.

{{{diff_step 9.9}}}

And of course, don't forget to subscribe to the `parties` dataset:

{{{diff_step 9.10}}}

Now we can run our app and test it. To do so, log in with two different accounts, create new parties and mess around with it. To log in with two different accounts we recommend opening two instances of the browser, once of them is gonna be incognito, and them you can log in without interrupting the other account.

In the next step, we will want to invite users to private parties. For that, we will need to get all the users, but only their emails without other data which will hurt their privacy.

So let's create another publish method for getting only the needed data on the user.

Notice the we don't need to create a new Meteor collection like we did with parties. **Meteor.users** is a pre-defined collection which is defined by the [meteor-accounts](http://docs.meteor.com/#accounts_api) package.

So let's start with defining our publish function.

Create a new file under the `api` folder named `users.js` and place the following code in:

{{{diff_step 9.11}}}

And make it available on the server side:
* Before, here : move server/startup.js to imports/startup/fixtures.js
* Then, imports/startup/fixtures.js change this "import { Parties } from '../imports/api/parties';" to "import { Parties } from '../api/parties';"

{{{diff_step 9.12}}}

So here again we use the Mongo API to return all the users (find with an empty object) but we select to return only the emails and profile fields.

* Notice that each object (i.e. each user) will automatically contain its `_id` field.

The emails field holds all the user's email addresses, and the profile might hold more optional information like the user's name
(in our case, if the user logged in with the Facebook login, the accounts-facebook package puts the user's name from Facebook automatically into that field).

Now let's subscribe to that publish Method.  In the `PartyDetails` component file add the following line inside the controller:

{{{diff_step 9.13}}}

* We subscribed to the `users` publication
* We added a helper function to the `users` collection

Now let's add the list of users to the view to make sure it works.

Add this ng-repeat list to the end of the template:

{{{diff_step 9.14}}}

# Testing

{{{diff_step 9.15}}}

{{{diff_step 9.16}}}

Run the app and see the list of all the users' emails that created a login and password and did not use a service to login.

# Working with Users collection in the client side

Note that the structure of the Users collection is different between regular email-password, Facebook, Google etc.

The Document structure looks like this (notice where the email is in each one):

__`Email-Password`:__

    {
      "_id" : "8qJt6dRSNDHBuqpXu",
      "createdAt" : ISODate("2015-05-26T00:29:05.109-07:00"),
      "services" : {
        "password" : {
          "bcrypt" : "$2a$10$oSykELjSzcoFWXZTwI5.lOl4BsB1EfcR8RbEm/KsS3zA4x5vlwne6"
        },
        "resume" : {
          "loginTokens" : [
            {
              "when" : ISODate("2015-05-26T00:29:05.112-07:00"),
              "hashedToken" : "6edmW0Wby2xheFxyiUOqDYYFZmOtYHg7VmtXUxEceHg="
            }
          ]
        }
      },
      "emails" : [
        {
          "address" : "email@email.com",
          "verified" : false
        }
      ]
    }

__`Facebook`:__

    {
      "_id" : "etKoiD8MxkQTjTQRY",
      "createdAt" : ISODate("2015-05-25T17:42:16.850-07:00"),
      "services" : {
        "facebook" : {
          "accessToken" : "CAAM10fSvI...",
          "expiresAt" : 1437770457288.0000000000000000,
          "id" : "10153317814289291",
          "email" : "email@email.com",
          "name" : "FirstName LastName",
          "first_name" : "FirstName",
          "last_name" : "LastName",
          "link" : "https://www.facebook.com/app_scoped_user_id/foo"
          "gender" : "male",
          "locale" : "en_US"
        },
        "resume" : {
          "loginTokens" : []
        }
      },
      "profile" : {
        "name" : "First Name LastName"
      }
    }

__`Google`:__

    {
      "_id" : "337r4wwSRWe5B6CCw",
      "createdAt" : ISODate("2015-05-25T22:53:32.172-07:00"),
      "services" : {
        "google" : {
          "accessToken" : "ya29.fwHSzHvC...",
          "idToken" : "eyJhbGciOiJSUzI1NiIs...",
          "expiresAt" : 1432624691685.0000000000000000,
          "id" : "107497376789285885122",
          "email" : "email@email.com",
          "verified_email" : true,
          "name" : "FirstName LastName",
          "given_name" : "FirstName",
          "family_name" : "LastName",
          "picture" : "https://lh5.googleusercontent.com/-foo.jpeg"
          "locale" : "en",
          "gender" : "male"
        },
        "resume" : {
          "loginTokens" : [
            {
              "when" : ISODate("2015-05-25T23:18:11.788-07:00"),
              "hashedToken" : "NaKS2Zeermw+bPlMLhaihsNu6jPaW5+ucFDF2BXT4WQ="
            }
          ]
        }
      },
      "profile" : {
        "name" : "First Name LastName"
      }
    }


Right now it means that the emails of the users that logged in with with email-password will be displayed.

In the chapter of Angular 1 filters we will change the display code to show all emails.


# Understanding Meteor's Publish-Subscribe

It is very important to understand Meteor's Publish-Subscribe mechanism so you don't get confused and use it to filter things in the view!

Meteor accumulates all the data from the different subscription of a collection in the client, so adding a different subscription in a different
view won't delete the data that is already in the client.

More information about publications and subscription in [this blog article](https://medium.com/angular-meteor/coll-pub-sub-with-angular-meteor-cb13fe48f570) and this  [meteorpedia article](http://www.meteorpedia.com/read/Understanding_Meteor_Publish_and_Subscribe).

# Summary

We've added the support of privacy to our parties app.

We also learned how to use the `Meteor.publish` command to control permissions and the data sent to the client
and how to subscribe to it with the $meteor.collection subscribe function.

In the next step we will learn how to deploy. You will see that Meteor makes it easy to put the application online.
