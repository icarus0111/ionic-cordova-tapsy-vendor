import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js";
import { environment } from "../../environments/environment";
import { ToasterService } from './toaster.service';
// import { RouteGuard } from '../guard/route.guard';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpermethodsService {

  // secret: string = "nPRCyH$3r0V1NwGm";
  fileData: File = null;
  image64: any = null;

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  constructor(private toaster: ToasterService, 
    // private guard: RouteGuard, 
    private router: Router
    ) { }


    changeMessage(message: string) {
      this.messageSource.next(message)
    }


  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), environment.encrySecret).toString();
    } catch (e) {
      console.log(e);
    }
  }
  

  decryptData(data) {
    // console.log('decryptData method : ....', data, environment.encrySecret);
     if(data != null && data != ''){
      try {
        const bytes = CryptoJS.AES.decrypt(data, environment.encrySecret);
        // console.log('decryptData method : ....', bytes);
        if (bytes.toString()) {
          return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return data;
      } catch (e) {
        // console.log('salt error :  ', e);
      }
    }
    
  }


  async imageProgress(fileInput: any) {
    let fileData = <File>fileInput.target.files[0];
    console.log('this.fileData : ....................', fileData);    
    let returnData = await this.preview(fileData);
    return returnData;
  }


  async preview(fileData) {
    // Show preview 
    this.image64 = null;
    let mimeType = fileData.type;
    let arr = fileData.name.split('.');

    console.log('name array : ....................', arr);
    if (mimeType.match(/image\/*/) == null || fileData.size > 102400) {
      // this.toaster.showError('Upload image within 100 KB', 'Error!');
      return;
    }else if(arr[1].toLowerCase() !== 'png' && arr[1].toLowerCase() !== 'jpg' && arr[1].toLowerCase() !== 'jpeg') {
      // this.toaster.showError('Upload format should be PNG/JPG', 'Error!');
      return;
    }

    var reader = new FileReader();      
    reader.readAsDataURL(fileData); 
    return new Promise((resolve, reject)=>{
      reader.onload = (_event) => { 
        this.image64 = reader.result;       
        // console.log('this.image64 ### :.................', this.image64);  
        if(this.image64){
          resolve(this.image64);
        }else{
          reject();
        }           
      }
    })
    
    // console.log('this.image64 ### return :.................', this.image64);
    // return this.image64;
  }





  //-------------------------------------------------------------
  // encrypt request data
  //-------------------------------------------------------------
  encryptDataFromRequest(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), environment.encrySecretForRequest).toString();
    } catch (e) {
      console.log(e);
    }
  }



  //-------------------------------------------------------------
  //  decrypt responce data
  //-------------------------------------------------------------
  decryptResponceData(payload) {
    
    try {
        const bytes = CryptoJS.AES.decrypt(payload, environment.encrySecretForRequest);
        if (bytes.toString()) {
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return payload;
    } catch (e) {
        console.log(e);
    }
  }




  // checkForUserLoginStatus() {
  //   if(this.guard.checkForUserData()){
  //     this.router.navigate(['category']);
  //     return;
  //   }
  // }




  getErrorText(){
    return {
      required: 'is required',
      minlength: `Minimum character required`,
      maxlength: `Maximum character allowed`,
      pattern: 'Invalid entry on',
      email: 'Please enter a valid Email'
    }
  }




  checkForUserData() {
    let localUserData = localStorage.getItem('user_data');
    let localTokenData = localStorage.getItem('token');
    if(localUserData && localTokenData) {
      let userData = this.decryptData(localUserData);
      if(userData.phone && userData.role_id && userData.id){
        return userData;
      }else{
        return false;
      }
    }else{
      return false;
    } 
  }





  checkForPushData() {
    let localUserData = localStorage.getItem('push_data');
    // let localTokenData = localStorage.getItem('token');
    if(localUserData) {
      let pushData = this.decryptData(localUserData);
      // console.log('local push data : ', pushData);      
      if(pushData) {
        return pushData;
      } else {
        return false;
      }
    }else{
      return false;
    } 
  }



  checkForPushData2() {
    let localUserData = localStorage.getItem('push_data2');
    // let localTokenData = localStorage.getItem('token');
    if(localUserData) {
      let pushData = this.decryptData(localUserData);
      // console.log('local push data : ', pushData);      
      if(pushData) {
        return pushData;
      } else {
        return false;
      }
    }else{
      return false;
    } 
  }





  checkForVendorAuthData() {
    let localUserData = localStorage.getItem('verdor_auth_data');
    // let localTokenData = localStorage.getItem('token');
    if(localUserData) {
      let pushData = this.decryptData(localUserData);
      if(pushData && pushData.abn && pushData.businessName) {
        return {status: true, data: pushData};
      } else {
        return {status: false};
      }
    }else{
      return {status: false};
    } 
  }






  checkForAddTeamData() {
    let localUserData = localStorage.getItem('add_team');
    // let localTokenData = localStorage.getItem('token');
    if(localUserData) {
      let data = this.decryptData(localUserData);
      if(data) {
        return {status: true, data: data};
      } else {
        return {status: false};
      }
    }else{
      return {status: false};
    } 
  }





  getName(f,l){
    return `${f.trim()} ${l.trim()}`;
  }






  removeJobRelatedLocalData() {
    localStorage.removeItem('push_data');
    localStorage.removeItem('push_data2');
    localStorage.removeItem('istrackstarted');
  }



  chargeIdData(){
    return ''
  }




  getLocationData() {
    let localLocData = localStorage.getItem('LOC_DATA');
    if(localLocData) {
      return this.decryptData(localLocData);      
    }else{
      return false;
    }
  }



}
