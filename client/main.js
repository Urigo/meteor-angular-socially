import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Parties } from '../collections/parties';

import { name as PartiesList } from '../imports/ui/components/partiesList/partiesList';

angular.module('socially', [
    angularMeteor,
    PartiesList
  ]);
