import { Pipe } from '@angular/core';

const name = 'displayName';

@Pipe({
  name
})
export class DisplayNamePipe {
  transform(user) {
    if (!user) {
      return '';
    }

    if (user.profile && user.profile.name) {
      return user.profile.name;
    }

    if (user.emails) {
      return user.emails[0].address;
    }

    return user;
  }
}
