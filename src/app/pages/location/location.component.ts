import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from 'src/app/service/api.service';
import { ToasterService } from 'src/app/service/toaster.service';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
declare var google;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {

  @ViewChild('mapElement', {static: true}) mapNativeElement: ElementRef;
  @ViewChild('autoCompleteInput', {static: true}) inputNativeElement: any;

  directionsService: any = new google.maps.DirectionsService;
  directionsDisplay: any = new google.maps.DirectionsRenderer;
  distanceService: any = new google.maps.DistanceMatrixService;

  latitude: any;
  longitude: any;
  search_location: any;
  showLoader: boolean = false;

  constructor(
    private geolocation: Geolocation, 
    private apiService: ApiService, 
    private toast: ToasterService,
    private helper: HelpermethodsService,
    private route: Router,
    ) { }

  ngOnInit() {}

  ngAfterViewInit(): void {

    // this.renderInitMapForDirection();
    this.autoComplete();
    // this.locationUpdateInterval();
  }



  renderInitMapForDirection() {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 7,
      center: {lat: -33.8688, lng: 151.2093}
    });
    this.directionsDisplay.setMap(map);
  }



  getCurrentLocation() {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      console.log('location responce data :...............', resp);

      let cus_location = {
        lat: resp.coords.latitude,
        long: resp.coords.longitude,
      }

      localStorage.setItem('LOC_DATA', this.helper.encryptData(cus_location));
      
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: {
          lat: -33.8688, 
          lng: 151.2093
        },
        zoom: 7
      });
      
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };

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

      infoWindow.setPosition(pos);
      infoWindow.setContent(contentString);
      // infoWindow.open(map, marker);
      map.setCenter(pos);
      marker.addListener('click', function() {
        infoWindow.open(map, marker);
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }






  autoComplete() {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      center: {lat: -33.8688, lng: 151.2093},
      zoom: 7
    });

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById('infowindow-content');

    infowindow.setContent(infowindowContent);

    const marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    const autocomplete = new google.maps.places.Autocomplete(this.inputNativeElement.nativeElement as HTMLInputElement);
    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();

      let cus_location = {
        lat: place.geometry.location.lat(),
        long: place.geometry.location.lng()
      }

      console.log('place data :................', cus_location); 
      localStorage.setItem('LOC_DATA', this.helper.encryptData(cus_location));

      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert('No details available for input: ' + place.name );
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      let address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      if(infowindowContent){
        infowindowContent.children['place-icon'].src = place.icon;
        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent = address;
      } 

      infowindow.open(map, marker);
    });

  }





  getLocationLatLong() {
    return new Promise((resolve, reject)=> {
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
        console.log('location responce data :...............', resp);

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
    this.route.navigate([`search-vendor`]);
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
    console.log('updateLocationInfo() called :..........', this.helper.checkForUserData());
    this.getLocationLatLong().then((data: any)=>{   
      
      console.log('location data :...........', data);      

      if(data.lat && data.long){

        let payload = {
          latitude: data.lat,
          longitude: data.long,
          user_id: this.helper.checkForUserData().id
        }

        console.log('body data :.........', payload);        

        this.apiService.updateConnRow(payload).subscribe(async (data: any) => {
          // console.log('api responce :...........', data); 
          if(data && data.TAP_RES) {
            let decrypted = this.helper.decryptResponceData(data.TAP_RES);
            // console.log('decrypted data :..............................', decrypted);    
            if(decrypted.status){             
              console.log('######  location updated successfully  ######');              
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
    setInterval(() => {
      this.updateLocationInfo();
    }, 30000);
  }





  onClickAccept(value){
    let pushData = this.helper.checkForPushData();
    let userData = this.helper.checkForUserData();

    let is_accepted; 
    let title; 
    let body; 

    if(value == 1){
      is_accepted = 'true';
      title = 'Job Status';
      body = 'Your job is accepted by';
      this.updateJobTableByJobId(pushData.job_id, userData.id);
    }else if(value == 0){
      is_accepted = 'false';
      title = 'Job Status';
      body = 'Waiting for a positive responce';
    }

    

    let payload = {
      id: pushData.cus_id,
      additionData: {
        type: 'vendor_answer',
        accepted: is_accepted,
        vendor_id: userData.id,
        title: title,
        body: body
      } 
    }

    this.apiService.sendPushNotification(payload).subscribe((data: any) =>{
      // console.log('push send status :.................', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('push send status :..............................', decrypted);
      }  
    })

  }





  updateJobTableByJobId(id, vendor_id) {

    let payload = {
      id, 
      vendor_id
    }

    this.apiService.updateJobTableForVendorId(payload).subscribe((data:any)=>{
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          console.log('job table updated successfully.');          
        }else{
          console.log('job table not updated.');
        }

      }
    });
  }





  isPushDataPresent() {
    let pushData = this.helper.checkForPushData();
    if(pushData){
      return true;
    }else{
      return false;
    }
  }





  sendNotification(){

    let payload = {
      vendor_id: 42,
      additionData: {
        job_type: 'Residential lock change',
        cus_id: '123456',
        address: 'dfs sdfsdf sdfsdf 12345',
        distance: '21 kms'
      } 
    }

    this.apiService.sendPushNotification(payload).subscribe((data)=>{
      console.log('push send status :.................', data);      
    })
  }


  

}
