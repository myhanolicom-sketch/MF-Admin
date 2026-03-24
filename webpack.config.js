const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'admin',
  filename: 'remoteEntry.js',
  
  exposes: {
    './AdminComponent': './src/app/admin.component.ts',
    './AdminRoutes': './src/app/admin.routes.ts',
    './Module': './src/app/admin.routes.ts'
  },

  shared: {
    '@angular/core': { singleton: true, strictVersion: false },
    '@angular/common': { singleton: true, strictVersion: false },
    '@angular/router': { singleton: true, strictVersion: false },
    'rxjs': { singleton: true, strictVersion: false },
    'primeng': { singleton: true, strictVersion: false }
  }
});
