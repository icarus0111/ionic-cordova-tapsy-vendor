import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { AlertService } from 'src/app/service/alert.service';
import { RouteGuard } from '../../guard/route.guard';
import { ToasterService } from 'src/app/service/toaster.service';
import { FcmService } from 'src/app/service/fcm.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// ToasterService
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean = false;
  showLoader: boolean = false;

  constructor(
    private route:Router,
    private formBuilder: FormBuilder, 
    private router: Router, 
    private apiService: ApiService, 
    private alert: AlertService, 
    private guard: RouteGuard, 
    private helper: HelpermethodsService,
    private fcmServ: FcmService,
    private toast: ToasterService,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic
  ) { 
    // this.checkForUserLoginStatus();
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter() called on login page.');    
    this.checkForUserLoginStatus();
    // this.getLocation();
    // this.getLocation();
    this.grantPermission();
  }

  ionViewDidEnter(){
    this.getLocation();   
  }

  ngOnInit() {
    // this.checkForUserLoginStatus();
    console.log('Login page.');  
    this.initializeLoginForm(); 
    // this.grantPermission(); 
  }

  initializeLoginForm(){
    // window.localStorage.removeItem('token');
    this.loginForm = this.formBuilder.group({
      // phone: ['', Validators.compose(
      //   [Validators.required, Validators.minLength(9), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]
      // )],
      email: ['', Validators.compose(
        [Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]
      )]
    });
  }



  
  otp() {
    this.route.navigate(['/otp']);
  }




  async onSubmitLoginForm() {
    this.showLoader = true;
    // console.log('form value :..........', this.getLoginFormValue());
    let vendorAuthData: any = this.helper.checkForVendorAuthData();
    console.log('vendor auth data :................', vendorAuthData);    
    let addTeamData: any = this.helper.checkForAddTeamData();

    if (this.loginForm.invalid) {
      console.log(this.loginForm.controls);      
      let toast = await this.toast.presentToast('Info!', 'Invalid Email', "primary", 4000); 
      toast.present();
      this.showLoader = false;
      return;
    }

    const loginPayload = {
      email: this.getLoginFormValue().email,
      role_id: 3
    }

    // const encryptedPayload = {
    //   TAP_REQ: this.helper.encryptDataFromRequest(loginPayload)
    // }

    // console.log('api responce :...........', loginPayload);

    this.apiService.loginWithEmail(loginPayload).subscribe(async (data: any) => {
      // console.log('api responce :...........', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);

        if(decrypted.status) {
          
          let shareData = {
            token: decrypted.token,
            data: decrypted.data
          }

          this.helper.changeMessage(JSON.stringify(shareData));
          // let encryptedData = this.helper.encryptData(decrypted.data);
          // let encryptedToken = this.helper.encryptData(decrypted.token);
          // localStorage.setItem('user_data', encryptedData);
          // localStorage.setItem('token', encryptedToken); 
          // let is_token_set = await this.fcmServ.getToken();
          
          // let toast = await this.toast.presentToast('Success!', decrypted.msg, "success", 5000); 
          // toast.present();

          // if(decrypted.data.email == null) {
          //   this.router.navigate(['joinus']);
          // }else if(decrypted.data.vendor_details && decrypted.data.vendor_details.businessName == null) {
          //   this.router.navigate(['vendorauth']);
          // }else if(decrypted.data.vendor_details && decrypted.data.vendor_details.isTeamAdded == null) {
          //   this.router.navigate(['addTeam']);
          // }else {
          //   this.router.navigate(['vendor-job']);
          // }
          this.router.navigate(['otp']);              
          this.showLoader = false;
        }else{
          this.router.navigate(['otp']);
          this.showLoader = false;
          let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
          toast.present();
        }
      }     
    });
  }




  getLoginFormValue() {
    return this.loginForm.value;
  }




  async showPhoneNumberError() {
    let errors = await this.phoneErrors();
    // console.log(errors);    
  }




  async phoneErrors() {
    return this.loginForm.controls.phone.errors;
  }





  checkForUserLoginStatus() {
    if(this.guard.checkForUserData()) {
      this.router.navigate(['vendor-job']);
    }
  }




  getLocation() {
    return new Promise((resolve, reject)=>{
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
        console.log('location responce data :...............', resp);

        if(resp && resp.coords.latitude && resp.coords.longitude){
          let cus_location = {
            lat: resp.coords.latitude,
            long: resp.coords.longitude,
          }
          localStorage.setItem('LOC_DATA', this.helper.encryptData(cus_location));
          resolve(cus_location);
        }  
      }).catch((error) => {
        console.log('Error getting location', error);
        reject(error);
      });
    })    
  }





  grantPermission() {  
    this.diagnostic.isCameraAuthorized()
    .then(authorized => {
      console.log('camera is ' + (authorized ? 'authorized' :   'unauthorized'));
     if (!authorized) {
           // location is not authorized
        this.diagnostic.requestCameraAuthorization().then((status) => {
          switch (status) {
          case this.diagnostic.permissionStatus.NOT_REQUESTED:
                console.log('Permission not requested');
                break;
          case this.diagnostic.permissionStatus.GRANTED:
                console.log('Permission granted');
                break;
          case this.diagnostic.permissionStatus.DENIED:
                console.log('Permission denied');
                break;
          case this.diagnostic.permissionStatus.DENIED_ALWAYS:
                console.log('Permission permanently denied');
                break;
            }
        }).catch(error => {
                console.log(error);
              });
            }
          }).catch(err => {
            console.log(err);
          });
    }



}
