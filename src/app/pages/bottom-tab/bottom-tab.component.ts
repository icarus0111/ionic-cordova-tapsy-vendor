import { Component, OnInit } from '@angular/core';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-tab',
  templateUrl: './bottom-tab.component.html',
  styleUrls: ['./bottom-tab.component.scss'],
})
export class BottomTabComponent implements OnInit {

  tabActiveStatus: Array<any> = ['true', 'false', 'false','false'];
  number: any;

  constructor(
    private helper: HelpermethodsService,
    private router: Router,
  ) { }

  ngOnInit() {}



  onClickBottomTab(num) {
    this.number = num;
    
    // this.tabActiveStatus = ['false', 'false', 'false','false'];
    this.tabActiveStatus.forEach((data, index) =>{
      if(index == num){
        this.tabActiveStatus[index] = 'true';
      }else{
        this.tabActiveStatus[index] = 'false';
      }
    })  
    
    let encryptedData = this.helper.encryptData(this.tabActiveStatus);
    localStorage.setItem('active_status', encryptedData);
    let istracking = localStorage.getItem('istrackstarted');
    let pushData = this.helper.checkForPushData2();

    if(num == 0){
      if(istracking){
        if(pushData && pushData.isScheduled == 'false'){
          this.router.navigate(['/customer-tracking']);
        }else{
          this.router.navigate(['/vendor-job']);
        }        
      }else{
        this.router.navigate(['/vendor-job']);
      }
    }
  }

  

  getActiveStatus() {
    // console.log('active data :.........', this.tabActiveStatus);    
    // console.log('number :.........', this.number); 
    let activeStatus = localStorage.getItem('active_status');   
    return this.helper.decryptData(activeStatus);  
  }




  isPushDataPresent() {
    let pushData = this.helper.checkForPushData();
    let notinhome = localStorage.getItem('notInHomePage');
    if(pushData && notinhome){
      // this.jobProposalData = pushData;
      return true;
    }else{
      return false;
    }
  }




  onClickSmallJobRequestPop(){
    this.router.navigate(['vendor-job']);
  }



}
