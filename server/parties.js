Meteor.publish("parties", function (options, searchString) {
  Counts.publish(this, 'numberOfParties', Parties.find({
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
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
      'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
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