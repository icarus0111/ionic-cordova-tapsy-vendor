import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from 'src/app/service/api.service';
import { ToasterService } from 'src/app/service/toaster.service';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { Router } from '@angular/router';
declare var google;

@Component({
  selector: 'app-tracking-vendor',
  templateUrl: './tracking-vendor.component.html',
  styleUrls: ['./tracking-vendor.component.scss'],
})
export class TrackingVendorComponent implements OnInit {

  @ViewChild('mapElement', {static: true}) mapNativeElement: ElementRef;

  directionsService: any = new google.maps.DirectionsService;
  directionsDisplay: any = new google.maps.DirectionsRenderer;
  distanceService: any = new google.maps.DistanceMatrixService;

  latitude: any;
  longitude: any;

  constructor(
    private geolocation: Geolocation, 
    private helper: HelpermethodsService,
    private route: Router,
    private toast: ToasterService,
  ) { 
    
  }

  ngOnInit() {
    this.renderInitMapForDirection();
  }


  renderInitMapForDirection() {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 7,
      center: {lat: -33.8688, lng: 151.2093}
    });
    this.directionsDisplay.setMap(map);
    this.getDirection();
  }


  getDirection() {
    // calculateAndDisplayRoute(formValues) {
      console.log('finding direction................');      
      const that = this;
      this.directionsService.route({
        origin: 'sydney',
        destination: 'melbourne',
        travelMode: 'DRIVING'
      }, async (response, status) => {
        console.log(response);        
        if (status == 'OK') {
          this.directionsDisplay.setDirections(response);
          this.getDistance(response.request.origin.query, response.request.destination.query);
        } else {
          let toast = await this.toast.presentToast('Success!', 'Directions request failed due to ' + status, "danger", 5000); 
          toast.present();
          // window.alert('Directions request failed due to ' + status);
        }
      });
    // }
  }




  getDistance(source, destination) {
    // this.distanceService.
    // var origin1 = new google.maps.LatLng(55.930385, -3.118425);
    this.distanceService.getDistanceMatrix({
      origins: [source],
      destinations: [destination],
      travelMode: 'DRIVING'
    }, async (response, status) => {
      console.log('#########  Distance  #########', response);

      let toast = await this.toast.presentToast('Success!', 'Distance calculated successfully ' + response.rows[0].elements[0].distance.text, "success", 5000); 
      toast.present(); 

      // if (status == 'OK') {
      //   that.directionsDisplay.setDirections(response);
      //   this.getDistance(response.geocoded_waypoints[0].place_id, response.geocoded_waypoints[1].place_id);
      // } else {
      //   window.alert('Directions request failed due to ' + status);
      // }
    });
  }

}
