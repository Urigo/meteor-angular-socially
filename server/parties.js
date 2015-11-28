Meteor.publish("parties", function (options) {
  return Parties.find({
    $or: [
      {
        $and: [
          {"public": true},
          {"public": {$exists: true}}
        ]
      },
      {
        $and: [
          {owner: this.userId},
          {owner: {$exists: true}}
        ]
      }
    ]
  }, options);
});