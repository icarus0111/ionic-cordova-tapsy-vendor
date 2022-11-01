import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { AlertService } from 'src/app/service/alert.service';
import { ApiService } from 'src/app/service/api.service';
import { FcmService } from 'src/app/service/fcm.service';
import { RouteGuard } from 'src/app/guard/route.guard';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {

  @ViewChild('otpinput', {static: false}) otpField: ElementRef;

  userData: any;
  
  otp1: any = '';
  otp2: any = '';
  otp3: any = '';
  otp4: any = '';
  otp5: any = '';
  otp6: any = '';
  
  showLoader: boolean;

  constructor(
    private route:Router,
    private helper: HelpermethodsService,
    private router: Router,
    private alert: AlertService,
    private apiService: ApiService,
    private fcmServ: FcmService,
    private guard: RouteGuard, 
  ) {
    this.checkForUserLoginStatus();
   }




  ngOnInit() {
    this.checkCurrentShareData();
  }




  onTypeOtp(){   
    let inputs = this.otpField.nativeElement as HTMLInputElement;
    let allotpinputs = inputs.parentElement.children;
    let otpp = this.returnOtpCurrentValue();
    let length = this.returnlength(otpp);
    if(length < 6){
      let selected = allotpinputs[length] as HTMLInputElement;
      selected.focus();
    }
  }




  returnOtpCurrentValue() {
    let otp = `${this.otp1}${this.otp2}${this.otp3}${this.otp4}${this.otp5}${this.otp6}`;
    return otp;   
  }




  returnlength(text){
    return text.length;
  }




  category() {
    this.route.navigate(['/category']);
  }





  returnOtp() {
    let otp = `${this.otp1}${this.otp2}${this.otp3}${this.otp4}${this.otp5}${this.otp6}`;
    if(otp && otp.length == 6){
      return otp;
    }else{
      return '';
    }
  }





  checkCurrentShareData() {
    this.helper.currentMessage.subscribe((data) => {
      if(data){
        let parsedata = JSON.parse(data);
        console.log('shared data : ', parsedata);         
        if(parsedata.data.id && parsedata.data.email){                   
          this.userData = parsedata;
        }else{
          this.router.navigate(['/login']);
        }
      }else{
        console.log('shared data : ', data); 
        // this.router.navigate(['/login']);
      }           
    })
  }





  async onSubmitOtp() {
    this.showLoader = true;
    let otp = this.returnOtp();
    console.log('final otp : ', otp);
    
    if(otp.length < 6){
      const alert = await this.alert.presentAlertConfirm('Alert!', 'Invalid OTP');
      alert.present();
      return; 
    }  
    
    
    let payload = {
      id: this.userData.data.id,
      otp: otp
    }


    this.apiService.verifyMobile(payload).subscribe(async (res: any) => {
      if(res && res.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(res.TAP_RES);
        console.log('after otp submit responce :..............................', decrypted);
        if(decrypted.status) { 
          let encryptedData = this.helper.encryptData(decrypted.data);
          let encryptedToken = this.helper.encryptData(decrypted.token);
          localStorage.setItem('user_data', encryptedData);
          localStorage.setItem('token', encryptedToken); 
          let is_token_set = await this.fcmServ.getToken();
          
          // if(decrypted.data.email == null) {
          //   this.router.navigate(['joinus']);
          // }else if(decrypted.data.vendor_details && decrypted.data.vendor_details.businessName == null) {
          //   this.router.navigate(['vendorauth']);
          // }else if(decrypted.data.vendor_details && decrypted.data.vendor_details.isTeamAdded == null) {
          //   this.router.navigate(['addTeam']);
          // }else {
          //   this.router.navigate(['vendor-job']);
          // }
          
          console.log('>>>>>>>>>>>>>>Redirecting to home...');          
          this.router.navigate(['vendor-job']);
          this.showLoader = false;                   
        }else {
          localStorage.clear();
          this.showLoader = false;
          const alert = await this.alert.presentAlertConfirm('Alert!', 'Something went wrong.');
          alert.present();
          this.router.navigate(['login']);
        }
      }
    }, async err => {
        this.showLoader = false;
        console.log(err);
        const alert = await this.alert.presentAlertConfirm('Alert!', 'Something went wrong.');
        alert.present();
        this.router.navigate(['login']);
    });
  }





  checkForUserLoginStatus() {
    if(this.guard.checkForUserData()) {
      this.router.navigate(['vendor-job']);
    }
  }




  
}
