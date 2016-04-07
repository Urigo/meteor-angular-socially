import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import { Parties } from './collection';

function getContactEmail(user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;

  return null;
}

export function invite(partyId, userId) {
  check(partyId, String);
  check(userId, String);

  if (!this.userId) {
    throw new Meteor.Error(400, 'You have to be logged in!');
  }

  const party = Parties.findOne(partyId);

  if (!party) {
    throw new Meteor.Error(404, 'No such party!');
  }

  if (party.owner !== this.userId) {
    throw new Meteor.Error(404, 'No permissions!');
  }

  if (party.public) {
    throw new Meteor.Error(400, 'That party is public. No need to invite people.');
  }

  if (userId !== party.owner && ! _.contains(party.invited, userId)) {
    Parties.update(partyId, {
      $addToSet: {
        invited: userId
      }
    });

    const replyTo = getContactEmail(Meteor.users.findOne(this.userId));
    const to = getContactEmail(Meteor.users.findOne(userId));

    if (Meteor.isServer && to) {
      Email.send({
        to,
        replyTo,
        from: 'noreply@socially.com',
        subject: `PARTY: ${party.title}`,
        text: `
          Hey, I just invited you to ${party.title} on Socially.
          Come check it out: ${Meteor.absoluteUrl()}
        `
      });
    }
  }
}

Meteor.methods({
  invite
});
