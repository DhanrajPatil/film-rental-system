// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  customerUrl: 'http://localhost:8080/customers',
  filmUrl: 'http://localhost:8080/films',
  rentalUrl: 'http://localhost:8080/rentals',
  staffUrl: 'http://localhost:8080/staff',
  storeUrl: 'http://localhost:8080/stores',
  languageUrl: 'http://localhost:8080/languages',
  actorUrl: 'http://localhost:8080/actors',
  categoryUrl: 'http://localhost:8080/categories',
  authUrl: 'http://localhost:8282/auth',
  appName: 'Film Rental Service',
  supabase: {
    url: 'https://gqihrnbxfzvnebstnojw.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWhybmJ4Znp2bmVic3Rub2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNzk3OTgsImV4cCI6MjA1NDY1NTc5OH0.P-lsaaDeCrmw_B1dPBz_s1Hqnf62tHDgxhFLcmuaeYA'
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
