import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
import { FcmService } from 'src/app/service/fcm.service';
import { ToasterService } from 'src/app/service/toaster.service';
import { HelpermethodsService } from './service/helpermethods.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { RouteGuard } from './guard/route.guard';
import { ApiService } from './service/api.service';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  // options: PushOptions = {
  //   android: {},
  //   ios: {
  //       alert: 'true',
  //       badge: true,
  //       sound: 'true'
  //   },
  //   windows: {},
  //   browser: {
  //       pushServiceURL: 'http://push.api.phonegap.com/v1/push'
  //   }
  // }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FCM,
    private router: Router,
    private fcmServ: FcmService,
    private toast: ToasterService,
    private helper: HelpermethodsService,
    private diagnostic: Diagnostic,
    private guard: RouteGuard,
    private apiService: ApiService,
    // private push: Push
  ) {
    this.initializeApp();
  }


  ngOnInit() {
    this.checkForUserLoginStatus();
  }




  ionViewWillEnter() {
    this.checkForUserLoginStatus();
  }

  

  initializeApp() {
    this.platform.ready().then(() => {

      // this.platform.resume.subscribe(() => {
      //   console.log(">>>>>>>>>>>>>>>>>>>>>herererere"); 
      //   this.notificationInit();       
      // })
      
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
          // console.log('hello');
        }, false);
      });
      
      this.statusBar.styleDefault();

      setTimeout(() => {
        this.splashScreen.hide();
      }, 5000);
      
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);
      // set status bar to white
      // this.statusBar.backgroundColorByHexString('#000');
      // this.getToken();



      this.fcm.onTokenRefresh().subscribe(async(token) => {
        // alert('refresh token '+ token);
        await this.fcmServ.saveTokenToDB(token);
      });
      
      this.notificationInit();

      this.grantPermission();

    });
  }





  checkForUserLoginStatus() {
    if(this.guard.checkForUserData()) {
      this.router.navigate(['vendor-job']);
    }
  }






  notificationInit() {
    console.log('notificationInit() called....');    
    this.fcm.onNotification().subscribe(async (data) => {
      console.log(data);
      // console.log('Received in background');          
      if (data.wasTapped) {
        // alert('on notification '+ JSON.stringify(data));
        // console.log('push notification data :.....', data);
        if(data.type === 'order_proposal') {
          let encryptedData = this.helper.encryptData(data);          
          localStorage.setItem('push_data', encryptedData);
          localStorage.setItem('push_data2', encryptedData);
          this.router.navigate(['vendor-job']);
          this.helper.changeMessage(JSON.stringify({job_come: true}));
        }
        
        if(data.type === 'approve_job'){
          let encryptedData = this.helper.encryptData(data);          
          localStorage.setItem('approve_job_data', encryptedData);
          this.router.navigate(['congrats']);
          this.helper.changeMessage(JSON.stringify({job_approved: true}));
        }  
        
        if(data.type === 'job_cancel'){ 
          this.changeUserActiveStatus(1);           
          localStorage.removeItem('approve_job_data');
          this.router.navigate(['/vendor-job']);
          this.helper.removeJobRelatedLocalData();
          this.helper.changeMessage(JSON.stringify({job_cancel: true}));
        }

        let toast = await this.toast.presentToast(data.title, data.body, "primary", 4000);
        toast.present();                    
        
      } else {
        // console.log('Received in foreground');
        // alert('on notification '+ JSON.stringify(data));
        console.log('push notification data :.....', data);
        // alert('push notification data :.....'+ data); 

        if(data.type === 'order_proposal'){
          // alert('push notification data :.....'+ JSON.stringify(data));
          let encryptedData = this.helper.encryptData(data);          
          localStorage.setItem('push_data', encryptedData);
          localStorage.setItem('push_data2', encryptedData);
          this.router.navigate(['vendor-job']);
          this.helper.changeMessage(JSON.stringify({job_come: true}));
        }
        if(data.type === 'approve_job'){
          let encryptedData = this.helper.encryptData(data);          
          localStorage.setItem('approve_job_data', encryptedData);
          this.router.navigate(['congrats']);
        }
        if(data.type === 'job_cancel'){   
          this.changeUserActiveStatus(1);           
          localStorage.removeItem('approve_job_data');
          this.router.navigate(['/vendor-job']);
          this.helper.removeJobRelatedLocalData();
          this.helper.changeMessage(JSON.stringify({job_cancel: true}));
        }
        let toast = await this.toast.presentToast(data.title, data.body, "primary", 4000);
        toast.present();
        // this.router.navigate(['category']);          
      }
    });
  }






  grantPermission() {  
    this.diagnostic.isRemoteNotificationsEnabled().then(authorized => {
      // console.log('push is ' + (authorized ? 'authorized' :   'unauthorized'));
     if (!authorized) {
           // location is not authorized
        this.diagnostic.requestRemoteNotificationsAuthorization().then((status) => {
          switch (status) {
            case this.diagnostic.permissionStatus.NOT_REQUESTED:
                  // console.log('Permission not requested');
                  break;
            case this.diagnostic.permissionStatus.GRANTED:
                  // console.log('Permission granted');
                  break;
            case this.diagnostic.permissionStatus.DENIED:
                  // console.log('Permission denied');
                  break;
            case this.diagnostic.permissionStatus.DENIED_ALWAYS:
                  // console.log('Permission permanently denied');
                  break;
          }
        }).catch(error => {
            console.log(error);
        });
    }
  }).catch(err => {
            console.log(err);
    });




  this.diagnostic.isCameraAuthorized()
  .then(authorized => {
    // console.log('Camera is ' + (authorized ? 'authorized' :   'unauthorized'));
   if (!authorized) {
         // location is not authorized
      this.diagnostic.requestCameraAuthorization().then((status) => {
        switch (status) {
        case this.diagnostic.permissionStatus.NOT_REQUESTED:
              // console.log('Permission not requested');
              break;
        case this.diagnostic.permissionStatus.GRANTED:
              // console.log('Permission granted');
              break;
        case this.diagnostic.permissionStatus.DENIED:
              // console.log('Permission denied');
              break;
        case this.diagnostic.permissionStatus.DENIED_ALWAYS:
              // console.log('Permission permanently denied');
              break;
          }
      }).catch(error => {
              // console.log(error);
            });
          }
  }).catch(err => {
    // console.log(err);
  });






  this.diagnostic.isLocationEnabled().then(authorized => {
          // console.log('Location is ' + (authorized ? 'authorized' :   'unauthorized'));
         if (!authorized) {
               // location is not authorized
            this.diagnostic.requestLocationAuthorization().then((status) => {
              switch (status) {
                case this.diagnostic.permissionStatus.NOT_REQUESTED:
                      // console.log('Permission not requested');
                      break;
                case this.diagnostic.permissionStatus.GRANTED:
                      // console.log('Permission granted');
                      break;
                case this.diagnostic.permissionStatus.DENIED:
                      // console.log('Permission denied');
                      break;
                case this.diagnostic.permissionStatus.DENIED_ALWAYS:
                      // console.log('Permission permanently denied');
                      break;
              }
            }).catch(error => {
                // console.log(error);
            });
        }
  }).catch(err => {
    // console.log(err);
  });





         // to check if we have permission
        //  this.push.hasPermission()
        //  .then((res: any) => {
 
        //    if (!res.isEnabled) {
        //      // console.log('We did't have permission to send push notifications');
        //      const pushObject: PushObject = this.push.init(this.options);
        //     //  pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
        //    }
        //  });
  }






  changeUserActiveStatus(value){
    console.log('user active called after job cancel :..............');
    
    let payload = {
      id: this.helper.checkForUserData().id,
      updateData : {
        is_available: value
      }
    }

    console.log('payload : ', payload);    

    this.apiService.updateUser(payload).subscribe(async (data:any) => {
        if(data && data.TAP_RES) {
          let decrypted = this.helper.decryptResponceData(data.TAP_RES);
          if(decrypted.status){
            // let toast = await this.toast.presentToast('Success!', decrypted.msg, "success", 5000); 
            // toast.present();
            // this.checkForActiveState();
            // this.showLoader = false;
            console.log('user active called after job cancel success :..............');
          }else{
            // let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
            // toast.present();
            console.log('user active called after job cancel failed :..............');
            // this.showLoader = false;
          }
        }
    }, async error => {
      // let toast = await this.toast.presentToast('Error!', 'Something went wrong. Please try again.', "danger", 5000); 
      // toast.present();
      console.log('error : ', error);
      // this.showLoader = false;      
    })
  }





}
