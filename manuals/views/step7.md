[{]: <region> (header)
# Step 7: Folder structure
[}]: #
[{]: <region> (body)
OK, so we have a working app, but, like a tutorial, it's not well organized.

It is really important to organize your app in a standard way, and in Meteor, the structure itself has meaning and implications.

In this step, we are going to combine Meteor's and Angular 1's standard ways of structuring an app into one unified standard structure.


# Meteor folder structure

From the `docs.meteor.com` site:

> Before the release of Meteor 1.3, the only way to share values between files in an application was to assign them to global variables or communicate through shared variables like Session (variables which, while not technically global, sure do feel syntactically identical to global variables). With the introduction of modules, one module can refer precisely to the exports of any other specific module, so global variables are no longer necessary.

> If you are familiar with modules in Node, you might expect modules not to be evaluated until the first time you import them. However, because earlier versions of Meteor evaluated all of your code when the application started, and we care about backwards compatibility, eager evaluation is still the default behavior.

> If you would like a module to be evaluated lazily (in other words: on demand, the first time you import it, just like Node does it), then you should put that module in an imports/ directory (anywhere in your app, not just the root directory), and include that directory when you import the module: import {stuff} from "./imports/lazy". Note: files contained by node_modules/ directories will also be evaluated lazily (more on that below).

> Lazy evaluation will very likely become the default behavior in a future version of Meteor, but if you want to embrace it as fully as possible in the meantime, we recommend putting all your modules inside either client/imports/ or server/imports/ directories, with just a single entry point for each architecture: client/main.js and server/main.js. The main.js files will be evaluated eagerly, giving your application a chance to import modules from the imports/ directories.

## Load order

Before Meteor 1.3, the order in which application files were evaluated was dictated by a set of rules described in the Structuring Your Application section of the docs (see File Load Order subheading). These rules could become frustrating when one file depended on a variable defined by another file, particularly when the first file was evaluated after the second file.

Thanks to modules, any load-order dependency you might imagine can be resolved by adding an import statement. So if a.js loads before b.js because of their file names, but a.js needs something defined by b.js, then a.js can simply import that value from b.js:

    // a.js
    import {bThing} from "./b";
    console.log(bThing, "in a.js");

    // b.js
    export var bThing = "a thing defined in b.js";
    console.log(bThing, "in b.js");

### server

Meteor gathers any files under the **private** subdirectory and makes the contents of these files available to server code via the Assets API. The **private** subdirectory is the place for any files that should be accessible to server code but not served to the client, like private data files.

Any sensitive code that you don't want served to the client, such as code containing passwords or authentication mechanisms, should be kept in the server directory.

### client

Files inside the **client** folder will run only on the client side.

There are more assets to consider on the client side. Meteor gathers all JavaScript files in your tree, with the exception of the server, public, and private subdirectories, for the client. It minifies this bundle and serves it to each new client. You're free to use a single JavaScript file for your entire application, or create a nested tree of separate files, or anything in between.

### public

Lastly, the Meteor server will serve any files under the public directory. This is the place for images, favicon.ico, robots.txt, and anything else.

### imports

Files inside the **imports** are being lazy-loaded.

### More rules

* Files in subdirectories are loaded before files in parent directories, so that files in the deepest subdirectory are loaded first, and files in the root directory are loaded last.
* Within a directory, files are loaded in alphabetical order by filename.
* After sorting as described above, all files under directories named **lib** are moved before everything else (preserving their order).
* Finally, all files that match main.* are moved after everything else (preserving their order).


# Angular 1 folder structure

There are many ways to organize and structure an Angular 1 app.

The two main approaches are:

* Sorting by file type (controllers, views, etc..)
* Sorting based on functionality (users, parties, products, etc..)

The first approach seems to work better with smaller applications and is also the current structure of the [yeoman-angular-generator](https://github.com/yeoman/generator-angular).

The second approach seems to work better for large scale applications.

As we are working close with the Meteor collections, we believe a better approach will be based on functionality, which also correlates to the Meteor's collection structure.

For more Angular 1 structuring and best practices please read this amazing [style-guide](https://github.com/johnpapa/angularjs-styleguide#application-structure) and for best practices for Meteor apps read Meteor's [official guide](http://guide.meteor.com/).

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step6.md) | [Next Step >](step8.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #