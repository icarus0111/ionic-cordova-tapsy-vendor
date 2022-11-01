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
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss'],
})
export class AddTeamComponent implements OnInit {

  vendorAddTeamForm: FormGroup;
  showLoader: boolean = false;
  empList: any;

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


  ionViewWillEnter() {
    localStorage.setItem('notInHomePage', 'true');
  }
  

  ngOnInit() {
    this.initializeForm();
    this.getEmployeeListByCompanyId();
  }




  initializeForm(){
    // window.localStorage.removeItem('token');
    this.vendorAddTeamForm = this.formBuilder.group({
      phone: ['', Validators.compose(
        [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]
      )]
    });
  }




  onSubmitVendorAddTeamForm() {
    let payload = this.getFormValue();
    payload.role_id = 3;
    payload.added_by = this.helper.checkForUserData().id;

    console.log(payload);
    this.apiService.addEmployeeByCompany(payload).subscribe(async(data: any)=>{
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
          this.getEmployeeListByCompanyId();
          let toast = await this.toast.presentToast('Success!', decrypted.msg, "success", 5000); 
          toast.present();
        } else {

        }
      }
    });
  }






  getEmployeeListByCompanyId() {

    let payload = {
      id: this.helper.checkForUserData().id
    }

    this.apiService.getEmployeeListByCompanyId(payload).subscribe(async(data: any)=>{
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
          // let toast = await this.toast.presentToast('Success!', decrypted.msg, "success", 5000); 
          // toast.present();
          this.empList = decrypted.data;
          console.log('emp list :..............................', this.empList);
        } else {

        }
      }
    });
  }




  getFormValue() {
    console.log('form form value :........   ', this.vendorAddTeamForm.value);    
    return this.vendorAddTeamForm.value;
  }





  onClickProcess(){

    let payload = {
      vendor_id: this.helper.checkForUserData().id,
      updateData: {
        isTeamAdded: 1
      }
    }

    console.log('payload data :....................', payload);    

    this.apiService.updateVendorDetails(payload).subscribe(async(data: any)=> {
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
          let toast = await this.toast.presentToast('Success!', decrypted.msg, "success", 5000); 
          toast.present();
          this.router.navigate(['vendor-job']);
        } else {

        }
      }
    });

  }

}
