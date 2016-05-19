import { Pipe } from '@angular/core';
import * as _ from 'underscore';

const name = 'uninvited';

@Pipe({
  name
})
export class UninvitedPipe {
  transform(users, party) {
    if (!party) {
      return [];
    }

    return users.filter((user) => {
      // if not the owner and not invited
      return user._id !== party.owner && !_.contains(party.invited, user._id);
    });
  }
}
