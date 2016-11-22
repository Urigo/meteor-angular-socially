[{]: <region> (header)
# Step 20: Handling Files with UploadFS
[}]: #
[{]: <region> (body)
In this step we are going to add the ability to upload images into our app, and also sorting and naming them.

Angular-Meteor can use Meteor [UploadFS](https://github.com/jalik/jalik-ufs) which is a suite of Meteor packages that together provide a complete file management solution including uploading, downloading, storage, synchronization, manipulation, and copying.

It supports several storage adapters for saving files to the local filesystem, GridFS and additional storage adapters can be created.

The process is very similar for handling any other MongoDB Collection!

So let's add image upload to our app!


We will start by adding UploadFS to our project, by running the following command:

    $ meteor add jalik:ufs

Now, we will decide the storage adapter we want to use.
In this example, we will use the GridFS as storage adapters, so we will add the adapter by running this command:

    $ meteor add jalik:ufs-gridfs

Note: you can find more information about Stores and Storage Adapters on the [UploadFS](https://github.com/jalik/jalik-ufs)'s GitHub repository.

So now we have the UploadFS support and the storage adapter installed - we still need to create a UploadFS object to handle our files.
Note that you will need to define the collection as shared resource because you will need to use the collection in both client and server side.

### Creating the Mongo Collection and UploadFS Store

Let's start by creating `imports/api/images/collection.js` file, and define a Mongo Collection object called "Images". Since we want to be able to make thumbnails we have to create another Collection called "Thumbs".

Also we will use the stadard Mongo Collection API that allows us to defined auth-rules.

[{]: <helper> (diff_step 20.3)
#### Step 20.3: Create Images and Thumbs collections

##### Added imports/api/images/collection.js
```diff
@@ -0,0 +1,21 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Mongo } from 'meteor/mongo';
+┊  ┊ 3┊
+┊  ┊ 4┊export const Images = new Mongo.Collection('images');
+┊  ┊ 5┊export const Thumbs = new Mongo.Collection('thumbs');
+┊  ┊ 6┊
+┊  ┊ 7┊function loggedIn(userId) {
+┊  ┊ 8┊  return !!userId;
+┊  ┊ 9┊}
+┊  ┊10┊
+┊  ┊11┊Thumbs.allow({
+┊  ┊12┊  insert: loggedIn,
+┊  ┊13┊  update: loggedIn,
+┊  ┊14┊  remove: loggedIn
+┊  ┊15┊});
+┊  ┊16┊
+┊  ┊17┊Images.allow({
+┊  ┊18┊  insert: loggedIn,
+┊  ┊19┊  update: loggedIn,
+┊  ┊20┊  remove: loggedIn
+┊  ┊21┊});
```
[}]: #

We have to create Stores for Images and Thumbs.

[{]: <helper> (diff_step 20.4)
#### Step 20.4: Create ThumbsStore and ImagesStore

##### Added imports/api/images/store.js
```diff
@@ -0,0 +1,18 @@
+┊  ┊ 1┊import { UploadFS } from 'meteor/jalik:ufs';
+┊  ┊ 2┊import { Images, Thumbs } from './collection';
+┊  ┊ 3┊
+┊  ┊ 4┊export const ThumbsStore = new UploadFS.store.GridFS({
+┊  ┊ 5┊  collection: Thumbs,
+┊  ┊ 6┊  name: 'thumbs'
+┊  ┊ 7┊});
+┊  ┊ 8┊
+┊  ┊ 9┊export const ImagesStore = new UploadFS.store.GridFS({
+┊  ┊10┊  collection: Images,
+┊  ┊11┊  name: 'images',
+┊  ┊12┊  filter: new UploadFS.Filter({
+┊  ┊13┊    contentTypes: ['image/*']
+┊  ┊14┊  }),
+┊  ┊15┊  copyTo: [
+┊  ┊16┊    ThumbsStore
+┊  ┊17┊  ]
+┊  ┊18┊});
```
[}]: #

Let's explain a bit what happened.

* We assigned Stores to their Collections, which is required.
* We defined names of these Stores.
* We added filter to ImagesStore so it can receive only images.
* Every file will be copied to ThumbsStore.


Now we can create `index.js` file to export Collections and Stores:

[{]: <helper> (diff_step 20.5)
#### Step 20.5: Create main export file of Images and Thumbs

##### Added imports/api/images/index.js
```diff
@@ -0,0 +1,2 @@
+┊ ┊1┊export * from './collection';
+┊ ┊2┊export * from './store';
```
[}]: #

There is a reason why we called one of the Collections the `Thumbs`!

Since we transfer every uploaded file to ThumbsStore, we can now easily add file manipulations.

Let's resize every file to 32x32:

[{]: <helper> (diff_step 20.6)
#### Step 20.6: Resize images

##### Changed imports/api/images/store.js
```diff
@@ -3,7 +3,19 @@
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊export const ThumbsStore = new UploadFS.store.GridFS({
 ┊ 5┊ 5┊  collection: Thumbs,
-┊ 6┊  ┊  name: 'thumbs'
+┊  ┊ 6┊  name: 'thumbs',
+┊  ┊ 7┊  transformWrite(from, to, fileId, file) {
+┊  ┊ 8┊    // Resize to 32x32
+┊  ┊ 9┊    const gm = require('gm');
+┊  ┊10┊
+┊  ┊11┊    gm(from, file.name)
+┊  ┊12┊      .resize(32, 32)
+┊  ┊13┊      .gravity('Center')
+┊  ┊14┊      .extent(32, 32)
+┊  ┊15┊      .quality(75)
+┊  ┊16┊      .stream()
+┊  ┊17┊      .pipe(to);
+┊  ┊18┊  }
 ┊ 7┊19┊});
 ┊ 8┊20┊
 ┊ 9┊21┊export const ImagesStore = new UploadFS.store.GridFS({
```
[}]: #

We used [`gm`](https://github.com/aheckmann/gm) module, let's install it:

    $ meteor npm install gm --save

> Be aware that this module requires at least one of these libraries: [GraphicsMagick](http://www.graphicsmagick.org/), [ImageMagick](http://www.imagemagick.org/).

### Image upload

Now, let's create the `PartyUpload` component. It will be responsible for cropping and uploading photos.

[{]: <helper> (diff_step 20.8)
#### Step 20.8: Create view for PartyUpload

##### Added imports/ui/components/partyUpload/partyUpload.html
```diff
@@ -0,0 +1,9 @@
+┊ ┊1┊<div layout="column">
+┊ ┊2┊  <div>
+┊ ┊3┊      <div>Click here to select image</div>
+┊ ┊4┊      <div>
+┊ ┊5┊        <strong>OR</strong>
+┊ ┊6┊      </div>
+┊ ┊7┊      <div>You can also drop image to here</div>
+┊ ┊8┊  </div>
+┊ ┊9┊</div>
```
[}]: #

[{]: <helper> (diff_step 20.9)
#### Step 20.9: Create PartyUpload component

##### Added imports/ui/components/partyUpload/partyUpload.js
```diff
@@ -0,0 +1,19 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './partyUpload.html';
+┊  ┊ 7┊
+┊  ┊ 8┊class PartyUpload {}
+┊  ┊ 9┊
+┊  ┊10┊const name = 'partyUpload';
+┊  ┊11┊
+┊  ┊12┊// create a module
+┊  ┊13┊export default angular.module(name, [
+┊  ┊14┊  angularMeteor
+┊  ┊15┊]).component(name, {
+┊  ┊16┊  template,
+┊  ┊17┊  controllerAs: name,
+┊  ┊18┊  controller: PartyUpload
+┊  ┊19┊});
```
[}]: #

We want to use it in `PartyAdd`:

[{]: <helper> (diff_step 20.10)
#### Step 20.10: Add to PartyAdd

##### Changed imports/ui/components/partyAdd/partyAdd.js
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊
 ┊ 6┊ 6┊import template from './partyAdd.html';
 ┊ 7┊ 7┊import { Parties } from '../../../api/parties';
+┊  ┊ 8┊import { name as PartyUpload } from '../partyUpload/partyUpload';
 ┊ 8┊ 9┊
 ┊ 9┊10┊class PartyAdd {
 ┊10┊11┊  constructor() {
```
```diff
@@ -31,7 +32,8 @@
 ┊31┊32┊
 ┊32┊33┊// create a module
 ┊33┊34┊export default angular.module(name, [
-┊34┊  ┊  angularMeteor
+┊  ┊35┊  angularMeteor,
+┊  ┊36┊  PartyUpload
 ┊35┊37┊]).component(name, {
 ┊36┊38┊  template,
 ┊37┊39┊  bindings: {
```
[}]: #

[{]: <helper> (diff_step 20.11)
#### Step 20.11: Implement to the view

##### Changed imports/ui/components/partyAdd/partyAdd.html
```diff
@@ -19,4 +19,5 @@
 ┊19┊19┊  <div flex>
 ┊20┊20┊    <md-button ng-click="partyAdd.submit()" class="md-raised">Add Party!</md-button>
 ┊21┊21┊  </div>
+┊  ┊22┊  <party-upload files="partyAdd.party.images"></party-upload>
 ┊22┊23┊</div>
```
[}]: #

As you can see we used `files` directive. We will create it later. For now, let's only say that this is a two-way data binding.


Note that for file upload you can use basic HTML `<input type="file">` or any other package - you only need the HTML5 File object to be provided.

For our application, we would like to add ability to drag-and-drop images, so we use AngularJS directive that handles file upload and gives us more abilities such as drag & drop, file validation on the client side. In this example, We will use [`ng-file-upload`](https://github.com/danialfarid/ng-file-upload), which have many features for file upload. In order to do this, let's add the package to our project:

    $ meteor npm install ng-file-upload --save

Now, lets add a dependency in the `PartyUpload`:

[{]: <helper> (diff_step 20.13)
#### Step 20.13: Add as a dependency

##### Changed imports/ui/components/partyUpload/partyUpload.js
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
+┊ ┊3┊import ngFileUpload from 'ng-file-upload';
 ┊3┊4┊
 ┊4┊5┊import { Meteor } from 'meteor/meteor';
 ┊5┊6┊
```
```diff
@@ -11,7 +12,8 @@
 ┊11┊12┊
 ┊12┊13┊// create a module
 ┊13┊14┊export default angular.module(name, [
-┊14┊  ┊  angularMeteor
+┊  ┊15┊  angularMeteor,
+┊  ┊16┊  ngFileUpload
 ┊15┊17┊]).component(name, {
 ┊16┊18┊  template,
 ┊17┊19┊  controllerAs: name,
```
[}]: #

Now, let's add the usage of `ng-file-upload`:

[{]: <helper> (diff_step 20.14)
#### Step 20.14: Add ngf-drop to the view

##### Changed imports/ui/components/partyUpload/partyUpload.html
```diff
@@ -1,9 +1,18 @@
 ┊ 1┊ 1┊<div layout="column">
-┊ 2┊  ┊  <div>
-┊ 3┊  ┊      <div>Click here to select image</div>
-┊ 4┊  ┊      <div>
-┊ 5┊  ┊        <strong>OR</strong>
-┊ 6┊  ┊      </div>
-┊ 7┊  ┊      <div>You can also drop image to here</div>
+┊  ┊ 2┊  <div ngf-drop
+┊  ┊ 3┊    ngf-select
+┊  ┊ 4┊    ngf-change="partyUpload.addImages($files)"
+┊  ┊ 5┊    ngf-drag-over-class="{accept:'dragover', reject:'dragover-err', delay:100}"
+┊  ┊ 6┊    class="drop-box"
+┊  ┊ 7┊    ngf-multiple="false"
+┊  ┊ 8┊    ngf-allow-dir="false"
+┊  ┊ 9┊    ngf-accept="'image/*'"
+┊  ┊10┊    ngf-drop-available="true"
+┊  ┊11┊    ng-hide="partyUpload.cropImgSrc">
+┊  ┊12┊    <div>Click here to select image</div>
+┊  ┊13┊    <div>
+┊  ┊14┊      <strong>OR</strong>
+┊  ┊15┊    </div>
+┊  ┊16┊    <div>You can also drop image to here</div>
 ┊ 8┊17┊  </div>
 ┊ 9┊18┊</div>
```
[}]: #

Now let's make it better looking:

[{]: <helper> (diff_step 20.16)
#### Step 20.16: Add style

##### Added imports/ui/components/partyUpload/partyUpload.less
```diff
@@ -0,0 +1,16 @@
+┊  ┊ 1┊party-upload {
+┊  ┊ 2┊  .drop-box {
+┊  ┊ 3┊    background: #F8F8F8;
+┊  ┊ 4┊    border: 5px dashed #DDD;
+┊  ┊ 5┊    text-align: center;
+┊  ┊ 6┊    padding: 25px;
+┊  ┊ 7┊    margin-left: 10px;
+┊  ┊ 8┊    margin-bottom: 20px;
+┊  ┊ 9┊  }
+┊  ┊10┊  .drop-box.dragover {
+┊  ┊11┊    border: 5px dashed blue;
+┊  ┊12┊  }
+┊  ┊13┊  .drop-box.dragover-err {
+┊  ┊14┊    border: 5px dashed red;
+┊  ┊15┊  }
+┊  ┊16┊}
```
[}]: #

then import new .less file in the `PartyAdd`

[{]: <helper> (diff_step 20.17)
#### Step 20.17: Import in PartyAdd

##### Added imports/ui/components/partyAdd/partyAdd.less
```diff
@@ -0,0 +1 @@
+┊ ┊1┊@import "../partyUpload/partyUpload.less";
```
[}]: #

and in the `PartyAddButton`:

[{]: <helper> (diff_step 20.18)
#### Step 20.18: Import in PartyAddButton

##### Changed imports/ui/components/partyAddButton/partyAddButton.less
```diff
@@ -3,3 +3,4 @@
 ┊3┊3┊  right: 15px;
 ┊4┊4┊  bottom: 15px;
 ┊5┊5┊}
+┊ ┊6┊@import "../partyAdd/partyAdd.less";
```
[}]: #

And that's it! now we can upload images by using drag and drop!
Just note that the Application UI still don't show the new images we upload... we will add this later.
Now let's add some more cool features, And make the uploaded image visible!

### Image Crop

One of the most common actions we want to make with pictures is to edit them before saving.
We will add to our example ability to crop images before uploading them to the server, using [ngImgCrop](https://github.com/alexk111/ngImgCrop/) package.
So lets start by adding the package to our project:

    $ meteor npm install ng-img-crop --save

And add a dependency in our module:

[{]: <helper> (diff_step 20.20)
#### Step 20.20: Add ngImgCrop

##### Changed imports/ui/components/partyUpload/partyUpload.js
```diff
@@ -1,6 +1,9 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊import ngFileUpload from 'ng-file-upload';
+┊ ┊4┊import 'ng-img-crop/compile/minified/ng-img-crop';
+┊ ┊5┊import 'ng-img-crop/compile/minified/ng-img-crop.css';
+┊ ┊6┊
 ┊4┊7┊
 ┊5┊8┊import { Meteor } from 'meteor/meteor';
 ┊6┊9┊
```
```diff
@@ -36,7 +39,8 @@
 ┊36┊39┊// create a module
 ┊37┊40┊export default angular.module(name, [
 ┊38┊41┊  angularMeteor,
-┊39┊  ┊  ngFileUpload
+┊  ┊42┊  ngFileUpload,
+┊  ┊43┊  'ngImgCrop'
 ┊40┊44┊]).component(name, {
 ┊41┊45┊  template,
 ┊42┊46┊  controllerAs: name,
```
[}]: #

We want to perform the crop on the client, before uploading it, so let's get the uploaded image, and instead of saving it to the server - we will get the Data Url of it, and use it in the `ngImgCrop`:

[{]: <helper> (diff_step 20.15)
#### Step 20.15: Handle file selection

##### Changed imports/ui/components/partyUpload/partyUpload.js
```diff
@@ -6,7 +6,30 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import template from './partyUpload.html';
 ┊ 8┊ 8┊
-┊ 9┊  ┊class PartyUpload {}
+┊  ┊ 9┊class PartyUpload {
+┊  ┊10┊  constructor($scope, $reactive) {
+┊  ┊11┊    'ngInject';
+┊  ┊12┊
+┊  ┊13┊    $reactive(this).attach($scope);
+┊  ┊14┊  }
+┊  ┊15┊
+┊  ┊16┊  addImages(files) {
+┊  ┊17┊    if (files.length) {
+┊  ┊18┊      this.currentFile = files[0];
+┊  ┊19┊
+┊  ┊20┊      const reader = new FileReader;
+┊  ┊21┊
+┊  ┊22┊      reader.onload = this.$bindToContext((e) => {
+┊  ┊23┊        this.cropImgSrc = e.target.result;
+┊  ┊24┊        this.myCroppedImage = '';
+┊  ┊25┊      });
+┊  ┊26┊
+┊  ┊27┊      reader.readAsDataURL(files[0]);
+┊  ┊28┊    } else {
+┊  ┊29┊      this.cropImgSrc = undefined;
+┊  ┊30┊    }
+┊  ┊31┊  }
+┊  ┊32┊}
 ┊10┊33┊
 ┊11┊34┊const name = 'partyUpload';
```
[}]: #

We took the file object and used HTML5 `FileReader` API to read the file from the user on the client side, without uploading it to the server.
Then we saved the DataURL of the image into a variable `cropImgSrc`.
Next, we will need to use this DataURI with the `ngImgCrop` directive as follow:

[{]: <helper> (diff_step 20.21)
#### Step 20.21: Use ngImgCrop

##### Changed imports/ui/components/partyUpload/partyUpload.html
```diff
@@ -15,4 +15,18 @@
 ┊15┊15┊    </div>
 ┊16┊16┊    <div>You can also drop image to here</div>
 ┊17┊17┊  </div>
+┊  ┊18┊  <div ng-show="partyUpload.cropImgSrc" layout="column" class="ng-crop">
+┊  ┊19┊    <div>
+┊  ┊20┊      <h3>Edit &amp; crop</h3>
+┊  ┊21┊      <md-button ng-click="partyUpload.save()" class="md-primary">
+┊  ┊22┊        Save Image
+┊  ┊23┊      </md-button>
+┊  ┊24┊      <md-button ng-click="partyUpload.reset()">
+┊  ┊25┊        Cancel
+┊  ┊26┊      </md-button>
+┊  ┊27┊    </div>
+┊  ┊28┊    <div class="ng-crop-container">
+┊  ┊29┊      <img-crop image="partyUpload.cropImgSrc" result-image="partyUpload.myCroppedImage" area-type="square"></img-crop>
+┊  ┊30┊    </div>
+┊  ┊31┊  </div>
 ┊18┊32┊</div>
```
[}]: #

> Moreover we add `ng-hide` to the upload control, in order to hide it, after the user picks an image to crop.

And add some CSS to make it look better:

[{]: <helper> (diff_step 20.22)
#### Step 20.22: Add styles

##### Changed imports/ui/components/partyUpload/partyUpload.less
```diff
@@ -13,4 +13,13 @@
 ┊13┊13┊  .drop-box.dragover-err {
 ┊14┊14┊    border: 5px dashed red;
 ┊15┊15┊  }
+┊  ┊16┊  .ng-crop {
+┊  ┊17┊    h3 {
+┊  ┊18┊      margin-top: 0;
+┊  ┊19┊    }
+┊  ┊20┊  }
+┊  ┊21┊  .ng-crop-container {
+┊  ┊22┊    width: 400px;
+┊  ┊23┊    height: 225px;
+┊  ┊24┊  }
 ┊16┊25┊}
```
[}]: #


Now we need to handle uploading files.

Since we're using `DataURL` and we need UploadFS expects `ArrayBuffer` let's add few helper methods.

Add `dataURLToBlob` to converts DataURL to `Blob` object:

[{]: <helper> (diff_step 20.23)
#### Step 20.23: Add dataURLToBlob helper

##### Added imports/api/images/helpers.js
```diff
@@ -0,0 +1,31 @@
+┊  ┊ 1┊/**
+┊  ┊ 2┊ * Converts DataURL to Blob object
+┊  ┊ 3┊ *
+┊  ┊ 4┊ * https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
+┊  ┊ 5┊ *
+┊  ┊ 6┊ * @param  {String} dataURL
+┊  ┊ 7┊ * @return {Blob}
+┊  ┊ 8┊ */
+┊  ┊ 9┊export function dataURLToBlob(dataURL) {
+┊  ┊10┊    const BASE64_MARKER = ';base64,';
+┊  ┊11┊
+┊  ┊12┊    if (dataURL.indexOf(BASE64_MARKER) === -1) {
+┊  ┊13┊      const parts = dataURL.split(',');
+┊  ┊14┊      const contentType = parts[0].split(':')[1];
+┊  ┊15┊      const raw = decodeURIComponent(parts[1]);
+┊  ┊16┊
+┊  ┊17┊      return new Blob([raw], {type: contentType});
+┊  ┊18┊    }
+┊  ┊19┊
+┊  ┊20┊    const parts = dataURL.split(BASE64_MARKER);
+┊  ┊21┊    const contentType = parts[0].split(':')[1];
+┊  ┊22┊    const raw = window.atob(parts[1]);
+┊  ┊23┊    const rawLength = raw.length;
+┊  ┊24┊    const uInt8Array = new Uint8Array(rawLength);
+┊  ┊25┊
+┊  ┊26┊    for (let i = 0; i < rawLength; ++i) {
+┊  ┊27┊      uInt8Array[i] = raw.charCodeAt(i);
+┊  ┊28┊    }
+┊  ┊29┊
+┊  ┊30┊    return new Blob([uInt8Array], {type: contentType});
+┊  ┊31┊}
```
[}]: #

We have now Blob object so let's convert it to expected `ArrayBuffer` by creating a function called `blobToArrayBuffer`:

[{]: <helper> (diff_step 20.24)
#### Step 20.24: Add blobToArrayBuffer helper

##### Changed imports/api/images/helpers.js
```diff
@@ -29,3 +29,26 @@
 ┊29┊29┊
 ┊30┊30┊    return new Blob([uInt8Array], {type: contentType});
 ┊31┊31┊}
+┊  ┊32┊
+┊  ┊33┊/**
+┊  ┊34┊ * Converts Blob object to ArrayBuffer
+┊  ┊35┊ *
+┊  ┊36┊ * @param  {Blob}       blob          Source file
+┊  ┊37┊ * @param  {Function}   callback      Success callback with converted object as a first argument
+┊  ┊38┊ * @param  {Function}   errorCallback Error callback with error as a first argument
+┊  ┊39┊ */
+┊  ┊40┊export function blobToArrayBuffer(blob, callback, errorCallback) {
+┊  ┊41┊  const reader = new FileReader();
+┊  ┊42┊
+┊  ┊43┊  reader.onload = (e) => {
+┊  ┊44┊    callback(e.target.result);
+┊  ┊45┊  };
+┊  ┊46┊
+┊  ┊47┊  reader.onerror = (e) => {
+┊  ┊48┊    if (errorCallback) {
+┊  ┊49┊      errorCallback(e);
+┊  ┊50┊    }
+┊  ┊51┊  };
+┊  ┊52┊
+┊  ┊53┊  reader.readAsArrayBuffer(blob);
+┊  ┊54┊}
```
[}]: #

Now we can take care of uploading by creating a `upload` function:

[{]: <helper> (diff_step 20.25)
#### Step 20.25: Create `upload` method

##### Added imports/api/images/methods.js
```diff
@@ -0,0 +1,33 @@
+┊  ┊ 1┊import { UploadFS } from 'meteor/jalik:ufs';
+┊  ┊ 2┊import { ImagesStore } from './store';
+┊  ┊ 3┊import { dataURLToBlob, blobToArrayBuffer } from './helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊/**
+┊  ┊ 6┊ * Uploads a new file
+┊  ┊ 7┊ *
+┊  ┊ 8┊ * @param  {String}   dataUrl [description]
+┊  ┊ 9┊ * @param  {String}   name    [description]
+┊  ┊10┊ * @param  {Function} resolve [description]
+┊  ┊11┊ * @param  {Function} reject  [description]
+┊  ┊12┊ */
+┊  ┊13┊export function upload(dataUrl, name, resolve, reject) {
+┊  ┊14┊  // convert to Blob
+┊  ┊15┊  const blob = dataURLToBlob(dataUrl);
+┊  ┊16┊  blob.name = name;
+┊  ┊17┊
+┊  ┊18┊  // pick from an object only: name, type and size
+┊  ┊19┊  const file = _.pick(blob, 'name', 'type', 'size');
+┊  ┊20┊
+┊  ┊21┊  // convert to ArrayBuffer
+┊  ┊22┊  blobToArrayBuffer(blob, (data) => {
+┊  ┊23┊    const upload = new UploadFS.Uploader({
+┊  ┊24┊      data,
+┊  ┊25┊      file,
+┊  ┊26┊      store: ImagesStore,
+┊  ┊27┊      onError: reject,
+┊  ┊28┊      onComplete: resolve
+┊  ┊29┊    });
+┊  ┊30┊
+┊  ┊31┊    upload.start();
+┊  ┊32┊  }, reject);
+┊  ┊33┊}
```
[}]: #

* `dataUrl` is the file we want to upload
* `name` is a name of the file
* `resolve` is a callback function that will be invoked on success
* `reject` is a callback function that will be invoked on error
* We took `name`, `type` and `size` from Blob object to send these information to `UploadFS.Uploader`

What's left is just to export this method:

[{]: <helper> (diff_step 20.26)
#### Step 20.26: Export methods

##### Changed imports/api/images/index.js
```diff
@@ -1,2 +1,3 @@
 ┊1┊1┊export * from './collection';
 ┊2┊2┊export * from './store';
+┊ ┊3┊export * from './methods';
```
[}]: #

We previously defined two methods: `save()` and `reset()`. Let's implement them using recently created `upload` function:

[{]: <helper> (diff_step 20.27)
#### Step 20.27: Implement `save` and `reset` methods

##### Changed imports/ui/components/partyUpload/partyUpload.js
```diff
@@ -8,12 +8,15 @@
 ┊ 8┊ 8┊import { Meteor } from 'meteor/meteor';
 ┊ 9┊ 9┊
 ┊10┊10┊import template from './partyUpload.html';
+┊  ┊11┊import { upload } from '../../../api/images';
 ┊11┊12┊
 ┊12┊13┊class PartyUpload {
 ┊13┊14┊  constructor($scope, $reactive) {
 ┊14┊15┊    'ngInject';
 ┊15┊16┊
 ┊16┊17┊    $reactive(this).attach($scope);
+┊  ┊18┊
+┊  ┊19┊    this.uploaded = [];
 ┊17┊20┊  }
 ┊18┊21┊
 ┊19┊22┊  addImages(files) {
```
```diff
@@ -32,6 +35,20 @@
 ┊32┊35┊      this.cropImgSrc = undefined;
 ┊33┊36┊    }
 ┊34┊37┊  }
+┊  ┊38┊
+┊  ┊39┊  save() {
+┊  ┊40┊    upload(this.myCroppedImage, this.currentFile.name, this.$bindToContext((file) => {
+┊  ┊41┊      this.uploaded.push(file);
+┊  ┊42┊      this.reset();
+┊  ┊43┊    }), (e) => {
+┊  ┊44┊      console.log('Oops, something went wrong', e);
+┊  ┊45┊    });
+┊  ┊46┊  }
+┊  ┊47┊
+┊  ┊48┊  reset() {
+┊  ┊49┊    this.cropImgSrc = undefined;
+┊  ┊50┊    this.myCroppedImage = '';
+┊  ┊51┊  }
 ┊35┊52┊}
 ┊36┊53┊
 ┊37┊54┊const name = 'partyUpload';
```
[}]: #

Let's explain the code.

* The cropped image is under `myCroppedImage` variable so we used it to as the file to be uploaded.
* We used `currentFile.name` to get name of the file.
* We used `$bindToContext` on the first callback (`resolve`) to keep it inside digest cycle.
* We used `console.log` to notify about an error.
* We created `reset()`` to clear these variables.

Last thing to do is to import Images and Thumb on the server-side:

[{]: <helper> (diff_step 20.28)
#### Step 20.28: Import Images on server side

##### Changed server/main.js
```diff
@@ -1,3 +1,4 @@
 ┊1┊1┊import '../imports/startup/fixtures';
 ┊2┊2┊import '../imports/api/parties';
 ┊3┊3┊import '../imports/api/users';
+┊ ┊4┊import '../imports/api/images';
```
[}]: #

### Display Uploaded Images

Let's create a simple gallery to list the images in the new party form:

[{]: <helper> (diff_step 20.29)
#### Step 20.29: Display uploaded images

##### Changed imports/ui/components/partyUpload/partyUpload.html
```diff
@@ -29,4 +29,9 @@
 ┊29┊29┊      <img-crop image="partyUpload.cropImgSrc" result-image="partyUpload.myCroppedImage" area-type="square"></img-crop>
 ┊30┊30┊    </div>
 ┊31┊31┊  </div>
+┊  ┊32┊  <div layout="row" class="images-container-title">
+┊  ┊33┊    <div class="party-image-container" ng-class="{'main-image': $index === 0}" ng-repeat="thumb in partyUpload.thumbs">
+┊  ┊34┊      <img ng-src="{{ thumb.url }}"/>
+┊  ┊35┊    </div>
+┊  ┊36┊  </div>
 ┊32┊37┊</div>
```
[}]: #

[{]: <helper> (diff_step 20.30)
#### Step 20.30: Add styles

##### Changed imports/ui/components/partyUpload/partyUpload.less
```diff
@@ -22,4 +22,20 @@
 ┊22┊22┊    width: 400px;
 ┊23┊23┊    height: 225px;
 ┊24┊24┊  }
+┊  ┊25┊  .images-container-title {
+┊  ┊26┊    padding-bottom: 30px;
+┊  ┊27┊  }
+┊  ┊28┊  .party-image-container {
+┊  ┊29┊    position: relative;
+┊  ┊30┊    margin-right: 10px;
+┊  ┊31┊    max-height: 200px;
+┊  ┊32┊    max-width: 200px;
+┊  ┊33┊    img {
+┊  ┊34┊      max-height: 100%;
+┊  ┊35┊      max-width: 100%;
+┊  ┊36┊    }
+┊  ┊37┊  }
+┊  ┊38┊  .main-image {
+┊  ┊39┊    border: 2px solid #ddd;
+┊  ┊40┊  }
 ┊25┊41┊}
```
[}]: #

We have to somehow get thumbnails to show them in this gallery.

Since we keep them in Collections, we have to create proper publications:

[{]: <helper> (diff_step 20.31)
#### Step 20.31: Add `thumbs` and `images` publications

##### Added imports/api/images/publish.js
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Thumbs, Images } from './collection';
+┊  ┊ 3┊
+┊  ┊ 4┊if (Meteor.isServer) {
+┊  ┊ 5┊  Meteor.publish('thumbs', function(ids) {
+┊  ┊ 6┊    return Thumbs.find({
+┊  ┊ 7┊      originalStore: 'images',
+┊  ┊ 8┊      originalId: {
+┊  ┊ 9┊        $in: ids
+┊  ┊10┊      }
+┊  ┊11┊    });
+┊  ┊12┊  });
+┊  ┊13┊
+┊  ┊14┊  Meteor.publish('images', function() {
+┊  ┊15┊    return Images.find({});
+┊  ┊16┊  });
+┊  ┊17┊}
```
[}]: #

[{]: <helper> (diff_step 20.32)
#### Step 20.32: Import publications

##### Changed imports/api/images/index.js
```diff
@@ -1,3 +1,4 @@
+┊ ┊1┊import './publish';
 ┊1┊2┊export * from './collection';
 ┊2┊3┊export * from './store';
 ┊3┊4┊export * from './methods';
```
[}]: #

Now we can implement thumbnails:

[{]: <helper> (diff_step 20.33)
#### Step 20.33: Implement thumbnails

##### Changed imports/ui/components/partyUpload/partyUpload.js
```diff
@@ -8,7 +8,7 @@
 ┊ 8┊ 8┊import { Meteor } from 'meteor/meteor';
 ┊ 9┊ 9┊
 ┊10┊10┊import template from './partyUpload.html';
-┊11┊  ┊import { upload } from '../../../api/images';
+┊  ┊11┊import { Thumbs, upload } from '../../../api/images';
 ┊12┊12┊
 ┊13┊13┊class PartyUpload {
 ┊14┊14┊  constructor($scope, $reactive) {
```
```diff
@@ -17,6 +17,21 @@
 ┊17┊17┊    $reactive(this).attach($scope);
 ┊18┊18┊
 ┊19┊19┊    this.uploaded = [];
+┊  ┊20┊
+┊  ┊21┊    this.subscribe('thumbs', () => [
+┊  ┊22┊      this.getReactively('files', true) || []
+┊  ┊23┊    ]);
+┊  ┊24┊
+┊  ┊25┊    this.helpers({
+┊  ┊26┊      thumbs() {
+┊  ┊27┊        return Thumbs.find({
+┊  ┊28┊          originalStore: 'images',
+┊  ┊29┊          originalId: {
+┊  ┊30┊            $in: this.getReactively('files', true) || []
+┊  ┊31┊          }
+┊  ┊32┊        });
+┊  ┊33┊      }
+┊  ┊34┊    });
 ┊20┊35┊  }
 ┊21┊36┊
 ┊22┊37┊  addImages(files) {
```
```diff
@@ -39,6 +54,12 @@
 ┊39┊54┊  save() {
 ┊40┊55┊    upload(this.myCroppedImage, this.currentFile.name, this.$bindToContext((file) => {
 ┊41┊56┊      this.uploaded.push(file);
+┊  ┊57┊
+┊  ┊58┊      if (!this.files || !this.files.length) {
+┊  ┊59┊        this.files = [];
+┊  ┊60┊      }
+┊  ┊61┊      this.files.push(file._id);
+┊  ┊62┊
 ┊42┊63┊      this.reset();
 ┊43┊64┊    }), (e) => {
 ┊44┊65┊      console.log('Oops, something went wrong', e);
```
[}]: #

There are few things that need to be explained:

* We subscribed to `thumbs` publication with one argument.
* We created the `thumbs` helper that fetches all thumbnails of our saved files.
* Mentioned before `files` variable. It contains identifiers of uploaded files.

### Sort Images

We can also add an ability to sort and update the images order.
To get the ability to sort the images, let's use [angular-sortable-view](https://github.com/kamilkp/angular-sortable-view).

    $ meteor npm install angular-sortable-view --save

Let's add it as a dependency:

[{]: <helper> (diff_step 20.35)
#### Step 20.35: Add as a dependency

##### Changed imports/ui/components/partyUpload/partyUpload.js
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊import ngFileUpload from 'ng-file-upload';
+┊ ┊4┊import 'angular-sortable-view';
 ┊4┊5┊import 'ng-img-crop/compile/minified/ng-img-crop';
 ┊5┊6┊import 'ng-img-crop/compile/minified/ng-img-crop.css';
 ┊6┊7┊
```
```diff
@@ -78,7 +79,8 @@
 ┊78┊79┊export default angular.module(name, [
 ┊79┊80┊  angularMeteor,
 ┊80┊81┊  ngFileUpload,
-┊81┊  ┊  'ngImgCrop'
+┊  ┊82┊  'ngImgCrop',
+┊  ┊83┊  'angular-sortable-view'
 ┊82┊84┊]).component(name, {
 ┊83┊85┊  template,
 ┊84┊86┊  controllerAs: name,
```
[}]: #

Implement directives of angular-sortable-view:

[{]: <helper> (diff_step 20.36)
#### Step 20.36: Use directives on thumbnails

##### Changed imports/ui/components/partyUpload/partyUpload.html
```diff
@@ -29,9 +29,9 @@
 ┊29┊29┊      <img-crop image="partyUpload.cropImgSrc" result-image="partyUpload.myCroppedImage" area-type="square"></img-crop>
 ┊30┊30┊    </div>
 ┊31┊31┊  </div>
-┊32┊  ┊  <div layout="row" class="images-container-title">
-┊33┊  ┊    <div class="party-image-container" ng-class="{'main-image': $index === 0}" ng-repeat="thumb in partyUpload.thumbs">
-┊34┊  ┊      <img ng-src="{{ thumb.url }}"/>
+┊  ┊32┊  <div layout="row" class="images-container-title" sv-root sv-part="partyUpload.thumbs">
+┊  ┊33┊    <div sv-element class="party-image-container" ng-class="{'main-image': $index === 0}" ng-repeat="thumb in partyUpload.thumbs">
+┊  ┊34┊      <img draggable="false" ng-src="{{ thumb.url }}"/>
 ┊35┊35┊    </div>
 ┊36┊36┊  </div>
 ┊37┊37┊</div>
```
[}]: #

You can now easily change their order.

> Remember! First file is the main file which will be shown on parties list. We will implement it later.


Since we have sorting, croping and uploading. We can now add binding we prepared previously:


[{]: <helper> (diff_step 20.37)
#### Step 20.37: Define two-way data binding `files`

##### Changed imports/ui/components/partyUpload/partyUpload.js
```diff
@@ -83,6 +83,9 @@
 ┊83┊83┊  'angular-sortable-view'
 ┊84┊84┊]).component(name, {
 ┊85┊85┊  template,
+┊  ┊86┊  bindings: {
+┊  ┊87┊    files: '=?'
+┊  ┊88┊  },
 ┊86┊89┊  controllerAs: name,
 ┊87┊90┊  controller: PartyUpload
 ┊88┊91┊});
```
[}]: #
### Display party image on the list

As always, we have to create component, let's call it `PartyImage`.

[{]: <helper> (diff_step 20.38)
#### Step 20.38: Create view for PartyImage

##### Added imports/ui/components/partyImage/partyImage.html
```diff
@@ -0,0 +1 @@
+┊ ┊1┊<img ng-src="{{partyImage.mainImage.url}}"/>
```
[}]: #

[{]: <helper> (diff_step 20.39)
#### Step 20.39: Create PartyImage component

##### Added imports/ui/components/partyImage/partyImage.js
```diff
@@ -0,0 +1,37 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import template from './partyImage.html';
+┊  ┊ 5┊import { Images } from '../../../api/images';
+┊  ┊ 6┊
+┊  ┊ 7┊class PartyImage {
+┊  ┊ 8┊  constructor($scope, $reactive) {
+┊  ┊ 9┊    'ngInject';
+┊  ┊10┊    $reactive(this).attach($scope);
+┊  ┊11┊
+┊  ┊12┊    this.helpers({
+┊  ┊13┊      mainImage() {
+┊  ┊14┊        const images = this.getReactively('images', true);
+┊  ┊15┊        if (images) {
+┊  ┊16┊          return Images.findOne({
+┊  ┊17┊            _id: images[0]
+┊  ┊18┊          });
+┊  ┊19┊        }
+┊  ┊20┊      }
+┊  ┊21┊    });
+┊  ┊22┊  }
+┊  ┊23┊}
+┊  ┊24┊
+┊  ┊25┊const name = 'partyImage';
+┊  ┊26┊
+┊  ┊27┊// create a module
+┊  ┊28┊export default angular.module(name, [
+┊  ┊29┊  angularMeteor
+┊  ┊30┊]).component(name, {
+┊  ┊31┊  template,
+┊  ┊32┊  bindings: {
+┊  ┊33┊    images: '<'
+┊  ┊34┊  },
+┊  ┊35┊  controllerAs: name,
+┊  ┊36┊  controller: PartyImage
+┊  ┊37┊});
```
[}]: #

As you can see we defined `images` which is a one-way binding that tells to the PartyImage component which images have been uploaded to the party.

> Objects of `Images` and `Thumbs` collections contains `.url` property with absolute url to the file.

Now let's implement it to the `PartiesList` by adding dependency and what is more important, by subscribing `images`. Subscription is needed to fetch defined images.

[{]: <helper> (diff_step 20.40)
#### Step 20.40: Implement PartyImage in PartiesList

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -25,6 +25,11 @@
 ┊25┊25┊            </span>
 ┊26┊26┊            <span class="md-subhead">{{party.description}}</span>
 ┊27┊27┊          </md-card-title-text>
+┊  ┊28┊          <md-card-title-media ng-if="party.images">
+┊  ┊29┊            <div class="md-media-lg card-media">
+┊  ┊30┊              <party-image images="party.images"></party-image>
+┊  ┊31┊            </div>
+┊  ┊32┊          </md-card-title-media>
 ┊28┊33┊        </md-card-title>
 ┊29┊34┊        <md-card-content>
 ┊30┊35┊          <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
```
[}]: #

[{]: <helper> (diff_step 20.41)
#### Step 20.41: Add PartyImage to PartiesList and subscribe to `images`

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -14,6 +14,7 @@
 ┊14┊14┊import { name as PartyCreator } from '../partyCreator/partyCreator';
 ┊15┊15┊import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
 ┊16┊16┊import { name as PartyRsvpsList } from '../partyRsvpsList/partyRsvpsList';
+┊  ┊17┊import { name as PartyImage } from '../partyImage/partyImage';
 ┊17┊18┊
 ┊18┊19┊class PartiesList {
 ┊19┊20┊  constructor($scope, $reactive) {
```
```diff
@@ -36,6 +37,7 @@
 ┊36┊37┊    ]);
 ┊37┊38┊
 ┊38┊39┊    this.subscribe('users');
+┊  ┊40┊    this.subscribe('images');
 ┊39┊41┊
 ┊40┊42┊    this.helpers({
 ┊41┊43┊      parties() {
```
```diff
@@ -81,7 +83,8 @@
 ┊81┊83┊  PartyRemove,
 ┊82┊84┊  PartyCreator,
 ┊83┊85┊  PartyRsvp,
-┊84┊  ┊  PartyRsvpsList
+┊  ┊86┊  PartyRsvpsList,
+┊  ┊87┊  PartyImage
 ┊85┊88┊]).component(name, {
 ┊86┊89┊  template,
 ┊87┊90┊  controllerAs: name,
```
[}]: #

And that's it!


### Cloud Storage

By storing files in the cloud you can reduce your costs and get a lot of other benefits.

Since this chapter is all about uploading files and UploadFS doesn't have built-in support for cloud services we should mention another library for that.

We recommend you to use [Slingshot](https://github.com/CulturalMe/meteor-slingshot/). You can install it by running:

    $ meteor add edgee:slingshot

It's very easy to use with AWS S3, Google Cloud and other cloud storage services.

From slignshot's repository:

> meteor-slingshot uploads the files directly to the cloud service from the browser without ever exposing your secret access key or any other sensitive data to the client and without requiring public write access to cloud storage to the entire public.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step19.md) | [Next Step >](step21.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #