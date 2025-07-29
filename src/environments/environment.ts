// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appRotas: {
    waze: 'https://ul.waze.com/ul?place=ChIJbRTezphXzpQRAVfaKIzwcKA&ll=-23.55917110%2C-46.68847640&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location',
    google: 'https://goo.gl/maps/TXzqp5LiW2b4hokR7'
  },
  appSettings: {
    // API_ENDPOINT: 'https://localhost:44334/api'
    // API_ENDPOINT: 'http://62.171.128.216:7001/api/'
    API_ENDPOINT: 'https://localhost:44334/api/'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
