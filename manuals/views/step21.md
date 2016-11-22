[{]: <region> (header)
# Step 21: Mobile Support & Packages Isolation
[}]: #
[{]: <region> (body)
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

[{]: <helper> (diff_step 21.2)
#### Step 21.2: Move login.html to web.html

##### Added imports/ui/components/login/web.html
```diff
@@ -0,0 +1,70 @@
+┊  ┊ 1┊<md-content layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <md-whiteframe layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊    <md-toolbar class="md-primary md-tall" layout="column" layout-align="end" layout-fill>
+┊  ┊ 4┊      <div layout="row" class="md-toolbar-tools md-toolbar-tools-bottom">
+┊  ┊ 5┊        <h3 class="md-display-1">
+┊  ┊ 6┊          Sign in
+┊  ┊ 7┊        </h3>
+┊  ┊ 8┊      </div>
+┊  ┊ 9┊    </md-toolbar>
+┊  ┊10┊
+┊  ┊11┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊12┊      <div layout="row" layout-fill layout-margin>
+┊  ┊13┊        <p class="md-body-2">
+┊  ┊14┊          Use existing account</p>
+┊  ┊15┊      </div>
+┊  ┊16┊
+┊  ┊17┊      <div layout="row" layout-fill layout-margin layout-padding layout-wrap>
+┊  ┊18┊        <md-button class="md-raised">
+┊  ┊19┊          <md-icon md-svg-icon="social:ic_google_24px" style="color: #DC4A38;"></md-icon>
+┊  ┊20┊          <span>Google</span>
+┊  ┊21┊        </md-button>
+┊  ┊22┊        <md-button class="md-raised">
+┊  ┊23┊          <md-icon md-svg-icon="social:ic_facebook_24px" style="color: #3F62B4;"></md-icon>
+┊  ┊24┊          <span>Facebook</span>
+┊  ┊25┊        </md-button>
+┊  ┊26┊        <md-button class="md-raised">
+┊  ┊27┊          <md-icon md-svg-icon="social:ic_twitter_24px" style="color: #27AAE2;"></md-icon>
+┊  ┊28┊          <span>Twitter</span>
+┊  ┊29┊        </md-button>
+┊  ┊30┊      </div>
+┊  ┊31┊      <md-divider class="inset"></md-divider>
+┊  ┊32┊
+┊  ┊33┊      <div layout="row" layout-fill layout-margin>
+┊  ┊34┊        <p class="md-body-2">
+┊  ┊35┊          Sign in with your email</p>
+┊  ┊36┊      </div>
+┊  ┊37┊
+┊  ┊38┊      <form name="loginForm" layout="column" layout-fill layout-padding layout-margin>
+┊  ┊39┊        <md-input-container>
+┊  ┊40┊          <label>
+┊  ┊41┊            Email
+┊  ┊42┊          </label>
+┊  ┊43┊          <input type="text" ng-model="login.credentials.email" aria-label="email" required/>
+┊  ┊44┊        </md-input-container>
+┊  ┊45┊        <md-input-container>
+┊  ┊46┊          <label>
+┊  ┊47┊            Password
+┊  ┊48┊          </label>
+┊  ┊49┊          <input type="password" ng-model="login.credentials.password" aria-label="password" required/>
+┊  ┊50┊        </md-input-container>
+┊  ┊51┊        <div layout="row" layout-align="space-between center">
+┊  ┊52┊          <a class="md-button" href="/password">Forgot password?</a>
+┊  ┊53┊          
+┊  ┊54┊          <md-button class="md-raised md-primary" ng-click="login.login()" aria-label="login" ng-disabled="login.loginForm.$invalid()">Sign In
+┊  ┊55┊          </md-button>
+┊  ┊56┊        </div>
+┊  ┊57┊      </form>
+┊  ┊58┊
+┊  ┊59┊      <md-toolbar ng-show="login.error" class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊60┊        <p class="md-body-1">{{ login.error }}</p>
+┊  ┊61┊      </md-toolbar>
+┊  ┊62┊
+┊  ┊63┊      <md-divider></md-divider>
+┊  ┊64┊
+┊  ┊65┊      <div layout="row" layout-align="center">
+┊  ┊66┊        <a class="md-button" href="/register">Need an account?</a>
+┊  ┊67┊      </div>
+┊  ┊68┊    </div>
+┊  ┊69┊  </md-whiteframe>
+┊  ┊70┊</md-content>
```
[}]: #

Now we can create a view for a mobile version:

[{]: <helper> (diff_step 21.3)
#### Step 21.3: Add mobile view

##### Added imports/ui/components/login/mobile.html
```diff
@@ -0,0 +1,27 @@
+┊  ┊ 1┊<md-content layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <md-whiteframe layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊    <!-- header -->
+┊  ┊ 4┊    <md-toolbar class="md-primary md-tall" layout="column" layout-align="end" layout-fill>
+┊  ┊ 5┊      <div layout="row" class="md-toolbar-tools md-toolbar-tools-bottom">
+┊  ┊ 6┊        <h3 class="md-display-1">
+┊  ┊ 7┊          Login
+┊  ┊ 8┊        </h3>
+┊  ┊ 9┊      </div>
+┊  ┊10┊    </md-toolbar>
+┊  ┊11┊
+┊  ┊12┊    <!-- content -->
+┊  ┊13┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊14┊      <!-- display an error -->
+┊  ┊15┊      <md-toolbar ng-show="login.error" class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊16┊        <p class="md-body-1">{{ login.error }}</p>
+┊  ┊17┊      </md-toolbar>
+┊  ┊18┊
+┊  ┊19┊      <md-divider></md-divider>
+┊  ┊20┊
+┊  ┊21┊      <!-- other actions -->
+┊  ┊22┊      <div layout="row" layout-align="center">
+┊  ┊23┊        <a class="md-button" href="/password">Forgot password?</a>
+┊  ┊24┊      </div>
+┊  ┊25┊    </div>
+┊  ┊26┊  </md-whiteframe>
+┊  ┊27┊</md-content>
```
[}]: #

As you can see for now there are only three elements:

* md-toolbar with a heading
* md-toolbar to display an error
* and a link to password reset section

Now we have views for both versions. Let's take `Login` class which is component's controller and move it to `web.js`:

[{]: <helper> (diff_step 21.4)
#### Step 21.4: Move Login class to web.js

##### Added imports/ui/components/login/web.js
```diff
@@ -0,0 +1,30 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊
+┊  ┊ 3┊export class Login {
+┊  ┊ 4┊  constructor($scope, $reactive, $state) {
+┊  ┊ 5┊    'ngInject';
+┊  ┊ 6┊
+┊  ┊ 7┊    this.$state = $state;
+┊  ┊ 8┊
+┊  ┊ 9┊    $reactive(this).attach($scope);
+┊  ┊10┊
+┊  ┊11┊    this.credentials = {
+┊  ┊12┊      email: '',
+┊  ┊13┊      password: ''
+┊  ┊14┊    };
+┊  ┊15┊
+┊  ┊16┊    this.error = '';
+┊  ┊17┊  }
+┊  ┊18┊
+┊  ┊19┊  login() {
+┊  ┊20┊    Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
+┊  ┊21┊      this.$bindToContext((err) => {
+┊  ┊22┊        if (err) {
+┊  ┊23┊          this.error = err;
+┊  ┊24┊        } else {
+┊  ┊25┊          this.$state.go('parties');
+┊  ┊26┊        }
+┊  ┊27┊      })
+┊  ┊28┊    );
+┊  ┊29┊  }
+┊  ┊30┊}
```
[}]: #

Let's create an empty class with the same name but for mobile inside `mobile.js` file:

[{]: <helper> (diff_step 21.5)
#### Step 21.5: Create controller for mobile

##### Added imports/ui/components/login/mobile.js
```diff
@@ -0,0 +1 @@
+┊ ┊1┊export class Login {}
```
[}]: #

We have two modules: web and mobile. Now let's do few things with `login.js`:

* Remove an old `login.html` view.
* Remove an old `Login` class.
* Import `Login` classes from `mobile` and `web` modules.
* Import both recently created views.
* Create `controller` and `template` variables so they can be used in component definition.
* Use `Meteor.isCordova` inside conditional statement to set proper value for these variables.

`login.js` file should look like this:

[{]: <helper> (diff_step 21.6)
#### Step 21.6: Refactor login.js

##### Changed imports/ui/components/login/login.js
```diff
@@ -4,40 +4,14 @@
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import { Meteor } from 'meteor/meteor';
 ┊ 6┊ 6┊
-┊ 7┊  ┊import template from './login.html';
-┊ 8┊  ┊
-┊ 9┊  ┊import { name as Register } from '../register/register';
-┊10┊  ┊
-┊11┊  ┊class Login {
-┊12┊  ┊  constructor($scope, $reactive, $state) {
-┊13┊  ┊    'ngInject';
-┊14┊  ┊
-┊15┊  ┊    this.$state = $state;
-┊16┊  ┊
-┊17┊  ┊    $reactive(this).attach($scope);
-┊18┊  ┊
-┊19┊  ┊    this.credentials = {
-┊20┊  ┊      email: '',
-┊21┊  ┊      password: ''
-┊22┊  ┊    };
-┊23┊  ┊
-┊24┊  ┊    this.error = '';
-┊25┊  ┊  }
-┊26┊  ┊
-┊27┊  ┊  login() {
-┊28┊  ┊    Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
-┊29┊  ┊      this.$bindToContext((err) => {
-┊30┊  ┊        if (err) {
-┊31┊  ┊          this.error = err;
-┊32┊  ┊        } else {
-┊33┊  ┊          this.$state.go('parties');
-┊34┊  ┊        }
-┊35┊  ┊      })
-┊36┊  ┊    );
-┊37┊  ┊  }
-┊38┊  ┊}
+┊  ┊ 7┊import webTemplate from './web.html';
+┊  ┊ 8┊import { Login as LoginWeb } from './web';
+┊  ┊ 9┊import mobileTemplate from './mobile.html';
+┊  ┊10┊import { Login as LoginMobile } from './mobile';
 ┊39┊11┊
 ┊40┊12┊const name = 'login';
+┊  ┊13┊const template = Meteor.isCordova ? mobileTemplate : webTemplate;
+┊  ┊14┊const controller = Meteor.isCordova ? LoginMobile : LoginWeb;
 ┊41┊15┊
 ┊42┊16┊// create a module
 ┊43┊17┊export default angular.module(name, [
```
```diff
@@ -46,8 +20,8 @@
 ┊46┊20┊])
 ┊47┊21┊  .component(name, {
 ┊48┊22┊    template,
-┊49┊  ┊    controllerAs: name,
-┊50┊  ┊    controller: Login
+┊  ┊23┊    controller,
+┊  ┊24┊    controllerAs: name
 ┊51┊25┊  })
 ┊52┊26┊  .config(config);
```
[}]: #


### SMS verification

As I mentioned before, we're going to use SMS verification to log in a user on the mobile application.

There is a package for that!

We will use an external package that extends Meteor's Accounts, called [accounts-phone](https://atmospherejs.com/okland/accounts-phone) that verifies phone number with SMS message, so let's add it:

    $ meteor add okland:accounts-phone

> Note that in development mode - the SMS will not be sent - and the verification code will be printed to the Meteor log.

> Latest release of accounts-phone won't work with Meteor 1.3.
Until this changes you can use `mys:accounts-phone` which fixes that issue.

This is a two-step process so let's implement the first one:

[{]: <helper> (diff_step 21.9)
#### Step 21.9: Add phone verification method

##### Changed imports/ui/components/login/mobile.js
```diff
@@ -1 +1,27 @@
-┊ 1┊  ┊export class Login {}
+┊  ┊ 1┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 2┊
+┊  ┊ 3┊export class Login {
+┊  ┊ 4┊  constructor($scope, $reactive) {
+┊  ┊ 5┊    'ngInject';
+┊  ┊ 6┊
+┊  ┊ 7┊    $reactive(this).attach($scope);
+┊  ┊ 8┊
+┊  ┊ 9┊    this.isStepTwo = false;
+┊  ┊10┊    this.phoneNumber = '';
+┊  ┊11┊    this.verificationCode = '';
+┊  ┊12┊    this.error = '';
+┊  ┊13┊  }
+┊  ┊14┊
+┊  ┊15┊  verifyPhone() {
+┊  ┊16┊    Accounts.requestPhoneVerification(this.phoneNumber, this.$bindToContext((err) => {
+┊  ┊17┊      if (err) {
+┊  ┊18┊        // display also reason of Meteor.Error
+┊  ┊19┊        this.error = err.reason || err;
+┊  ┊20┊      } else {
+┊  ┊21┊        this.error = '';
+┊  ┊22┊        // move to code verification
+┊  ┊23┊        this.isStepTwo = true;
+┊  ┊24┊      }
+┊  ┊25┊    }));
+┊  ┊26┊  }
+┊  ┊27┊}
```
[}]: #

Let me explain what happened:

* We used `isStepTwo` variable to check in which step we currently are.
* `verificationCode` will be used in the second step.
* `Accounts.requestPhoneVerification` is to verify a phone number.
* `this.isStepTwo = true;` is to mark that we moved to the second step

Now we can implement it in the `mobile.html`:

[{]: <helper> (diff_step 21.10)
#### Step 21.10: Add phone verification form

##### Changed imports/ui/components/login/mobile.html
```diff
@@ -4,13 +4,22 @@
 ┊ 4┊ 4┊    <md-toolbar class="md-primary md-tall" layout="column" layout-align="end" layout-fill>
 ┊ 5┊ 5┊      <div layout="row" class="md-toolbar-tools md-toolbar-tools-bottom">
 ┊ 6┊ 6┊        <h3 class="md-display-1">
-┊ 7┊  ┊          Login
+┊  ┊ 7┊          Login with SMS
 ┊ 8┊ 8┊        </h3>
 ┊ 9┊ 9┊      </div>
 ┊10┊10┊    </md-toolbar>
 ┊11┊11┊
 ┊12┊12┊    <!-- content -->
 ┊13┊13┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊14┊      <!-- step 1: phone verification -->
+┊  ┊15┊      <form ng-show="!login.isStepTwo" layout="column" layout-fill layout-padding layout-margin>
+┊  ┊16┊        <md-input-container>
+┊  ┊17┊          <input type="text" ng-model="login.phoneNumber" placeholder="phone"/>
+┊  ┊18┊        </md-input-container>
+┊  ┊19┊        <md-button class="md-raised md-primary" ng-click="login.verifyPhone()" aria-label="login" ng-disabled="!login.phoneNumber">Send SMS
+┊  ┊20┊        </md-button>
+┊  ┊21┊      </form>
+┊  ┊22┊      
 ┊14┊23┊      <!-- display an error -->
 ┊15┊24┊      <md-toolbar ng-show="login.error" class="md-warn" layout="row" layout-fill layout-padding layout-margin>
 ┊16┊25┊        <p class="md-body-1">{{ login.error }}</p>
```
[}]: #

Let's move to second step which is the code verification. We have to create a method for this:

[{]: <helper> (diff_step 21.11)
#### Step 21.11: Add code verification method

##### Changed imports/ui/components/login/mobile.js
```diff
@@ -1,9 +1,11 @@
 ┊ 1┊ 1┊import { Accounts } from 'meteor/accounts-base';
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊export class Login {
-┊ 4┊  ┊  constructor($scope, $reactive) {
+┊  ┊ 4┊  constructor($scope, $reactive, $state) {
 ┊ 5┊ 5┊    'ngInject';
 ┊ 6┊ 6┊
+┊  ┊ 7┊    this.$state = $state;
+┊  ┊ 8┊
 ┊ 7┊ 9┊    $reactive(this).attach($scope);
 ┊ 8┊10┊
 ┊ 9┊11┊    this.isStepTwo = false;
```
```diff
@@ -24,4 +26,15 @@
 ┊24┊26┊      }
 ┊25┊27┊    }));
 ┊26┊28┊  }
+┊  ┊29┊
+┊  ┊30┊  verifyCode() {
+┊  ┊31┊    Accounts.verifyPhone(this.phoneNumber, this.verificationCode, this.$bindToContext((err) => {
+┊  ┊32┊      if (err) {
+┊  ┊33┊        this.error = err.reason || err;
+┊  ┊34┊      } else {
+┊  ┊35┊        // redirect to parties list
+┊  ┊36┊        this.$state.go('parties');
+┊  ┊37┊      }
+┊  ┊38┊    }));
+┊  ┊39┊  }
 ┊27┊40┊}
```
[}]: #

* We used `$state` service to redirect user to `parties` after successful verification.
* `Accounts.verifyPhone` is to verify a code with a phone number.

Add it to the `mobile.html`:

[{]: <helper> (diff_step 21.12)
#### Step 21.12: Add code verification form

##### Changed imports/ui/components/login/mobile.html
```diff
@@ -19,7 +19,15 @@
 ┊19┊19┊        <md-button class="md-raised md-primary" ng-click="login.verifyPhone()" aria-label="login" ng-disabled="!login.phoneNumber">Send SMS
 ┊20┊20┊        </md-button>
 ┊21┊21┊      </form>
-┊22┊  ┊      
+┊  ┊22┊      <!-- step 2: code verification -->
+┊  ┊23┊      <form ng-show="login.isStepTwo" layout="column" layout-fill layout-padding layout-margin>
+┊  ┊24┊        <md-input-container>
+┊  ┊25┊          <input type="text" ng-model="login.verificationCode" placeholder="code"/>
+┊  ┊26┊        </md-input-container>
+┊  ┊27┊        <md-button class="md-raised md-primary" ng-click="login.verifyCode()" aria-label="login" ng-disabled="!login.verificationCode">Verify Code
+┊  ┊28┊        </md-button>
+┊  ┊29┊      </form>
+┊  ┊30┊
 ┊23┊31┊      <!-- display an error -->
 ┊24┊32┊      <md-toolbar ng-show="login.error" class="md-warn" layout="row" layout-fill layout-padding layout-margin>
 ┊25┊33┊        <p class="md-body-1">{{ login.error }}</p>
```
[}]: #

And that's it! We've got a the same component that behaves differently for each platform!

## Summary

In this tutorial we showed how to make our code behave differently in mobile and web platforms. We did this by creating separate es2015 modules with specific code for mobile and web, and using them based on the platform that runs the application.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step20.md) | [Next Step >](step22.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #