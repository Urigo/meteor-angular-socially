import angular from 'angular';

const name = 'uninvitedFilter';

function UninvitedFilter(users, party) {
  if (!party) {
    return false;
  }

  return users.filter((user) => {
    // if not the owner and not invited
    return user._id !== party.owner && (party.invited || []).indexOf(user._id) === -1;
  });
}

// create a module
export default angular.module(name, [])
  .filter(name, () => {
    return UninvitedFilter;
  });
