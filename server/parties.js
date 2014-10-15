Meteor.publish("parties", function (options) {
  Counts.publish(this, 'numberOfParties', Parties.find({
    $or:[
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]},
      {$and:[
        {owner: this.userId},
        {owner: {$exists: true}}
      ]},
      {$and:[
        {invited: this.userId},
        {invited: {$exists: true}}
      ]}
    ]}));

  return Parties.find({
      $or:[
        {$and:[
          {"public": true},
          {"public": {$exists: true}}
        ]},
        {$and:[
          {owner: this.userId},
          {owner: {$exists: true}}
        ]},
        {$and:[
          {invited: this.userId},
          {invited: {$exists: true}}
        ]}
      ]}, options);
});