Parties = new Mongo.Collection("parties");

Parties.allow({
  insert: function (userId, party) {
    return userId && party.owner === userId;
  },
  update: function (userId, party, fields, modifier) {
    if (userId !== party.owner)
      return false;

    return true;
  },
  remove: function (userId, party) {
    if (userId !== party.owner)
      return false;

    return true;
  }
});