import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { OtpComponent } from 'src/app/pages/otp/otp.component';
import { CategoryComponent } from 'src/app/pages/category/category.component';
import { SearchresultComponent } from 'src/app/pages/searchresult/searchresult.component';
import { SubCategoryComponent } from 'src/app/pages/sub-category/sub-category.component';
import { CategoryDetailsComponent } from 'src/app/pages/category-details/category-details.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';
import { BottomTabComponent } from 'src/app/pages/bottom-tab/bottom-tab.component';
import { LocationComponent } from 'src/app/pages/location/location.component';
import { NotFound404Component } from './pages/others/not-found404/not-found404.component';

import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {ApiService} from "./service/api.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./interceptors/interceptor";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoaderComponent } from './pages/others/loader/loader.component';
import { SearchVendorLocationComponent } from './pages/search-vendor-location/search-vendor-location.component';
import { TrackingVendorComponent } from './pages/tracking-vendor/tracking-vendor.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { JoinUsComponent } from './pages/join-us/join-us.component';
import { VendorProfileComponent } from './pages/vendor-profile/vendor-profile.component';
import { VendorAuthComponent } from './pages/vendor-auth/vendor-auth.component';
import { AddTeamComponent } from './pages/add-team/add-team.component';
import { FCM } from '@ionic-native/fcm/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { ThanksComponent } from './pages/thanks/thanks.component';
import { VendorJobComponent } from './pages/vendor-job/vendor-job.component';
import { CustomerTrackComponent } from './pages/customer-track/customer-track.component';
import { CongratsComponent } from './pages/congrats/congrats.component';
import { BookingTimingComponent } from './pages/booking-timing/booking-timing.component';
import { CardPaymentComponent } from './pages/card-payment/card-payment.component';
import { CartComponent } from './pages/cart/cart.component';
import { SucessComponent } from './pages/success/sucess.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { MyBookingComponent } from './pages/my-booking/my-booking.component';
import { ScheduleDateComponent } from './pages/schedule-date/schedule-date.component';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { MyTeamComponent } from './pages/my-team/my-team.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { StartedJobComponent } from './pages/started-job/started-job.component';
import { BookingDetailsComponent } from './pages/booking-details/booking-details.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { VendorRegistrationComponent } from './pages/vendor-registration/vendor-registration.component';
// import { Push } from '@ionic-native/push/ngx';



@NgModule({
  declarations: [AppComponent,HomeComponent,LoginComponent, VendorRegistrationComponent,OtpComponent,CategoryComponent,SearchresultComponent,SubCategoryComponent,CategoryDetailsComponent,RegisterComponent,BottomTabComponent,LocationComponent,NotFound404Component, LoaderComponent, SearchVendorLocationComponent, TrackingVendorComponent, PaymentComponent,JoinUsComponent,VendorProfileComponent, VendorAuthComponent,AddTeamComponent,ThanksComponent,VendorJobComponent,CustomerTrackComponent,CongratsComponent,BookingTimingComponent,CardPaymentComponent,CartComponent,SucessComponent,MyBookingComponent,ScheduleDateComponent,
  MyTeamComponent, MyAccountComponent,StartedJobComponent, BookingDetailsComponent, OnboardingComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    HttpClientModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
    
  ],
  providers: [
    ApiService,
    StatusBar,
    SplashScreen,
    Geolocation,
    Diagnostic,
    // Push,
    FCM,
    Camera,
    CallNumber,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi : true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

//change the basehref
