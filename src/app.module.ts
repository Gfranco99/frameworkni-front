import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { MessagingModule, getMessaging, provideMessaging } from '@angular/fire/messaging';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      // enabled: !isDevMode(),
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
    // provideFirebaseApp(() => initializeApp({"projectId":"framework-ni-new-features","appId":"1:809740468404:web:e74ba8223d5d9429b1d7e1","storageBucket":"framework-ni-new-features.appspot.com","apiKey":"AIzaSyB7P6qYzZOs8HoUPIcBeL5nzqz5j_GHshs","authDomain":"framework-ni-new-features.firebaseapp.com","messagingSenderId":"809740468404","measurementId":"G-TNZ8FBPZ3D"})),
    // provideAuth(() => getAuth()),
    // provideDatabase(() => getDatabase()),
    // provideMessaging(() => getMessaging()),
    // MessagingModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
