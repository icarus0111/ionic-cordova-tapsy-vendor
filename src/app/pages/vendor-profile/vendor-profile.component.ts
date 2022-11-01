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
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss'],
})
export class VendorProfileComponent implements OnInit {

  vendorProfileForm: FormGroup;
  showLoader: boolean = false;
  categoryList: Array<any> = [];
  stateList: Array<any> = [];

  constructor(
    private route: Router,
    private helper: HelpermethodsService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private alert: AlertService, 
    private guard: RouteGuard, 
    private toast: ToasterService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.getCategoryList();
    this.getStateList();
  }




  initializeForm(){
    // window.localStorage.removeItem('token');
    this.vendorProfileForm = this.formBuilder.group({
      first_name: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(25), Validators.pattern(/^[a-zA-Z ]*$/)])],

      last_name: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z ]*$/)])],

      email: [null, Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)])],

      service: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      suburn: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      state: [null, Validators.compose([Validators.required])],
      post_code: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])]
    });
  }






  getFormErrors() {
    // console.log(this.loginForm.controls);
    let allFields = this.vendorProfileForm.controls;
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






  async onSubmitVendorProfileForm() {
    console.log('submit :............');
    this.showLoader = true;

    if (this.vendorProfileForm.invalid) {
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
    localStorage.setItem('verdor_profile_data', encryptedData);
    // this.router.navigate(['vendorauth']);
    console.log('vendor profile value :...................', vendorProfileValue);     
    this.updateUserDetails(vendorProfileValue);
  }







  updateUserDetails(value: any){

    this.showLoader = true;

    let payload = {
      id: this.helper.checkForUserData().id,
      updateData: {
        address: value.address,
        name: this.helper.getName(value.first_name, value.last_name),
        email: value.email,
        post_code: value.post_code,
        category_id: value.service,
        state: value.state,
        suburb: value.suburn
      }
    }

    console.log('user update data : ..............', payload);    

    this.apiService.updateUser(payload).subscribe(async (data: any) => {
      // console.log('api responce :...........', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('user update status :..............................', decrypted);
        if(decrypted.status) {            
          this.showLoader = false;
          this.router.navigate(['vendorauth']); 
        }else{
          this.showLoader = false;
          // let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
          // toast.present();
        }
      }     
    });
  }






  







  getFormValue() {
    console.log('form form value :........   ', this.vendorProfileForm.value);    
    return this.vendorProfileForm.value;
  }





  getCategoryList() {
    this.showLoader = true;
    this.apiService.getCategoryList().subscribe((data: any) => {    
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          if(decrypted.data !== null && decrypted.data.length > 0){
            this.categoryList = decrypted.data;
            // console.log('api responce category list :...........', this.categoryList);
          }else{
            this.categoryList = [];
          }
          this.showLoader = false;
        }else {
          this.showLoader = false;
        }
      }        
      
    });
  }





  getStateList() {
    this.showLoader = true;
    this.apiService.getAllStateList().subscribe((data: any) => {    
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
          console.log('api responce state list :...........', decrypted);
          if(decrypted.data !== null && decrypted.data.length > 0){
            this.stateList = decrypted.data;
            // console.log('api responce vendors list :...........', this.customersList);
            this.showLoader = false;
          }else{
            this.showLoader = false;
            this.stateList = [];
          }
        }else {
          this.showLoader = false;
        }
      }        
      
    });
  }





}
