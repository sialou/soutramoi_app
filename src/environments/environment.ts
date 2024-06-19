// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  // apiUrl: 'https://api.soutramoi.com',
  mapboxToken: 'pk.eyJ1IjoiY29kaXZvaXJlIiwiYSI6ImNrejl5YWZqZTE5djMyd3M4dDczeHkyZGIifQ.G04ByFCWwnxCBV7goLFDNg',
  firebase: {
    apiKey: 'AIzaSyD2XqvqHm_jxN5Z4sfab9DJEkk5Om9VZuM',
    authDomain: 'soutramoi-app.firebaseapp.com',
    projectId: 'soutramoi-app',
    storageBucket: 'soutramoi-app.appspot.com',
    messagingSenderId: '297478535727',
    appId: '1:297478535727:web:971392e757e2692d4024da',
    measurementId: 'G-ZN5CQN2QNS'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
