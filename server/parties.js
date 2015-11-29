Meteor.publish("parties", function (options, searchString) {
  let selector = {
    $or: [
      {
        $and: [
          {'public': true},
          {'public': {$exists: true}}
        ]
      },
      {
        $and: [
          {owner: this.userId},
          {owner: {$exists: true}}
        ]
      }
    ]
  };

  Counts.publish(this, 'numberOfParties', Parties.find(selector), {noReady: true});
  return Parties.find(selector, options);
});