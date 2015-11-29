Parties = new Mongo.Collection("parties");

Parties.allow({
  insert: function (userId, party) {
    return userId && party.owner === userId;
  },
  update: function (userId, party, fields, modifier) {
    return userId && party.owner === userId;
  },
  remove: function (userId, party) {
    return userId && party.owner === userId;
  }
});

let getContactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;

  return null;
};

Meteor.methods({
  invite: function (partyId, userId) {
    check(partyId, String);
    check(userId, String);

    let party = Parties.findOne(partyId);

    if (!party)
      throw new Meteor.Error(404, "No such party!");

    if (party.owner !== this.userId)
      throw new Meteor.Error(404, "No permissions!");

    if (party.public)
      throw new Meteor.Error(400, "That party is public. No need to invite people.");

    if (userId !== party.owner && ! _.contains(party.invited, userId)) {
      Parties.update(partyId, { $addToSet: { invited: userId } });

      let from = getContactEmail(Meteor.users.findOne(this.userId));
      let to = getContactEmail(Meteor.users.findOne(userId));

      if (Meteor.isServer && to) {
        Email.send({
          from: "noreply@socially.com",
          to: to,
          replyTo: from || undefined,
          subject: "PARTY: " + party.title,
          text:
          "Hey, I just invited you to '" + party.title + "' on Socially." +
          "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  }
});