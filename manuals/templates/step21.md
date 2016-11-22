This step of the tutorial teaches us how to add mobile support for iOS and Android and how to elegantly reuse code using the es2015 modules.

In this tutorial's example we will differentiate the login part of the project: in the browser users will login using email and password and in the mobile app users will login with SMS verification.

### Adding mobile support for the project:

To add mobile support, select the platform(s) you want and run the following command:

    $ meteor add-platform ios
    # OR / AND
    $ meteor add-platform android

And now to run in the emulator, run:

    $ meteor run ios
    # OR
    $ meteor run android

You can also run in a real mobile device, for more instructions, read the ["Mobile" chapter](http://guide.meteor.com/mobile.html) of the Official Meteor Guide.

### Creating es2015 modules

We're going to keep the view and the controller for the web under `web.html` and `web.js` and doing the same for `mobile.html` and `mobile.js`.

First thing to do is to move the content of `login.html` to `web.html` file:

{{{diff_step 21.2}}}

Now we can create a view for a mobile version:

{{{diff_step 21.3}}}

As you can see for now there are only three elements:

* md-toolbar with a heading
* md-toolbar to display an error
* and a link to password reset section

Now we have views for both versions. Let's take `Login` class which is component's controller and move it to `web.js`:

{{{diff_step 21.4}}}

Let's create an empty class with the same name but for mobile inside `mobile.js` file:

{{{diff_step 21.5}}}

We have two modules: web and mobile. Now let's do few things with `login.js`:

* Remove an old `login.html` view.
* Remove an old `Login` class.
* Import `Login` classes from `mobile` and `web` modules.
* Import both recently created views.
* Create `controller` and `template` variables so they can be used in component definition.
* Use `Meteor.isCordova` inside conditional statement to set proper value for these variables.

`login.js` file should look like this:

{{{diff_step 21.6}}}


### SMS verification

As I mentioned before, we're going to use SMS verification to log in a user on the mobile application.

There is a package for that!

We will use an external package that extends Meteor's Accounts, called [accounts-phone](https://atmospherejs.com/okland/accounts-phone) that verifies phone number with SMS message, so let's add it:

    $ meteor add okland:accounts-phone

> Note that in development mode - the SMS will not be sent - and the verification code will be printed to the Meteor log.

> Latest release of accounts-phone won't work with Meteor 1.3.
Until this changes you can use `mys:accounts-phone` which fixes that issue.

This is a two-step process so let's implement the first one:

{{{diff_step 21.9}}}

Let me explain what happened:

* We used `isStepTwo` variable to check in which step we currently are.
* `verificationCode` will be used in the second step.
* `Accounts.requestPhoneVerification` is to verify a phone number.
* `this.isStepTwo = true;` is to mark that we moved to the second step

Now we can implement it in the `mobile.html`:

{{{diff_step 21.10}}}

Let's move to second step which is the code verification. We have to create a method for this:

{{{diff_step 21.11}}}

* We used `$state` service to redirect user to `parties` after successful verification.
* `Accounts.verifyPhone` is to verify a code with a phone number.

Add it to the `mobile.html`:

{{{diff_step 21.12}}}

And that's it! We've got a the same component that behaves differently for each platform!

## Summary

In this tutorial we showed how to make our code behave differently in mobile and web platforms. We did this by creating separate es2015 modules with specific code for mobile and web, and using them based on the platform that runs the application.
