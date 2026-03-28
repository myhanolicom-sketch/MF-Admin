const { shareAll } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'admin',
  filename: 'remoteEntry.js',
  
  exposes: {
    './AdminComponent': './src/app/admin.component.ts',
    './AdminRoutes': './src/app/admin.routes.ts',
    './Module': './src/app/admin.routes.ts'
  },

 shared: {
  ...shareAll({
    singleton: true,
    strictVersion: false,
    requiredVersion: 'auto'
  }),

  'primeng': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
  'primeicons': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
  '@angular/animations': { singleton: true, strictVersion: false, requiredVersion: 'auto' }
}
});
