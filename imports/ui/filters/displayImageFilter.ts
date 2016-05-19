import * as angular from 'angular';

import { Meteor } from 'meteor/meteor';

const name = 'displayImageFilter';

function DisplayImageFilter(image) {
  if (!image) {
    return image;
  }

  // leave it as it is for the web view
  if (!Meteor.isCordova) {
    return image.url;
  }

  // create new path of an image
  const path = `ufs/${image.store}/${image._id}/${image.name}`;
  return Meteor.absoluteUrl(path);
}

// create a module
export default angular.module(name, [])
  .filter(name, () => {
    return DisplayImageFilter;
  });
