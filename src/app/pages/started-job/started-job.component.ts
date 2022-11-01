import { Component, OnInit } from '@angular/core';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/service/toaster.service';

@Component({
  selector: 'app-started-job',
  templateUrl: './started-job.component.html',
  styleUrls: ['./started-job.component.scss'],
})
export class StartedJobComponent implements OnInit {
  showLoader: boolean;

  constructor(
    private helper: HelpermethodsService,
    private apiService: ApiService,
    private route: Router,
    private toast: ToasterService,
  ) { }

  ngOnInit() {}






  getPayment(){
    this.showLoader = true;
    this.changeUserActiveStatus(1);
    let jobData = this.helper.checkForPushData2();
    console.log('saved push data :.........', jobData);
    let charge_id = jobData.charge_id;

    let payload = {
      charge_id: charge_id,
      // charge_id: 'ch_1FomtQGyJck0KUUW7yRWIoaX',
    }

    this.apiService.getPayment(payload).subscribe(async(data) => {
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
            let paymentData = decrypted.data;
            console.log('payment data :.........', paymentData);
            
            this.sendApproveNotification();

            let paymentDetailsUpdateData = {
              job_id: jobData.job_id,
              updateData: {
                transaction_id: paymentData.balance_transaction,
                description: paymentData.description,
                payment_method: paymentData.payment_method,
                receipt_url: paymentData.receipt_url
              }
            }

            this.apiService.updatePaymentDetails(paymentDetailsUpdateData).subscribe(async (data) =>{
              if(data && data.TAP_RES) {
                let decrypted = this.helper.decryptResponceData(data.TAP_RES);
                // console.log('decrypt data :............', decrypted); 
                if(decrypted.status){
                  this.updatejobAsCompleted(jobData.job_id);                  
                }else{
                  this.showLoader = false;
                  let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
                  toast.present();
                }
              }
            },error => {
              console.log('####### err', error);
              this.showLoader = false;
            });

        }else {
          this.showLoader = false;
          let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
          toast.present();
        }
      } 
    }, error => {
      console.log('####### err', error);
    });
  }






  async sendApproveNotification(){

    // let userData: any = await this.helper.checkForUserData();
    let jobData: any = this.helper.checkForPushData2();

    let payload = {
      id: jobData.cus_id.toString(),
      additionData: {
        type: 'approve_job',
        cus_id: jobData.cus_id.toString(),
        job_id: jobData.job_id.toString(),
        title: 'Relax, your job is done',
        body: 'Thanks for giving us an opportunity to serve you'
      } 
    }

    console.log('payload data for notification : ......', payload);          

    this.apiService.sendPushNotification(payload).subscribe((data: any) => {    
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
          console.log('send push responce', decrypted);
          // this.route.navigate(['success']);         
        }else {
          console.log('send push error responce', decrypted);
        }
      }         
    });


    // this.getPayment();
  }




  updatejobAsCompleted(jobid){

    let payload = {
      id: jobid,
      updateData: {
        job_status: 2
      }
    }

    this.apiService.updateJobs(payload).subscribe(async(data)=>{
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypt data :............', decrypted); 
        if(decrypted.status){
          this.helper.removeJobRelatedLocalData();
          this.route.navigate(['vendor-job']); 
          this.showLoader = false;
        }else{
          this.showLoader = false;
          let toast = await this.toast.presentToast('Error!', 'Something wrong. Try again.', "danger", 5000); 
          toast.present();
        }
      }
    }, async(error) => {
      console.log('####### err', error);
      this.showLoader = false;
      let toast = await this.toast.presentToast('Error!', 'Something wrong. Try again.', "danger", 5000); 
      toast.present();
    });

  }






  changeUserActiveStatus(value){
    this.showLoader = true;

    let payload = {
      id: this.helper.checkForUserData().id,
      updateData : {
        is_available: value
      }
    }

    console.log(payload);    

    this.apiService.updateUser(payload).subscribe(async (data:any) => {
        if(data && data.TAP_RES) {
          let decrypted = this.helper.decryptResponceData(data.TAP_RES);
          if(decrypted.status){
            // let toast = await this.toast.presentToast('Success!', decrypted.msg, "success", 5000); 
            // toast.present();
            // this.checkForActiveState();
            this.showLoader = false;
          }else{
            // let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
            // toast.present();
            this.showLoader = false;
          }
        }
    }, async error => {
      // let toast = await this.toast.presentToast('Error!', 'Something went wrong. Please try again.', "danger", 5000); 
      // toast.present();
      console.log('error : ', error);
      this.showLoader = false;      
    })
  }






  






}
