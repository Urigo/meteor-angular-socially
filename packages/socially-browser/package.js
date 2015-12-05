Package.describe({
  name: 'socially-browser',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('angular');
  api.use('less');

  api.addFiles([
    'client/lib/module.js',
    'client/auth/login/login.component.js',
    'client/auth/login/login.html',
    'client/auth/register/register.component.js',
    'client/auth/register/register.html',
    'client/auth/reset-password/reset-password.component.js',
    'client/auth/reset-password/reset-password.html',
    'client/socially/socially.html',
    'client/parties/add-new-party-modal/add-new-party-modal.component.js',
    'client/parties/add-new-party-modal/add-new-party-modal.html',
    'client/parties/parties-list/parties-list.component.js',
    'client/parties/parties-list/parties-list.html',
    'client/parties/party-details/party-details.component.js',
    'client/parties/party-details/party-details.html',
    'client/parties/styles/google-maps.css',
    'client/styles/navbar.import.less',
    'client/parties/party-details/party-details.import.less',
    'client/parties/parties-list/parties-list.import.less',
    'client/parties/add-new-party-modal/add-new-party-modal.import.less',
    'client/styles/main.less'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('socially-mobile');
});
