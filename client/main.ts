import 'angular2-meteor-polyfills/browser';
import * as angular from 'angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { UpgradeAdapter } from '@angular/upgrade';

import { Meteor } from 'meteor/meteor';

import { registerAuth } from '../imports/ui/components/auth/auth';
import { registerLogin } from '../imports/ui/components/login/login';
import { registerNavigation } from '../imports/ui/components/navigation/navigation';
import { registerPartiesList } from '../imports/ui/components/partiesList/partiesList';
import { registerPartiesMap } from '../imports/ui/components/partiesMap/partiesMap';
import { registerPartiesSort } from '../imports/ui/components/partiesSort/partiesSort';
import { registerPartyAdd } from '../imports/ui/components/partyAdd/partyAdd';
import { registerPartyAddButton } from '../imports/ui/components/partyAddButton/partyAddButton';
import { registerPartyCreator } from '../imports/ui/components/partyCreator/partyCreator';
import { registerPartyDetails, PartyDetails } from '../imports/ui/components/partyDetails/partyDetails';
import { registerPartyImage } from '../imports/ui/components/partyImage/partyImage';
import { registerPartyMap } from '../imports/ui/components/partyMap/partyMap';
import { registerPartyRemove } from '../imports/ui/components/partyRemove/partyRemove';
import { registerPartyRsvp } from '../imports/ui/components/partyRsvp/partyRsvp';
import { registerPartyRsvpsList } from '../imports/ui/components/partyRsvpsList/partyRsvpsList';
import { PartyUninvited } from '../imports/ui/components/partyUninvited/partyUninvited';
import { registerPartyUpload } from '../imports/ui/components/partyUpload/partyUpload';
import { registerPassword } from '../imports/ui/components/password/password';
import { registerRegister } from '../imports/ui/components/register/register';
import { registerSocially, SociallyNg1Module } from '../imports/ui/components/socially/socially';
import { DisplayNamePipe } from '../imports/ui/filters/displayNamePipe';
import { UninvitedPipe } from '../imports/ui/filters/uninvitedPipe';

@NgModule({
  declarations: [
    DisplayNamePipe,
    UninvitedPipe,
    PartyDetails,
    PartyUninvited
  ],
  imports: [
    BrowserModule,
    FormsModule
  ]
})
class AppNg2Module {}

const adapter = new UpgradeAdapter(AppNg2Module);

adapter.upgradeNg1Component('partyMap');

registerAuth(adapter);
registerLogin(adapter);
registerNavigation(adapter);
registerPartiesList(adapter);
registerPartiesMap(adapter);
registerPartiesSort(adapter);
registerPartyAdd(adapter);
registerPartyAddButton(adapter);
registerPartyCreator(adapter);
registerPartyDetails(adapter);
registerPartyImage(adapter);
registerPartyMap(adapter);
registerPartyRemove(adapter);
registerPartyRsvp(adapter);
registerPartyRsvpsList(adapter);
registerPartyUpload(adapter);
registerPassword(adapter);
registerRegister(adapter);
registerSocially(adapter);

function onReady() {
  adapter.bootstrap(document.body, [
    SociallyNg1Module.name
  ]);
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
