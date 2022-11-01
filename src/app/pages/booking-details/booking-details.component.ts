import { Component, OnInit } from '@angular/core';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { ApiService } from 'src/app/service/api.service';
import { AlertService } from 'src/app/service/alert.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
})
export class BookingDetailsComponent implements OnInit {

  showLoader: boolean = false;
  id: any;
  booking_details: any;
  details: any;
  showReviewSection: boolean;

  constructor(
    private alert: AlertService,
    private apiService: ApiService,
    private helper: HelpermethodsService,
    private navCtrl: NavController,
    private router: Router,
  ) {
    this.helper.currentMessage.subscribe(async (data: any) => {
      if(data) {
        let details = JSON.parse(data);
  
        if(details && details.id) {
          this.id = details.id;
        }else{
          // this.router.navigate(['my-jobs']);
        }
      }
    });
  }

  

  ionViewWillEnter() {
    localStorage.setItem('notInHomePage', 'true');
  }

  ngOnInit() {
    this.getBookingDetails();
  }

  getBookingDetails() {
    this.showLoader = true;

    let payload = {
      id: this.id
    }

    this.apiService.getBookingDetails(payload).subscribe(async (data: any) => {
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);

        if(decrypted.status) {
          this.booking_details = decrypted.data[0];
          if(decrypted.data[0].details) {
            this.details = JSON.parse(decrypted.data[0].details);
            console.log('details :.......', this.details);
            if(this.details.formData){
              this.details = this.details.formData;
            }            
            console.log('details :.......', this.details);
          }
          console.log('booking details data more :..............................', this.booking_details);

          if(this.booking_details.is_scheduled == 1 && this.booking_details.job_status == 1 && this.booking_details.is_reviewed_scheduled_job == 0){
            this.showReviewSection = true;
          }else {
            this.showReviewSection = false;
          }
          
          this.showLoader = false;

        } else {
          this.showLoader = false;
          this.router.navigate(['my-jobs']);
          const alert = await this.alert.presentAlertConfirm('Alert!', 'No Data Found');
          alert.present();
        }
      } 
    }, async (error) =>{
      this.showLoader = false;
      this.router.navigate(['my-jobs']);
      const alert = await this.alert.presentAlertConfirm('Alert!', 'Something went wrong.');
      alert.present();
    })
  }


  

  goBack(){
    this.navCtrl.pop();
  }




  onClickCompleteJob(paymentdetails) {
    this.showLoader = true;
    // let jobData = this.helper.getJobData();

    let jobUpdatePayload = {
      id: this.id,
      updateData: {
        job_status: 2
      }
    }
  

    this.apiService.updateJobs(jobUpdatePayload).subscribe(async (data) =>{
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypt data :............', decrypted); 
        if(decrypted.status){
          // this.router.navigate(['/my-jobs']);
          this.showLoader = false;
        }else{
          this.showLoader = false;
        }
      }
    },async (error) => {
      this.showLoader = false;
    });

    this.getPayment(paymentdetails.charge_id);
  }




  getPayment(charge_id){
    this.showLoader = true;
    // this.changeUserActiveStatus(1);
    let jobData = this.helper.checkForPushData2();
    console.log('saved push data :.........', jobData);
    // let charge_id = jobData.charge_id;

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
            this.router.navigate(['/my-jobs']);
            
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
                  this.showLoader = false;
                  this.router.navigate(['/my-jobs']);
                  // this.updatejobAsCompleted(jobData.job_id);                  
                }else{
                  this.showLoader = false;
                  // let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
                  // toast.present();
                }
              }
            },error => {
              console.log('####### err', error);
              this.showLoader = false;
            });

        }else {
          this.showLoader = false;
          // let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
          // toast.present();
        }
      } 
    }, error => {
      this.showLoader = false;
      console.log('####### err', error);
    });
  }



}
