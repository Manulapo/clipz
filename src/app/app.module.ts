import { angularMaterial } from './angular-material-icons.module';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { NavComponent } from './components/nav/nav.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment.development';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { VideoModule } from './video/video.module';
import { ClipComponent } from './components/clip/clip.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ClipsListComponent } from './components/clips-list/clips-list.component';
import { FbTimestampsPipe } from './pipes/fb-timestamps.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AboutComponent,
    ClipComponent,
    NotFoundComponent,
    ClipsListComponent,
    FbTimestampsPipe,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    ...angularMaterial,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
  ],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
