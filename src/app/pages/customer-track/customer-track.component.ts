import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from 'src/app/service/api.service';
import { ToasterService } from 'src/app/service/toaster.service';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CallNumber } from '@ionic-native/call-number/ngx';
declare var google;

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-customer-track',
  templateUrl: './customer-track.component.html',
  styleUrls: ['./customer-track.component.scss'],
})
export class CustomerTrackComponent implements OnInit {

  @ViewChild('mapElement', {static: true}) mapNativeElement: ElementRef;
  @ViewChild('autoCompleteInput', {static: true}) inputNativeElement: any;

  directionsService: any = new google.maps.DirectionsService;
  directionsDisplay: any = new google.maps.DirectionsRenderer({polylineOptions: {
    strokeColor: "blue"
  }});
  distanceService: any = new google.maps.DistanceMatrixService;

  latitude: any;
  longitude: any;
  search_location: any;
  showLoader: boolean = false;

  // Firebase Data
  locations: Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
  isTracking: boolean;
  vendor: any;
  jobProposalData: any;
  updatedLat: number;
  updatedLong: number;
  setFirstDirection: boolean;
  directionInt: any;
  distanceInt: any;
  jobcancelInt: any;
  userImage: any = "../assets/images/user_placeholder.png";
  vendorname: any;

  constructor(
    private geolocation: Geolocation, 
    private apiService: ApiService, 
    private toast: ToasterService,
    private helper: HelpermethodsService,
    private route: Router,
    private afs: AngularFirestore,
    private router: Router,
    private callNumber: CallNumber,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit() {}

  ionViewWillEnter(){
    // this.helper.removeJobRelatedLocalData();
    // this.checkForActiveState();
    this.changeUserActiveStatus(0);
  }

  ngAfterViewInit(): void {
    // this.renderInitMapForDirection();
    this.setMarkerOnCurrentPosition();
    this.getUserData();
  }


  ngAfterViewDidLoad(){
    localStorage.removeItem('push_data');
    this.cdr.detectChanges();
  }



  ngOnDestroy(){
    clearInterval(this.distanceInt);
    clearInterval(this.directionInt);
    clearInterval(this.jobcancelInt);
  }



  




  getDistance(dlt, dlng) {
     console.log('get distance calleddddddddddddddddddddddddddddddddd..........');     
    this.getOriginAndDestinationForTracking(dlt, dlng).then(data => {

      this.distanceService.getDistanceMatrix({
        origins: [data.origin],
        destinations: [data.destination],
        travelMode: 'DRIVING'
      }, async (response, status) => {
        console.log('############ distance... ', response.rows[0].elements);
        // distance: {text: "1 m", value: 0}
        if(response.rows[0].elements && response.rows[0].elements.length > 0){
          let distanceDetails = response.rows[0].elements[0].distance;

          let arr = distanceDetails.text.split(' ');
          let num = arr[0].replace (/,/g, "");
          num = parseInt(num, 10);

          let unit = arr[1].trim();
          
          if(unit == 'm' && num < 30){
            clearInterval(this.distanceInt);
            clearInterval(this.directionInt);
            clearInterval(this.jobcancelInt);
            localStorage.removeItem('istrackstarted');
            this.router.navigate(['started-job']);
          }
        }
        
        })

    }).catch(err => {
      console.log(err);      
    });    
  };




  setMarkerOnCurrentPosition(){
    this.getLocationLocalData().then((data: any) => {

      this.latitude = data.lat;
      this.longitude = data.long;

      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: {lat: data.lat, lng: data.long},
        zoom: 18,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
        }, // here´s the array of controls
        disableDefaultUI: true, // a way to quickly hide all controls
        mapTypeControl: false,
        fullscreenControlOptions: false,
        panControl: false,
        streetViewControl: false,
        // scaleControl: true,
        // zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE 
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      this.latitude = data.lat;
      this.longitude = data.long;

      const pos = {
        lat: data.lat,
        lng: data.long
      };

      const infowindow = new google.maps.InfoWindow();
      const infowindowContent = document.getElementById('infowindow-content');

      infowindow.setContent(infowindowContent);

      const icon = {
        url: 'http://res.cloudinary.com/tapsy/image/upload/v1572870098/u_fzktfv.png', // image url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      };

      const marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Hello World!',
        icon: icon
      });      

      marker.setVisible(true);

      const contentString = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h5 id="firstHeading" class="firstHeading">Tapsy</h5>' +
          '<div id="bodyContent">' +
          '<p>Location Testing</p>' +
          '<p>lorem ipsam</p>' +
          '</div>' +
          '</div>';


      const infoWindow = new google.maps.InfoWindow;

      infoWindow.setPosition(pos, marker);
      infoWindow.setContent(contentString);

      // this.autoComplete(data.lat, data.long);
      // this.getLocationDataAndUpdateMap();
      // this.renderInitMapForDirection();
      // this.getLocationData();
      this.renderInitMapForDirection();
    }).catch(err => {
      console.log(err);      
    })
  }




  getLocation() {
    return new Promise((resolve, reject)=> {
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
        console.log('location responce data :...............', resp);

        if(resp && resp.coords.latitude && resp.coords.longitude){
          let cus_location = {
            lat: resp.coords.latitude,
            long: resp.coords.longitude,
          }
          localStorage.setItem('LOC_DATA', this.helper.encryptData(cus_location));
          resolve(cus_location);
        }  
      }).catch((error) => {
        console.log('Error getting location', error);
        reject(error);
      });
    })    
  }




  getLocationLocalData() {
    return new Promise((resolve, reject)=> {
      let loc_data = this.helper.getLocationData();
      
      if(loc_data && loc_data.lat && loc_data.long) {
        resolve(loc_data);
      }else {
        reject('location data not found');
      }
    }).catch((err)=>{
      console.log('Error getting location', err);
      // reject(err);
    })    
  }



  
  renderInitMapForDirection() {
    console.log('####### render for direction called #######');
    localStorage.setItem('istrackstarted', 'true');

    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 18,
      center: {lat: this.latitude, lng: this.longitude},
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
      }, // here´s the array of controls
      disableDefaultUI: true, // a way to quickly hide all controls
      mapTypeControl: false,
      fullscreenControlOptions: false,
      panControl: false,
      streetViewControl: false,
      // scaleControl: true,
      // zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE 
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.directionsDisplay.setMap(map);
    // this.getDirection();
    this.getLocationData();
  }





  getDirection(dlt, dlng) {
    // calculateAndDisplayRoute(formValues) {
      // console.log('finding direction................');  
      this.getOriginAndDestinationForTracking(dlt, dlng).then(data => {
        this.directionsService.route({
          origin: data.origin,
          destination: data.destination,
          travelMode: 'DRIVING'
        }, async (response, status) => {
          // console.log('direction responce :.........................', response);        
          if (status == 'OK') {
            this.directionsDisplay.setDirections(response);
            this.cdr.detectChanges();
            // this.getDistance(response.request.origin.query, response.request.destination.query);
          } else {
            // let toast = await this.toast.presentToast('Success!', 'Directions request failed due to ' + status, "danger", 5000); 
            // toast.present();
            // window.alert('Directions request failed due to ' + status);
          }
        });
      }).catch(async err =>{
        localStorage.removeItem('istrackstarted');
        this.showLoader = false;
        // await this.toast.showSuccess('Success!', "Sorry, Didn't found any route");
        let toast = await this.toast.presentToast('Error!', "Sorry, Didn't found any route", "danger", 5000); 
        toast.present();
        this.route.navigate(['vendor-job']);
      });    
  }




  // getDistance(source, destination) {
  //   // this.distanceService.
  //   // var origin1 = new google.maps.LatLng(55.930385, -3.118425);
  //   this.distanceService.getDistanceMatrix({
  //     origins: [source],
  //     destinations: [destination],
  //     travelMode: 'DRIVING'
  //   }, async (response, status) => {
  //     console.log('#########  Distance  #########', response);

  //     let toast = await this.toast.presentToast('Success!', 'Distance calculated successfully ' + response.rows[0].elements[0].distance.text, "success", 5000); 
  //     toast.present(); 

  //     // if (status == 'OK') {
  //     //   that.directionsDisplay.setDirections(response);
  //     //   this.getDistance(response.geocoded_waypoints[0].place_id, response.geocoded_waypoints[1].place_id);
  //     // } else {
  //     //   window.alert('Directions request failed due to ' + status);
  //     // }
  //   });
  //   // this.goToPaymentPage();
  // }





  async getOriginAndDestinationForTracking(originLat, originLong){
    let dest = this.helper.checkForPushData2();
    return {
      origin: new google.maps.LatLng(originLat, originLong),
      destination: new google.maps.LatLng(dest.lat, dest.long)
    }
  }






  // getPushDataPresent() {
  //   let pushData = this.helper.checkForPushData();
  //   if(pushData){
  //     return pushData;
  //   }else{
  //     return false;
  //   }
  // }






  // Perform an anonymous login and load data
  // getLocationDataAndUpdateMap() {
  //   // this.afAuth.auth.signInAnonymously().then(res => {
  //     let user_id = this.getAcceptVendorData().id;
  //     alert('accept vendor data :.............'+ JSON.stringify(this.getAcceptVendorData()));
  //     console.log('accept vendor data :.............', this.getAcceptVendorData());
  //     this.locationsCollection = this.afs.collection(
  //       `locations/${user_id}/track`,
  //       ref => ref.orderBy('timestamp', 'desc').limit(1)
  //     );
 
  //     // Make sure we also get the Firebase item ID!
  //     this.locations = this.locationsCollection.snapshotChanges().pipe(
  //       map(actions =>
  //         actions.map((a: any) => {
  //           const data = a.payload.doc.data();
  //           const id = a.payload.doc.id;
  //           return { id, ...data };
  //         })
  //       )
  //     );
 
  //     // Update Map marker on every change
  //     this.locations.subscribe(locations => {
  //       // this.updateMap(locations);
  //       console.log(' ######### location data ############:................', locations);
  //       this.getDirection(locations[0].lat, locations[0].lng);
  //     });
  //   // });

  //   // this.startTracking();
  // }





  startTracking() {
    console.log('########   start tracking......   #######');    
    this.setFirstDirection = true;
    this.isTracking = true;
    let watch = this.geolocation.watchPosition();
  
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      
      // console.log('watch data :.............', data);
       
      this.updatedLat = data.coords.latitude;
      this.updatedLong = data.coords.longitude;

      let cus_location = {
        lat: data.coords.latitude,
        long: data.coords.longitude,
      }

      localStorage.setItem('LOC_DATA', this.helper.encryptData(cus_location));
  
      this.addNewLocation(
        data.coords.latitude,
        data.coords.longitude,
        data.timestamp
      );
      
      
      if(this.setFirstDirection){
        this.getDirection(this.updatedLat, this.updatedLong);
        this.setFirstDirection = false;
      }
      
      
    });
  
    // this.watch = this.geolocation.watchPosition({}, (position, err) => {
    //   if (position) {
    //     this.addNewLocation(
    //       position.coords.latitude,
    //       position.coords.longitude,
    //       position.timestamp
    //     );
    //   }
    // });

    // this.getDirection(this.updatedLat, this.updatedLong);
    this.updatePosition();
  }





  updatePosition() {
    this.directionInt = setInterval(()=>{
      this.getDirection(this.updatedLat, this.updatedLong);
    }, 5000);

    // this.distanceInt = setInterval(()=>{
    //   this.getDistance(this.updatedLat, this.updatedLong);
    // }, 10000);

    this.jobcancelInt = setInterval(()=>{
      this.checkForJobCancel();
    }, 5000);
  }





  addNewLocation(lat, lng, timestamp) {
    this.locationsCollection.add({
      lat,
      lng,
      timestamp
    });
   
    // let position = new google.maps.LatLng(lat, lng);
    // this.map.setCenter(position);
    // this.map.setZoom(5);
  }





  getLocationData() {
    console.log('######  getting location data #######');
    
    // this.afAuth.auth.signInAnonymously().then(res => {
      let user_id = this.helper.checkForUserData().id;
 
      this.locationsCollection = this.afs.collection(
        `locations/${user_id}/track`,
        ref => ref.orderBy('timestamp', 'desc').limit(1)
      );
 
      // Make sure we also get the Firebase item ID!
      this.locations = this.locationsCollection.snapshotChanges().pipe(
        map(actions =>
          actions.map((a: any) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );

    this.startTracking();
  }






  onClickCarIcon(){
    let is_arrived; 
    let title; 
    let body; 

    let vendor = this.helper.checkForUserData().id;

    is_arrived = 'true';
    title = 'Vendor arrived';
    body = 'Vendor is arrived to your door step';

    let is_job_going = {
      status: true
    }

    let encryptedData = this.helper.encryptData(is_job_going);
    localStorage.setItem('is_job_going', encryptedData);

    // let pushData = this.helper.checkForPushData();
    let pushData2 = this.helper.checkForPushData2();
    console.log('push data : ..........', pushData2);

    let payload = {
      id: pushData2.cus_id,
      additionData: {
        type: 'vendor_arrived',
        is_arrived: is_arrived,
        vendor_id: vendor.toString(),
        title: title,
        body: body
      } 
    }

    console.log('push data : ..........', payload);
    

    this.apiService.sendPushNotification(payload).subscribe((data: any) =>{
      // console.log('push send status :.................', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('push send status :..............................', decrypted);
        if(decrypted.status){
          // this.router.navigate(['customer-tracking']);
        }else{

        }
      }  
    })
  }




  getUserData() {
    this.vendor = this.helper.checkForUserData();
    if(this.vendor.name){
      this.vendorname = this.vendor.name.split(' ')[0]; 
    } 
    this.cdr.detectChanges();
  }




  isPushDataPresent() {
    let pushData = this.helper.checkForPushData();
    if(pushData){
      this.jobProposalData = pushData
      return true;
    }else{
      return false;
    }
  }





  onClickCallIcon() {
    let pushData = this.helper.checkForPushData2();

    if(pushData) {
      window.open(`tel:${pushData.cus_phone}`, '_system');
    }
    // this.callNumber.callNumber(this.vendor.phone, true)
    // .then(res => {
    //   console.log('Launched dialer!', res)
    // })
    // .catch(err => 
    //   {console.log('Error launching dialer', err)
    // });
  }




  checkForJobCancel(){

    let payload = {
      id : this.helper.checkForPushData2().job_id
    }

    this.apiService.getJobsById(payload).subscribe((data: any) => {
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('push send status :..............................', decrypted);
        if(decrypted.status){
          // this.router.navigate(['customer-tracking']);
          if(decrypted.data && decrypted.data.length > 0){
            if(decrypted.data[0].job_status == 3){

              clearInterval(this.jobcancelInt);
              clearInterval(this.distanceInt);
              clearInterval(this.directionInt);
            
              this.helper.removeJobRelatedLocalData();
              this.router.navigate(['vendor-job']);
            }
          }
        }
      } 
    }, error => {
      console.log(error);      
    })
  }







  changeUserActiveStatus(value){
    this.showLoader = true;

    let payload = {
      id: this.vendor.id,
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
