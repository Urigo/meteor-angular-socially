Package.describe({
  name: 'socially-browser',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use('ecmascript');
  api.use('angular');

  api.addFiles([
    'client/lib/module.ng.js',
    'client/routes.ng.js',
    'client/users/controllers/login.ng.js'
  ], 'web.browser');

  api.addAssets([
    'client/users/views/login-browser.ng.html'
  ], 'web.browser');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('socially-mobile');
});
