In this step we will consider switching from *Twitter Bootstrap* to [*angular-material*](https://material.angularjs.org/#/).

Angular-material is an Angular 1 implementation of Google's [Material Design specifications](http://www.google.com/design/spec/material-design/introduction.html). Material Design is a mobile-first design language used in many new Google's applications, especially on the Android platform.

# Removing Bootstrap 4

To start, first we have to remove bootstrap from our application. Type in the console:

    meteor npm uninstall bootstrap --save

We should also remove dependency from the main.js file:

{{{diff_step 18.4}}}

# Installing angular-material

Now we have to add the angular-material Meteor package:

    meteor npm install angular-aria angular-animate angular-material --save

We still need file with styles:

{{{diff_step 18.3}}}

Next, we want to inject the angular-material module into our Angular 1 application.

{{{diff_step 18.5}}}

That's it, now we can use `angular-material` in our application layout.

Let's add `Material Design Icons` and `Ionic Icons` to Socially:

    meteor add pagebakers:ionicons
    meteor add planettraining:material-design-icons

We have to define the `$mdIconProvider`.

{{{diff_step 18.20}}}

You don't have to define all these icon sets.
You just need to define those you need to use.
You can see a full list of available icons [here](http://google.github.io/material-design-icons/).

This is the example from `PartyRemove` component:

    <md-icon md-svg-icon="content:ic_clear_24px"></md-icon>

In the `md-svg-icon` attribute we used `<iconset>:<icon_name>` in our case `content:ic_clear_24px`.

You can read more about it by clicking [here](https://material.angularjs.org/latest/api/service/$mdIconProvider)

Great! So now in order get rid of all the bootstrap change we make, we need to remove some and modify some CSS and LESS.

Angular-material uses declarative syntax, i.e. directives, to utilize Material Design elements in HTML documents.

First we want to change our main component which is Socially

{{{diff_step 18.6}}}

# Navigation

Use `md-toolbar` in Navigation:

{{{diff_step 18.7}}}

{{{diff_step 18.8}}}

# PartiesList

You can see we use `layout="column"` in the first `div` tag, which tells angular-material to lay all inner layers vertically.

Element layout flex grid is very simple and intuitive in `angular-material` and you can read all about it [here](https://material.angularjs.org/#/layout/grid).

Later on, we use `layout-gt-sm="row"` which overrides `column` setting on screens greater than 960px wide.

{{{diff_step 18.9}}}

{{{diff_step 18.10}}}

# PariesMap

Remove the heading:

{{{diff_step 18.11}}}

{{{diff_step 18.12}}}

{{{diff_step 18.13}}}

# PartiesSort

Let's use `md-input-container` combined with `md-select`:

{{{diff_step 18.14}}}

# PartyAdd

We won't be using `partyAdd.less` any longer, so it can be removed.

{{{diff_step 18.15}}}

# PartyCreator

We can now remove partyCreator.less since we no longer need it.

{{{diff_step 18.17}}}

# PartyRemove

Let's use `clear` icon from `content` set:

{{{diff_step 18.21}}}

Move component to the right:

{{{diff_step 18.22}}}

{{{diff_step 18.23}}}

# PartyRsvp

Since we using only the angular-material directives you can remove .less file of PartyRsvp component:

{{{diff_step 18.24}}}

# PartyUninvited

Thanks to the angular-material we no longer need partyUninvited.less:

{{{diff_step 18.26}}}

# PartyRsvpsList

Let's import styles in PartiesList:

{{{diff_step 18.28}}}

# PartyMap

Add a little padding from each side:

{{{diff_step 18.29}}}

# PartyDetails

As you can see, we used `md-input-container` in similar way as we did with PartyAdd:

{{{diff_step 18.30}}}

Make `partyDetails.less` to look like this:

{{{diff_step 18.31}}}

# Modal window for PartyAdd

It would be great to move PartyAdd outside PartiesList. It would be even greater to make modal window for it.

We need to create some sort of modal window trigger:

{{{diff_step 18.32}}}

{{{diff_step 18.33}}}

What we did there?

* We used [$mdDialog](https://material.angularjs.org/latest/api/service/$mdDialog) to open a new dialog window.
* We used [$mdMedia](https://material.angularjs.org/latest/api/service/$mdMedia) to check if window has to be opened in fullscreen mode (on small screens it look much better).
* We defined a view *partyAddModal.html* which we will create in the next step.

{{{diff_step 18.34}}}


{{{diff_step 18.35}}}
As you can see we used `done` directive on `PartyAdd` component and for now it does nothing.

It would be an expression binding which invokes after a new party has been added.

{{{diff_step 18.36}}}

Great! Our new component is now working and cooperating with PartyAdd component.
Let's implement it into `PartiesList`:

{{{diff_step 18.37}}}

{{{diff_step 18.38}}}

{{{diff_step 18.39}}}

Now try to click on a button displayed in the right bottom corner of the screen. You should see opened modal window with PartyAdd component!

# Custom Authentication Components

Our next step will replace the login-buttons which is a simple and non-styled login/register component - we will add our custom authentication component with custom style.

First, let's create `Auth` component:

{{{diff_step 18.40}}}

{{{diff_step 18.41}}}

As you can see, we're going to create components for few new states.

First state is a page with `Login` component.

In this component we use Meteor's accounts, and use the Accounts API to login our user with email and password.

{{{diff_step 18.42}}}

{{{diff_step 18.43}}}

{{{diff_step 18.44}}}

In `Register` component we use Meteor's accounts, and use the Accounts API to add a new user.

{{{diff_step 18.45}}}

{{{diff_step 18.46}}}

{{{diff_step 18.47}}}

We also have "Recover" button in the login page, so let's create a component that handles that, and call it `Password`:

{{{diff_step 18.48}}}

{{{diff_step 18.49}}}

{{{diff_step 18.50}}}

Since every component is ready, we can now implement Auth into Socially:

{{{diff_step 18.51}}}

{{{diff_step 18.52}}}

Inside the `md-toolbar` you see we used

    <span flex></span>

element which is actually a separator blank element which is used to fill all the available blank space between the first and third element in the toolbar.

We can now remove `navigation.less`, which we don't need any longer:

{{{diff_step 18.54}}}

That's it! we just implemented our own authentication components using Meteor's Accounts API and angular-material!


# Summary

In this chapter we two main things:

1. How to work with angular-material-design in our angular-meteor app
2. How to create custom Angular 1 forms for our application's auth

I hope one of you will create an accounts-ui package based on that code and will save us all tons of code!
