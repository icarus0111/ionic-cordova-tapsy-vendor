import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/service/alert.service';
import { RouteGuard } from 'src/app/guard/route.guard';
import { ToasterService } from 'src/app/service/toaster.service';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-vendor-auth',
  templateUrl: './vendor-auth.component.html',
  styleUrls: ['./vendor-auth.component.scss'],
})
export class VendorAuthComponent implements OnInit {

  vendorAuthForm: FormGroup;
  showLoader: boolean = false;

  constructor(
    private router: Router,
    private helper: HelpermethodsService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private alert: AlertService, 
    private guard: RouteGuard, 
    private toast: ToasterService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }




  initializeForm(){
    // window.localStorage.removeItem('token');
    this.vendorAuthForm = this.formBuilder.group({
      businessName: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      abn: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])]
    });
  }





  async onSubmitVendorAuthForm() {
    this.showLoader = true;
    // console.log('form value :..........', this.getLoginFormValue());
    if (this.vendorAuthForm.invalid) {
      // this.showPhoneNumberError();
      this.getFormErrors().then(async(data: any) => {
        console.log('errors messages list :............', data); 
        if(data && data.length > 0){
          const alert = await this.alert.presentAlertConfirm('Alert!', data[0].errorText);
          alert.present();
        }               
      }).catch(err=> {
        console.log(err);        
      }); 
      
      this.showLoader = false;
      return;
    }


    let vendorProfileValue = this.getFormValue();
    let encryptedData = this.helper.encryptData(vendorProfileValue);
    localStorage.setItem('verdor_auth_data', encryptedData);
    // this.router.navigate(['addTeam']);

    this.updateVendorDetails(vendorProfileValue);
  }






  updateVendorDetails(value){
    this.showLoader = true;

    let payload = {
      vendor_id: this.helper.checkForUserData().id,
      updateData: value
    }

    console.log();
    

    this.apiService.updateVendorDetails(payload).subscribe(async (data: any) => {
      // console.log('api responce :...........', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('update status :..............................', decrypted);

        if(decrypted.status) {            
          this.showLoader = false;
          this.router.navigate(['addTeam']); 
        }else{
          this.showLoader = false;
          // let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
          // toast.present();
        }
        
      }     
    });
  }





  getFormValue() {
    console.log('form form value :........   ', this.vendorAuthForm.value);    
    return this.vendorAuthForm.value;
  }





  getFormErrors() {
    // console.log(this.loginForm.controls);
    let allFields = this.vendorAuthForm.controls;
    let size = Object.keys(allFields).length;
    var err = {};
    let errorArray = [];

    return new Promise((resolve, reject) => {
      Object.entries(allFields).forEach(
        ([key, value], index) => {
          
          if(value.errors){  
            Object.entries(value.errors).forEach(
              ([k, valu]) => {
                // console.log(key, value);
                err = this.getErrorTexts(k,valu,key);         
                errorArray.push(err);
              }
            );
          }

          if(index+1 == size) {
            resolve(errorArray);
          }
          
        }
      );      
    });    
  }






  getErrorTexts(k,valu,key) {
    let errTexts = this.helper.getErrorText();
    // var err = {};
    if(k == 'minlength' || k == 'maxlength') {
      return {
        fieldName: key,
        errorType: k,
        errorText: `${errTexts[k]} ${valu.requiredLength} on ${key.replace(/_/gi, ' ').toUpperCase()}`
      }                  
    } else if(k == 'required') {
      return {
        fieldName: key,
        errorType: k,
        errorText: `${key.replace(/_/gi, ' ').toUpperCase()} ${errTexts[k]}`
      }
    } else {                  
      return {
        fieldName: key,
        errorType: k,
        errorText: `${errTexts[k]} ${key.toUpperCase()}`
      }
    }
  }



}
