import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { OtpComponent } from 'src/app/pages/otp/otp.component';
import { CategoryComponent } from 'src/app/pages/category/category.component';
import { SearchresultComponent } from 'src/app/pages/searchresult/searchresult.component';
import { SubCategoryComponent } from 'src/app/pages/sub-category/sub-category.component';
import { CategoryDetailsComponent } from 'src/app/pages/category-details/category-details.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';
import { LocationComponent } from 'src/app/pages/location/location.component';
import { NotFound404Component } from './pages/others/not-found404/not-found404.component';
import { RouteGuard } from './guard/route.guard';
import { SearchVendorLocationComponent } from './pages/search-vendor-location/search-vendor-location.component';
import { TrackingVendorComponent } from './pages/tracking-vendor/tracking-vendor.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { JoinUsComponent } from './pages/join-us/join-us.component';
import { VendorProfileComponent } from './pages/vendor-profile/vendor-profile.component';
import { VendorAuthComponent } from './pages/vendor-auth/vendor-auth.component';
import { AddTeamComponent } from './pages/add-team/add-team.component';
import { ThanksComponent } from './pages/thanks/thanks.component';
import { VendorJobComponent } from './pages/vendor-job/vendor-job.component';
import { CustomerTrackComponent } from './pages/customer-track/customer-track.component';
import { CongratsComponent } from './pages/congrats/congrats.component';
import { BookingTimingComponent } from './pages/booking-timing/booking-timing.component';
import { CardPaymentComponent } from './pages/card-payment/card-payment.component';
import { CartComponent } from './pages/cart/cart.component';
import { SucessComponent } from './pages/success/sucess.component';
import { MyBookingComponent } from './pages/my-booking/my-booking.component';
import { ScheduleDateComponent } from './pages/schedule-date/schedule-date.component';
import { MyTeamComponent } from './pages/my-team/my-team.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { StartedJobComponent } from './pages/started-job/started-job.component';
import { BookingDetailsComponent } from './pages/booking-details/booking-details.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { VendorRegistrationComponent } from './pages/vendor-registration/vendor-registration.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full'
  },
  {
    path: 'home', 
    component: HomeComponent
  },
  {
    path: 'vendorRegistration', 
    component: VendorRegistrationComponent 
  },
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'otp', 
    component: OtpComponent
  },
  // {
  //   path: 'category', 
  //   component: CategoryComponent, 
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'searchresult', 
  //   component: SearchresultComponent,
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'sub-category', component: SubCategoryComponent,
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'category-details', component: CategoryDetailsComponent,
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'register', component: RegisterComponent,
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'location', component: LocationComponent,
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'search-vendor', component: SearchVendorLocationComponent,
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'track-vendor', component: TrackingVendorComponent,
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'payment', component: PaymentComponent,
  //   canActivate: [RouteGuard]
  // },
  {
    path: 'joinus', component: JoinUsComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'onboarding', component: OnboardingComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'vendorprofile', component: VendorProfileComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'vendorauth', component: VendorAuthComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'addTeam', component: AddTeamComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'thanks', component: ThanksComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'vendor-job', component: VendorJobComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'customer-tracking', component: CustomerTrackComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'congrats', component: CongratsComponent,
    canActivate: [RouteGuard]
  },
  // {
  //   path: 'booking-timing', component: BookingTimingComponent,
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'card-payment', component: CardPaymentComponent,
  //   canActivate: [RouteGuard]
  // },
  // {
  //   path: 'cart', component: CartComponent,
  //   canActivate: [RouteGuard]
  // },
  {
    path: 'success', component: SucessComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'my-jobs', component: MyBookingComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'my-team', component: MyTeamComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'my-account', component: MyAccountComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'started-job', component: StartedJobComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'booking-details', component: BookingDetailsComponent,
    canActivate: [RouteGuard]
  },
  // {
  //   path: 'schedule-date', component: ScheduleDateComponent,
  //   canActivate: [RouteGuard]
  // },
  {
    path: '**', component: NotFound404Component
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
