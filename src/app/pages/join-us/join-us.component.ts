import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-join-us',
  templateUrl: './join-us.component.html',
  styleUrls: ['./join-us.component.scss'],
})
export class JoinUsComponent implements OnInit {
  showLoader: boolean = false;

  constructor(
    private router: Router,
    private helper: HelpermethodsService,
    private apiService: ApiService,
  ) { }

  ngOnInit() {}



  onChooseOption(value) {
    console.log('choose option value :.................', value);
    let encryptedData = this.helper.encryptData(value);
    localStorage.setItem('vendor_type', encryptedData);
    this.updateVendorDetails(value);       
  }



  updateVendorDetails(value){
    this.showLoader = true;

    let payload = {
      vendor_id: this.helper.checkForUserData().id,
      updateData: {
        is_company: value
      }
    }

    console.log();
    

    this.apiService.updateVendorDetails(payload).subscribe(async (data: any) => {
      // console.log('api responce :...........', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {            
          this.showLoader = false;
          this.router.navigate(['vendorprofile']); 
        }else{
          this.showLoader = false;
          // let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
          // toast.present();
        }
      }     
    });
  }


}
