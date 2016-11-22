Now that we have full data binding from server to client, let's interact with the data and see the updates in action.

In this chapter you will add the ability to insert a new party and delete an existing one from the UI.

First, let's create a simple `PartyAdd` component with a form and a button that will add a new party, we will add it above the list, inside the `PartiesList` Component view.

{{{diff_step 4.1}}}

{{{diff_step 4.2}}}

Add `PartyAdd` to the `PartiesList` component

{{{diff_step 4.3}}}

{{{diff_step 4.4}}}

Now we need to make this form functional.

## ng-model

First things first, let's bind the value of the inputs into a new party variable.

To do that we'll use the simple and powerful [ng-model](https://docs.angularjs.org/api/ng/directive/ngModel) Angular 1 directive.

Add `ng-model` to the form like this:

{{{diff_step 4.5}}}

Now each time the user types inside these inputs, the value of the `party` variable will be automatically updated.  Conversely, if `partyAdd.party` is changed outside of the HTML, the input values will be updated accordingly.

## ng-click

Now let's bind a click event to the add button with Angular 1's [ng-click](https://docs.angularjs.org/api/ng/directive/ngClick) directive.

{{{diff_step 4.6}}}

`ng-click` binds the click event to an expression - we just call a method that we will implement soon on the `PartyAdd`!

Now let's implement the logic on the controller of the Component:

{{{diff_step 4.7}}}

Since we're using modules, let's take care of `Parties` collection:

{{{diff_step 4.8}}}

{{{diff_step 4.10}}}

Then, we remove all contents from `collections/parties.js`

{{{diff_step 4.11}}}

{{{diff_step 4.12}}}

> Parties is a Mongo.Collection object, and the [insert method](http://docs.meteor.com/#/full/insert) inserts a new object to the collection and assign an id for the new object.

> Meteor supports Javascript ES2015 by default so we can take advantage of that and define our `save` method as a method of PartyAdd class.

Open a different browser, click the button and see how the party is added on both clients. So simple!

Now, let's add the ability to delete parties.

First, we have to create a Component, let's call it `PartyRemove`!

{{{diff_step 4.13}}}

{{{diff_step 4.14}}}

## Bindings

Bindings are the way to use an external data in a component and to add communication between components.

There are four types of binding:

**Value**

`@` - Passing a string value to a component.

```html
<my-component my-attr="hello {{name}}">
```

```js
angular.module('demo')
  .component('myComponent', {
    bindings: {
      myAttr: '@'
    },
    controllerAs: 'myComponent',
    controller: function() {
      // on some action
      this.showName = () => {
        console.log(this.myAttr); // outputs a value of `hello {{name}}`
      };
    }
  });
```

**Two-way**

`=` - It means that you're setting up bidirectional binding between components. Any change of `myAttr` variable will reflect the value of `name`, and vice versa.

```html
<my-component my-attr="name">
```

```js
angular.module('demo')
  .component('myComponent', {
    bindings: {
      myAttr: '='
    },
    controllerAs: 'myComponent',
    controller: function() {
      // on some action
      this.showName = () => {
        console.log(this.myAttr); // outputs name's value
      };

      this.changeName = () => {
        this.myAttr = 'Kamil'; // also changes a value of `name` variable
      };
    }
  });
```

**One-way**

`>` - It means that you're setting up one-directional binding components. Any changes to `name` will be reflected in `myAttr`, but changes in `myAttr` will not reflect in `name`.

```html
<my-component my-attr="name">
```

```js
angular.module('demo')
  .component('myComponent', {
    bindings: {
      myAttr: '>'
    },
    controllerAs: 'myComponent',
    controller: function() {
      // on some action
      this.showName = () => {
        console.log(this.myAttr); // outputs name's value
      };

      this.changeName = () => {
        this.myAttr = 'Kamil'; // does not change a value of `name` variable
      };
    }
  });
```

**Expression**

`&` - An expression. Provides a way to execute an expression in the context of the parent component.

```html
<my-component my-attr="setName(newName)">
```

```js
angular.module('demo')
  .component('myComponent', {
    bindings: {
      myAttr: '&'
    },
    controllerAs: 'myComponent',
    controller: function() {
      // on some action
      this.submit = () => {
        // execute the myAttr expression
        this.myAttr({
          newName: 'Donald'
        });
      };
    }
  });
```

> You can read more about bindings on [Official Angular's documentation](https://docs.angularjs.org/api/ng/service/$compile#-scope-).

Since you know how something about bindings we can continue our work!

Use one-way binding since this is available in AngularJS 1.5:

{{{diff_step 4.15}}}


Now, we can add some logic to remove() method:

{{{diff_step 4.16}}}

It's not yet available in `PartiesList`:

{{{diff_step 4.17}}}

{{{diff_step 4.18}}}

# Summary

So now you've seen how easy it is to manipulate the data using Angular 1's powerful directives and sync that data with Meteor's powerful Mongo.Collection API.

## Testing

One of the new features of Meteor 1.3 is support for testing. In Socially we want to use Jasmine. Let's add it to our app!

    $ meteor add sanjo:jasmine

You probably want to see result of tests:

    $ meteor add velocity:html-reporter
    $ meteor add velocity:console-reporter

We also have to use `angular-mocks`:

    $ meteor npm install --save-dev angular-mocks

Now, add a script to run unit-tests:

{{{diff_step 4.20}}}

Use this command to run tests:

    $ meteor npm run test:watch

{{{diff_step 4.22}}}

{{{diff_step 4.23}}}
