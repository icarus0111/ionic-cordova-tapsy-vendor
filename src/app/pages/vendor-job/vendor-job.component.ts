import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from 'src/app/service/api.service';
import { ToasterService } from 'src/app/service/toaster.service';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { Router } from '@angular/router';
// import { Title } from '@angular/platform-browser';
// import { AngularFireAuth } from '@angular/fire/auth';
// ChangeDetectorRef

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

declare var google;

@Component({
  selector: 'app-vendor-job',
  templateUrl: './vendor-job.component.html',
  styleUrls: ['./vendor-job.component.scss'],
})
export class VendorJobComponent implements OnInit, OnDestroy {

  @ViewChild('mapElement', {static: false}) mapNativeElement: ElementRef;
  @ViewChild('autoCompleteInput', {static: false}) inputNativeElement: any;

  // directionsService: any = new google.maps.DirectionsService;
  // directionsDisplay: any = new google.maps.DirectionsRenderer;
  // distanceService: any = new google.maps.DistanceMatrixService;
  directionsService: any;
  directionsDisplay: any;
  distanceService: any;

  latitude: any;
  longitude: any;
  search_location: any;
  showLoader: boolean = false;

  // Firebase Data
  locations: Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
  isTracking: boolean;
  jobProposalData: any;
  vendor: any;
  setIntervalForUpdateLoc: any;
  statusText: string;
  active: boolean = true;
  // showLoader: boolean = false;
  userImage: any = "../assets/images/user_placeholder.png";
  tabActiveStatus: Array<any> = ['true', 'false', 'false','false'];
  time: string;
  jobTimeOut: any;
  map: any;
  marker: any;
  vendorname: any;

  constructor(
    private geolocation: Geolocation, 
    private apiService: ApiService, 
    private toast: ToasterService,
    private helper: HelpermethodsService,
    // private route: Router,
    private afs: AngularFirestore,
    private router: Router,
    private cdr: ChangeDetectorRef
    ) { 

      this.helper.currentMessage.subscribe(data => {
        if(data){
          let msg = JSON.parse(data);
          if(msg.job_come){
            this.router.navigate(['vendor-job']);
            // this.startCountDownForSearchVendor();
            this.getCountDownStartTime();
            this.cdr.detectChanges();
            this.helper.changeMessage('');
          }
          if(msg.job_cancel){
            this.changeUserActiveStatus(1);
            this.helper.changeMessage('');
          }
        }
      });

    }

  ngOnInit() {
    let encryptedData = this.helper.encryptData(this.tabActiveStatus);
    localStorage.setItem('active_status', encryptedData);
  }

  ngOnDestroy(){
    clearInterval(this.setIntervalForUpdateLoc);    
    clearInterval(this.jobTimeOut);
    this.helper.changeMessage('');    
  }

  ionViewWillEnter(){
    // this.helper.removeJobRelatedLocalData();
    localStorage.removeItem('notInHomePage');
    this.checkForActiveState();
    this.getUserData();
  }

  ionViewDidEnter() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.distanceService = new google.maps.DistanceMatrixService;
    this.getCurrentLocation();
  }

  ngAfterViewInit(): void {
    // this.renderInitMapForDirection();
    // this.autoComplete();
    // this.getCurrentLocation();
    // this.getLocationDataAndUpdateMap();
    this.locationUpdateInterval();
    this.updateLocationInfo();        
  }

  ngAfterViewDidLoad() {
    this.cdr.detectChanges();
    clearInterval(this.jobTimeOut);
  }



  // Perform an anonymous login and load data
  getLocationDataAndUpdateMap() {
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
 
      // Update Map marker on every change
      // this.locations.subscribe(locations => {
        // this.updateMap(locations);
        // console.log(' ######### location data ############:................', locations);        
      // });
    // });

      this.startTracking();
      this.getUserData();
  }




  // Use Capacitor to track our geolocation
startTracking() {
  this.isTracking = true;
  let watch = this.geolocation.watchPosition();

  watch.subscribe((data) => {
    // data can be a set of coordinates, or an error (if an error occurred).
    // data.coords.latitude
    // data.coords.longitude
    // console.log('watch data :.............', data); 
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
}



 
// Unsubscribe from the geolocation watch using the initial ID
// stopTracking() {
//   Geolocation.clearWatch({ id: this.watch }).then(() => {
//     this.isTracking = false;
//   });
// }
 
// Save a new location to Firebase and center the map
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
 
// Delete a location from Firebase
// deleteLocation(pos) {
//   this.locationsCollection.doc(pos.id).delete();
// }
 
// Redraw all markers on the map
// updateMap(locations) {
//   // Remove all current marker
//   this.markers.map(marker => marker.setMap(null));
//   this.markers = [];
 
//   for (let loc of locations) {
//     let latLng = new google.maps.LatLng(loc.lat, loc.lng);
 
//     let marker = new google.maps.Marker({
//       map: this.map,
//       animation: google.maps.Animation.DROP,
//       position: latLng
//     });
//     this.markers.push(marker);
//   }
// }



  renderInitMapForDirection() {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 18,
      center: {lat: -33.8688, lng: 151.2093},
      panControl: false,
      streetViewControl: false,      
    });
    // this.directionsDisplay.setMap(map);
  }



  getCurrentLocation() {

    if(this.marker) {
      this.marker.setVisible(false);
    }
    
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      // console.log('location responce data :...............', resp);

      let cus_location = {
        lat: resp.coords.latitude,
        long: resp.coords.longitude,
      }

      localStorage.setItem('LOC_DATA', this.helper.encryptData(cus_location));
      
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      if(!this.map){     

      this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: {
          lat: resp.coords.latitude, 
          lng: resp.coords.longitude
        },
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
      
      
      // this.map = map;
    }

      
      
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };

      const icon = {
        url: 'http://res.cloudinary.com/tapsy/image/upload/v1572870098/u_fzktfv.png', // image url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      };

      this.marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'Tapsy',
        icon: icon
      });

      this.marker.setVisible(true);

      console.log('>>>>>>>>>  marker data : ', this.marker);  
      
      // this.marker.setMap(null);

      const contentString = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h5 id="firstHeading" class="firstHeading">Tapsy</h5>' +
          '<div id="bodyContent">' +
          '<p>Your Location</p>' +
          '</div>' +
          '</div>';


      const infoWindow = new google.maps.InfoWindow;

      infoWindow.setPosition(pos);
      infoWindow.setContent(contentString);
      // infoWindow.open(map, marker);
      this.map.setCenter(pos);
      this.marker.addListener('click', function() {
        infoWindow.open(this.map, this.marker);
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }





  // getCurrentLocation2(map) {
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     // console.log('location responce data :...............', resp);

  //     // let cus_location = {
  //     //   lat: resp.coords.latitude,
  //     //   long: resp.coords.longitude,
  //     // }

  //     // localStorage.setItem('LOC_DATA', this.helper.encryptData(cus_location));
      
  //     this.latitude = resp.coords.latitude;
  //     this.longitude = resp.coords.longitude;

  //     // const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
  //     //   center: {
  //     //     lat: resp.coords.latitude, 
  //     //     lng: resp.coords.longitude
  //     //   },
  //     //   zoom: 18,
  //     //   mapTypeControlOptions: {
  //     //     mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
  //     //   }, // here´s the array of controls
  //     //   disableDefaultUI: true, // a way to quickly hide all controls
  //     //   mapTypeControl: false,
  //     //   fullscreenControlOptions: false,
  //     //   panControl: false,
  //     //   streetViewControl: false,
  //     //   // scaleControl: true,
  //     //   // zoomControl: true,
  //     //   zoomControlOptions: {
  //     //     style: google.maps.ZoomControlStyle.LARGE 
  //     //   },
  //     //   mapTypeId: google.maps.MapTypeId.ROADMAP
  //     // });

  //     this.map = map;
      
  //     const pos = {
  //       lat: this.latitude,
  //       lng: this.longitude
  //     };

  //     const icon = {
  //       url: 'http://res.cloudinary.com/tapsy/image/upload/v1572870098/u_fzktfv.png', // image url
  //       scaledSize: new google.maps.Size(50, 50), // scaled size
  //     };

  //     if (this.marker && this.marker.setMap) {
  //       this.marker.setMap(null);
  //     }

  //     this.marker = new google.maps.Marker({
  //       position: pos,
  //       map: map,
  //       title: 'Tapsy',
  //       icon: icon
  //     });

  //     // const contentString = '<div id="content">' +
  //     //     '<div id="siteNotice">' +
  //     //     '</div>' +
  //     //     '<h5 id="firstHeading" class="firstHeading">Tapsy</h5>' +
  //     //     '<div id="bodyContent">' +
  //     //     '<p>Your Location</p>' +
  //     //     '</div>' +
  //     //     '</div>';


  //     // const infoWindow = new google.maps.InfoWindow;

  //     // infoWindow.setPosition(pos);
  //     // infoWindow.setContent(contentString);
  //     // // infoWindow.open(map, marker);
  //     // map.setCenter(pos);
  //     // marker.addListener('click', function() {
  //     //   infoWindow.open(map, marker);
  //     // });

  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });
  // }






  // autoComplete() {
  //   const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
  //     center: {lat: -33.8688, lng: 151.2093},
  //     zoom: 7
  //   });

  //   const infowindow = new google.maps.InfoWindow();
  //   const infowindowContent = document.getElementById('infowindow-content');

  //   infowindow.setContent(infowindowContent);

  //   const marker = new google.maps.Marker({
  //     map: map,
  //     anchorPoint: new google.maps.Point(0, -29)
  //   });
  //   const autocomplete = new google.maps.places.Autocomplete(this.inputNativeElement.nativeElement as HTMLInputElement);
  //   autocomplete.addListener('place_changed', () => {
  //     infowindow.close();
  //     marker.setVisible(false);
  //     const place = autocomplete.getPlace();

  //     let cus_location = {
  //       lat: place.geometry.location.lat(),
  //       long: place.geometry.location.lng()
  //     }

  //     console.log('place data :................', cus_location); 
  //     localStorage.setItem('LOC_DATA', this.helper.encryptData(cus_location));

  //     if (!place.geometry) {
  //       // User entered the name of a Place that was not suggested and
  //       // pressed the Enter key, or the Place Details request failed.
  //       window.alert('No details available for input: ' + place.name );
  //       return;
  //     }

  //     if (place.geometry.viewport) {
  //       map.fitBounds(place.geometry.viewport);
  //     } else {
  //       map.setCenter(place.geometry.location);
  //       map.setZoom(17);  // Why 17? Because it looks good.
  //     }

  //     marker.setPosition(place.geometry.location);
  //     marker.setVisible(true);
  //     let address = '';
  //     if (place.address_components) {
  //       address = [
  //         (place.address_components[0] && place.address_components[0].short_name || ''),
  //         (place.address_components[1] && place.address_components[1].short_name || ''),
  //         (place.address_components[2] && place.address_components[2].short_name || '')
  //       ].join(' ');
  //     }

  //     if(infowindowContent){
  //       infowindowContent.children['place-icon'].src = place.icon;
  //       infowindowContent.children['place-name'].textContent = place.name;
  //       infowindowContent.children['place-address'].textContent = address;
  //     } 

  //     infowindow.open(map, marker);
  //   });

  // }





  getLocationLatLong() {
    return new Promise((resolve, reject)=> {
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
        // console.log('location responce data :...............', resp);

        if(resp.coords.latitude && resp.coords.longitude) {

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
    });    
  }





  goToVendorSearch() {
    this.router.navigate([`search-vendor`]);
  }





  // getDirection() {
  //   // calculateAndDisplayRoute(formValues) {
  //     console.log('finding direction................');      
  //     const that = this;
  //     this.directionsService.route({
  //       origin: 'sydney',
  //       destination: 'melbourne',
  //       travelMode: 'DRIVING'
  //     }, async (response, status) => {
  //       console.log(response);        
  //       if (status == 'OK') {
  //         this.directionsDisplay.setDirections(response);
  //         this.getDistance(response.request.origin.query, response.request.destination.query);
  //       } else {
  //         let toast = await this.toast.presentToast('Success!', 'Directions request failed due to ' + status, "danger", 5000); 
  //         toast.present();
  //         // window.alert('Directions request failed due to ' + status);
  //       }
  //     });
  //   // }
  // }




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
  // }




  updateLocationInfo() {
    // this.showLoader = true;
    // console.log('updateLocationInfo() called :..........', this.helper.checkForUserData());
    this.getLocationLatLong().then((data: any)=>{   
      
      console.log('updateLocationInfo() location data :...........', data);      

      if(data.lat && data.long){

        let payload = {
          latitude: data.lat,
          longitude: data.long,
          user_id: this.helper.checkForUserData().id
        }

        // console.log('body data :.........', payload);        

        this.apiService.updateConnRow(payload).subscribe(async (data: any) => {
          // console.log('api responce :...........', data); 
          if(data && data.TAP_RES) {
            let decrypted = this.helper.decryptResponceData(data.TAP_RES);
               
            if(decrypted.status){             
              // console.log('######  location updated successfully  ######');  
              console.log('updateLocationInfo() location updated successfully :..............................', decrypted);             
            }
          }     
        });
      }
      // this.showLoader = false;
    }).catch(err => {
      // this.showLoader = false;
    });   
  }





  locationUpdateInterval(){
    this.setIntervalForUpdateLoc = setInterval(() => {
      this.updateLocationInfo();
      this.getCurrentLocation();
      // this.getCurrentLocation2(this.map);
    }, 60000);
  }





  onClickAccept(value) {

    clearInterval(this.jobTimeOut);

    this.showLoader = true;
    let is_accepted; 
    let title; 
    let body; 

    let vendor = this.helper.checkForUserData();
    let pushData = this.helper.checkForPushData2();

    if(value == 1) {
      is_accepted = 'true';
      title = 'Job Status';
      body = 'Your job is accepted by';

      let is_job_going = {
        status: true
      }

      let encryptedData = this.helper.encryptData(is_job_going);
      localStorage.setItem('is_job_going', encryptedData);
      // alert('job accepted');

      if(vendor.name == null){
        vendor.name = '';
      }

      let payload = {
        id: pushData.cus_id,
        additionData: {
          type: 'vendor_answer',
          accepted: is_accepted,
          vendor_id: vendor.id.toString(),
          vendor_name: vendor.name,
          title: title,
          body: body
        } 
      }


      let payloadForUpdateJob = {
        id: pushData.job_id, 
        updateData: {
          vendor_id: vendor.id
        }        
      }

      // let getjobpayload = {
      //   id: pushData.job_id       
      // }

      // console.log('accept push data :..............................', payload);
      // alert('accept push data :..............................'+ JSON.stringify(payload));
      this.getBookingDetails(pushData.job_id).then(async (jobdata: any)=>{
        this.showLoader = true;
        if(jobdata && jobdata.vendor_id == null && jobdata.job_status != 3){

          this.apiService.updateJobTableForVendorId(payloadForUpdateJob).subscribe((data:any)=>{
            if(data && data.TAP_RES) {
              let decrypted = this.helper.decryptResponceData(data.TAP_RES);
              // console.log('decrypted data :..............................', decrypted);
      
              if(decrypted.status) {
                this.showLoader = false;
                // console.log('job table updated successfully.');             
                
                this.apiService.sendPushNotification(payload).subscribe((data: any) =>{
                  // console.log('push send status :.................', data); 
                  if(data && data.TAP_RES) {
                    let decrypted = this.helper.decryptResponceData(data.TAP_RES);
                      console.log('push send status :..............................', decrypted);
                      // alert('notification push done for accept '+ JSON.stringify(decrypted));
                    if(decrypted.status){                  
                      // this.router.navigate(['customer-tracking']);  
                      // alert('push sent success');    
                      if(pushData.isScheduled == 'true'){
                        this.helper.removeJobRelatedLocalData();
                        this.router.navigate(['my-jobs']);
                      }else if(pushData.isScheduled == 'false'){
                        this.router.navigate(['customer-tracking']);
                      }         
                    }else{
                      if(pushData.isScheduled == 'true'){
                        this.helper.removeJobRelatedLocalData();
                        this.router.navigate(['my-jobs']);
                      }else if(pushData.isScheduled == 'false'){
                        this.router.navigate(['customer-tracking']);
                      }
                      // this.router.navigate(['customer-tracking']);
                      // alert('push sent not success'); 
                    }
                    // this.router.navigate(['customer-tracking']);  
                  }  
                }, err => {
                  alert('push sent error');
                })
    
              }else{
                console.log('job table not updated.');
                this.showLoader = false;
              }
              localStorage.removeItem('push_data');
            }
            // this.router.navigate(['customer-tracking']); 
          }, error => {
            localStorage.removeItem('push_data');
          });

        }else{
          localStorage.removeItem('push_data');
          let toast = await this.toast.presentToast('Error!', 'This job is not available now.', "danger", 3000); 
          toast.present();
          this.showLoader = false;
        }
      }).catch(async (err)=>{
        let toast = await this.toast.presentToast('Error!', 'Server not responding', "danger", 3000); 
        toast.present();
        this.showLoader = false;
        this.helper.removeJobRelatedLocalData();
        localStorage.removeItem('push_data');
      });


    } else if(value == 0) {

      is_accepted = 'false';
      title = 'Job Status';
      body = 'Waiting for a positive responce';

      // alert('job rejected');

      if(vendor.name == null){
        vendor.name = '';
      }

      let payload = {
        id: pushData.cus_id,
        additionData: {
          type: 'vendor_answer',
          accepted: is_accepted,
          vendor_id: vendor.id.toString(),
          vendor_name: vendor.name,
          title: title,
          body: body
        } 
      }


      let payloadForUpdateJob = {
        id: pushData.job_id, 
        updateData: {
          cancel_status: 1
        }        
      }

      // let getjobpayload = {
      //   id: pushData.job_id       
      // }

      localStorage.removeItem('push_data');
      
      this.getBookingDetails(pushData.job_id).then(async (jobdata: any)=>{
        if(jobdata && jobdata.vendor_id == null && jobdata.job_status != 3){

          this.apiService.updateJobTableForVendorId(payloadForUpdateJob).subscribe((data:any)=>{
            if(data && data.TAP_RES) {
              let decrypted = this.helper.decryptResponceData(data.TAP_RES);
              // console.log('decrypted data :..............................', decrypted);  
              if(decrypted.status) {
                // alert('job cancelled and table updated with one');
                this.showLoader = false;
              }else{
                console.log('job table not updated.');
                this.showLoader = false;
              }
              localStorage.removeItem('push_data');
            }
            // this.router.navigate(['customer-tracking']); 
          }, error => {
            localStorage.removeItem('push_data');
          });
    
    
          this.apiService.sendPushNotification(payload).subscribe((data: any) =>{
            // console.log('push send status :.................', data); 
            if(data && data.TAP_RES) {
              let decrypted = this.helper.decryptResponceData(data.TAP_RES);
              // console.log('push send status :..............................', decrypted);
              if(decrypted.status){
                // this.router.navigate(['customer-tracking']);
                // alert('notification push done for rejection');
              }
              this.showLoader = false;
              localStorage.removeItem('push_data');
            }  
          }, error => {
            localStorage.removeItem('push_data');
            // alert('notification push ERROR for rejection');
          })

        }else{
          // let toast = await this.toast.presentToast('Error!', 'Job already taken', "danger", 3000); 
          // toast.present();
          this.showLoader = false;
        }
      }).catch(async (err)=>{
        let toast = await this.toast.presentToast('Error!', 'Server not responding', "danger", 3000); 
        toast.present();
        this.showLoader = false;
        this.helper.removeJobRelatedLocalData();
        localStorage.removeItem('push_data');
      });


      

    }

    // let pushData = this.helper.checkForPushData();


    // if(value == 1){

    //   let payloadForUpdateJob = {
    //     id: pushData.job_id, 
    //     updateData: {
    //       vendor_id: vendor.id
    //     }        
    //   }
  
    //   this.apiService.updateJobTableForVendorId(payloadForUpdateJob).subscribe((data:any)=>{
    //     if(data && data.TAP_RES) {
    //       let decrypted = this.helper.decryptResponceData(data.TAP_RES);
    //       console.log('decrypted data :..............................', decrypted);
  
    //       if(decrypted.status) {
    //         this.showLoader = false;
    //         console.log('job table updated successfully.'); 
            
    //         this.apiService.sendPushNotification(payload).subscribe((data: any) =>{
    //           // console.log('push send status :.................', data); 
    //           if(data && data.TAP_RES) {
    //             let decrypted = this.helper.decryptResponceData(data.TAP_RES);
    //               console.log('push send status :..............................', decrypted);
    //               // alert('notification push done for accept');
    //             if(decrypted.status){                  
    //               this.router.navigate(['customer-tracking']);                  
    //             }else{
    //               this.router.navigate(['customer-tracking']);
    //             }
    //           }  
    //         })

    //       }else{
    //         console.log('job table not updated.');
    //         this.showLoader = false;
    //       }
    //       localStorage.removeItem('push_data');
    //     }
    //   }, error => {
    //     localStorage.removeItem('push_data');
    //   });

    // }else if(value == 0) {

    //   this.apiService.sendPushNotification(payload).subscribe((data: any) =>{
    //     // console.log('push send status :.................', data); 
    //     if(data && data.TAP_RES) {
    //       let decrypted = this.helper.decryptResponceData(data.TAP_RES);
    //       // console.log('push send status :..............................', decrypted);
    //       if(decrypted.status){
    //         // this.router.navigate(['customer-tracking']);
    //         // alert('notification push done for rejection');
    //       }
    //       this.showLoader = false;
    //       localStorage.removeItem('push_data');
    //     }  
    //   }, error => {
    //     localStorage.removeItem('push_data');
    //     alert('notification push ERROR for rejection');
    //   })

    // }    

     
  }





  isPushDataPresent() {
    let pushData = this.helper.checkForPushData();
    if(pushData){
      this.jobProposalData = pushData;
      return true;
    }else{
      return false;
    }
  }





  async startCountDownForSearchVendor(timeOutTime: any) {
    // this.router.navigate(['vendor-job']);
    
    this.time = timeOutTime;

    if(parseInt(this.time) < 0){
      let toast = await this.toast.presentToast('Job Alert', 'Sorry, Job is no more available', "primary", 4000);
      toast.present();
      clearInterval(this.jobTimeOut);
      localStorage.removeItem('push_data');
    }

    this.jobTimeOut = setInterval(async ()=>{
      if(parseInt(this.time) > 0) {
        let decresedTime = parseInt(this.time) - 1;
        this.time = decresedTime.toString();
        if(this.time.length == 1){
          this.time = `0${this.time}`;
        }
      }else if(parseInt(this.time) == 0) {
        clearInterval(this.jobTimeOut);
        localStorage.removeItem('push_data');
      }else if(parseInt(this.time) < 0) {
        clearInterval(this.jobTimeOut);
        localStorage.removeItem('push_data');
        let toast = await this.toast.presentToast('Job Alert', 'Sorry, Job is no more available', "primary", 4000);
        toast.present();
      }else{
        clearInterval(this.jobTimeOut);
        localStorage.removeItem('push_data');
        let toast = await this.toast.presentToast('Job Alert', 'Sorry, Job is no more available', "primary", 4000);
        toast.present();
      }
      // console.log(this.time);      
    }, 1000);

  }





  getCountDownStartTime(){
    let datetime: any = this.getStartTime();
    let date = `${datetime.day}/${datetime.month}/${datetime.year}`;
    let now = `${datetime.hour}:${datetime.min}:${datetime.second}`;
    let pushData = this.helper.checkForPushData2();
    let end = pushData.end_time;
    let timeoutSec = this.getDifference(date, now, end);
    this.startCountDownForSearchVendor(timeoutSec);
  }




  getDifference(date, nowTime, end) {
    var timeStart = new Date(date+' '+ nowTime);
    var timeEnd = new Date(date+' '+ end);

    let timeEndMiliSec = timeEnd.getTime();
    let timeStartMiliSec = timeStart.getTime();
    return (timeEndMiliSec - timeStartMiliSec)/1000;
  }





  getStartTime(){
    let date = new Date();
    // let dMnY = helper.getDateFormatDMnY(date);
    let offset = date.getTimezoneOffset() * 60 * 1000;
    let localTime = date.getTime();
    let utcTime = localTime + offset;
    let customOffset = 10;
    let austratia_brisbane = utcTime + (3600000 * customOffset);
    let customDate = new Date(austratia_brisbane);

    let data = {
        day: customDate.getDate(),
        month: customDate.getMonth() + 1,
        year: customDate.getFullYear(),
        hour: customDate.getHours(),
        min: customDate.getMinutes(),
        second: customDate.getSeconds(),
        raw: customDate,
        stringDate: customDate.toString()
    }

    return data;
  }





  // sendNotification(){

  //   let payload = {
  //     vendor_id: 42,
  //     additionData: {
  //       job_type: 'Residential lock change',
  //       cus_id: '123456',
  //       address: 'dfs sdfsdf sdfsdf 12345',
  //       distance: '21 kms'
  //     } 
  //   }

  //   this.apiService.sendPushNotification(payload).subscribe((data)=>{
  //     console.log('push send status :.................', data);      
  //   })
  // }





  getUserData() {
    this.vendor = this.helper.checkForUserData();
    console.log(this.vendor); 
    if(this.vendor.name){
      this.vendorname = this.vendor.name.split(' ')[0]; 
    }      
  }






  onChangeActiveState(event){
    // console.log(event);  
    if(!this.active){
      // this.statusText = 'ON'; 
      // this.active = true;
      // alert('sending '+ 1);
      this.changeUserActiveStatus(1);           
    }else if(this.active){
      // this.statusText = 'OFF';
      // this.active = false;
      // alert('sending '+ 0);
      this.changeUserActiveStatus(0);      
    }  
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
            this.checkForActiveState();
            this.showLoader = false;
          }else{
            // let toast = await this.toast.presentToast('Error!', decrypted.msg, "danger", 5000); 
            // toast.present();
            this.showLoader = false;
          }
        }
    }, async error => {
      // let toast = await this.toast.presentToast('Error!', 'Server not responding. Please try again.', "danger", 5000); 
      // toast.present();
      console.log('error : ', error);
      this.showLoader = false;      
    })
  }





  getActiveStatus(){

    let payload = {
      id : this.helper.checkForUserData().id,
    }

    this.apiService.addVendorById(payload).subscribe((data:any)=>{
        if(data && data.TAP_RES) {
          let decrypted = this.helper.decryptResponceData(data.TAP_RES);
          if(decrypted.status){
            this.showLoader = false;
          }else{
            this.showLoader = false;
          }
        }
    }, error => {
      console.log(error);      
    })
  }






  checkForActiveState(){

    this.showLoader = true;
    let payload = {
      id : this.helper.checkForUserData().id
    }
    
    console.log('checkForActiveState() payload :..............................', payload);
    this.apiService.addVendorById(payload).subscribe((data: any) => {
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('checkForActiveState() data :..............................', decrypted);
        if(decrypted.status){
          // this.router.navigate(['customer-tracking']);
          if(decrypted.data && decrypted.data.length > 0){
            // console.log('check status :......', decrypted.data[0]);            
            if(decrypted.data[0].is_available == 1){
              this.statusText = 'ON';
              this.active = true;
              this.showLoader = false;
              this.cdr.detectChanges();
            }else if(decrypted.data[0].is_available == 0){
              this.statusText = 'OFF';
              this.active = false;
              this.showLoader = false;
              this.cdr.detectChanges();
            }else{
              localStorage.removeItem('user_data');
              this.router.navigate(['/login']);
              this.showLoader = false;
            }            
          }else{
            localStorage.removeItem('user_data');
            this.router.navigate(['/login']);
            this.showLoader = false;
          }
        }
      } 
    }, error => {
      localStorage.removeItem('user_data');
      this.router.navigate(['/login']);
      this.showLoader = false;
      console.log(error);      
    })
  }








  getBookingDetails(id) {
    this.showLoader = true;

    let payload = {
      id: parseInt(id)
    }

    return new Promise((resolve, reject) => {
      this.apiService.getBookingDetails(payload).subscribe(async (data: any) => {
        if(data && data.TAP_RES) {
          let decrypted = this.helper.decryptResponceData(data.TAP_RES);
  
          if(decrypted.status) {  
            console.log('job data >>>>>>> : ', decrypted);            
            resolve(decrypted.data[0]);
          } else {
            reject();
          }
        } 
      }, async (error) =>{
        reject(error);
      })
    });    
  }





}
