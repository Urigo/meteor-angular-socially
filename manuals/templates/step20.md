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

{{{diff_step 20.3}}}

We have to create Stores for Images and Thumbs.

{{{diff_step 20.4}}}

Let's explain a bit what happened.

* We assigned Stores to their Collections, which is required.
* We defined names of these Stores.
* We added filter to ImagesStore so it can receive only images.
* Every file will be copied to ThumbsStore.


Now we can create `index.js` file to export Collections and Stores:

{{{diff_step 20.5}}}

There is a reason why we called one of the Collections the `Thumbs`!

Since we transfer every uploaded file to ThumbsStore, we can now easily add file manipulations.

Let's resize every file to 32x32:

{{{diff_step 20.6}}}

We used [`gm`](https://github.com/aheckmann/gm) module, let's install it:

    $ meteor npm install gm --save

> Be aware that this module requires at least one of these libraries: [GraphicsMagick](http://www.graphicsmagick.org/), [ImageMagick](http://www.imagemagick.org/).

### Image upload

Now, let's create the `PartyUpload` component. It will be responsible for cropping and uploading photos.

{{{diff_step 20.8}}}

{{{diff_step 20.9}}}

We want to use it in `PartyAdd`:

{{{diff_step 20.10}}}

{{{diff_step 20.11}}}

As you can see we used `files` directive. We will create it later. For now, let's only say that this is a two-way data binding.


Note that for file upload you can use basic HTML `<input type="file">` or any other package - you only need the HTML5 File object to be provided.

For our application, we would like to add ability to drag-and-drop images, so we use AngularJS directive that handles file upload and gives us more abilities such as drag & drop, file validation on the client side. In this example, We will use [`ng-file-upload`](https://github.com/danialfarid/ng-file-upload), which have many features for file upload. In order to do this, let's add the package to our project:

    $ meteor npm install ng-file-upload --save

Now, lets add a dependency in the `PartyUpload`:

{{{diff_step 20.13}}}

Now, let's add the usage of `ng-file-upload`:

{{{diff_step 20.14}}}

Now let's make it better looking:

{{{diff_step 20.16}}}

then import new .less file in the `PartyAdd`

{{{diff_step 20.17}}}

and in the `PartyAddButton`:

{{{diff_step 20.18}}}

And that's it! now we can upload images by using drag and drop!
Just note that the Application UI still don't show the new images we upload... we will add this later.
Now let's add some more cool features, And make the uploaded image visible!

### Image Crop

One of the most common actions we want to make with pictures is to edit them before saving.
We will add to our example ability to crop images before uploading them to the server, using [ngImgCrop](https://github.com/alexk111/ngImgCrop/) package.
So lets start by adding the package to our project:

    $ meteor npm install ng-img-crop --save

And add a dependency in our module:

{{{diff_step 20.20}}}

We want to perform the crop on the client, before uploading it, so let's get the uploaded image, and instead of saving it to the server - we will get the Data Url of it, and use it in the `ngImgCrop`:

{{{diff_step 20.15}}}

We took the file object and used HTML5 `FileReader` API to read the file from the user on the client side, without uploading it to the server.
Then we saved the DataURL of the image into a variable `cropImgSrc`.
Next, we will need to use this DataURI with the `ngImgCrop` directive as follow:

{{{diff_step 20.21}}}

> Moreover we add `ng-hide` to the upload control, in order to hide it, after the user picks an image to crop.

And add some CSS to make it look better:

{{{diff_step 20.22}}}


Now we need to handle uploading files.

Since we're using `DataURL` and we need UploadFS expects `ArrayBuffer` let's add few helper methods.

Add `dataURLToBlob` to converts DataURL to `Blob` object:

{{{diff_step 20.23}}}

We have now Blob object so let's convert it to expected `ArrayBuffer` by creating a function called `blobToArrayBuffer`:

{{{diff_step 20.24}}}

Now we can take care of uploading by creating a `upload` function:

{{{diff_step 20.25}}}

* `dataUrl` is the file we want to upload
* `name` is a name of the file
* `resolve` is a callback function that will be invoked on success
* `reject` is a callback function that will be invoked on error
* We took `name`, `type` and `size` from Blob object to send these information to `UploadFS.Uploader`

What's left is just to export this method:

{{{diff_step 20.26}}}

We previously defined two methods: `save()` and `reset()`. Let's implement them using recently created `upload` function:

{{{diff_step 20.27}}}

Let's explain the code.

* The cropped image is under `myCroppedImage` variable so we used it to as the file to be uploaded.
* We used `currentFile.name` to get name of the file.
* We used `$bindToContext` on the first callback (`resolve`) to keep it inside digest cycle.
* We used `console.log` to notify about an error.
* We created `reset()`` to clear these variables.

Last thing to do is to import Images and Thumb on the server-side:

{{{diff_step 20.28}}}

### Display Uploaded Images

Let's create a simple gallery to list the images in the new party form:

{{{diff_step 20.29}}}

{{{diff_step 20.30}}}

We have to somehow get thumbnails to show them in this gallery.

Since we keep them in Collections, we have to create proper publications:

{{{diff_step 20.31}}}

{{{diff_step 20.32}}}

Now we can implement thumbnails:

{{{diff_step 20.33}}}

There are few things that need to be explained:

* We subscribed to `thumbs` publication with one argument.
* We created the `thumbs` helper that fetches all thumbnails of our saved files.
* Mentioned before `files` variable. It contains identifiers of uploaded files.

### Sort Images

We can also add an ability to sort and update the images order.
To get the ability to sort the images, let's use [angular-sortable-view](https://github.com/kamilkp/angular-sortable-view).

    $ meteor npm install angular-sortable-view --save

Let's add it as a dependency:

{{{diff_step 20.35}}}

Implement directives of angular-sortable-view:

{{{diff_step 20.36}}}

You can now easily change their order.

> Remember! First file is the main file which will be shown on parties list. We will implement it later.


Since we have sorting, croping and uploading. We can now add binding we prepared previously:


{{{diff_step 20.37}}}
### Display party image on the list

As always, we have to create component, let's call it `PartyImage`.

{{{diff_step 20.38}}}

{{{diff_step 20.39}}}

As you can see we defined `images` which is a one-way binding that tells to the PartyImage component which images have been uploaded to the party.

> Objects of `Images` and `Thumbs` collections contains `.url` property with absolute url to the file.

Now let's implement it to the `PartiesList` by adding dependency and what is more important, by subscribing `images`. Subscription is needed to fetch defined images.

{{{diff_step 20.40}}}

{{{diff_step 20.41}}}

And that's it!


### Cloud Storage

By storing files in the cloud you can reduce your costs and get a lot of other benefits.

Since this chapter is all about uploading files and UploadFS doesn't have built-in support for cloud services we should mention another library for that.

We recommend you to use [Slingshot](https://github.com/CulturalMe/meteor-slingshot/). You can install it by running:

    $ meteor add edgee:slingshot

It's very easy to use with AWS S3, Google Cloud and other cloud storage services.

From slignshot's repository:

> meteor-slingshot uploads the files directly to the cloud service from the browser without ever exposing your secret access key or any other sensitive data to the client and without requiring public write access to cloud storage to the entire public.
