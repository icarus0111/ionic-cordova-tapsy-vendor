import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from 'src/app/service/api.service';
import { ToasterService } from 'src/app/service/toaster.service';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
declare var google;

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss'],
})
export class CongratsComponent implements OnInit {

  @ViewChild('mapElement', {static: true}) mapNativeElement: ElementRef;
  @ViewChild('autoCompleteInput', {static: true}) inputNativeElement: any;

  directionsService: any = new google.maps.DirectionsService;
  directionsDisplay: any = new google.maps.DirectionsRenderer;
  distanceService: any = new google.maps.DistanceMatrixService;

  latitude: any;
  longitude: any;
  search_location: any;
  showLoader: boolean = false;
  vendor: any;
  jobProposalData: any;

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
    // this.autoComplete();
    // this.locationUpdateInterval();
    this.getCurrentLocation();
    this.getUserData();
  }



  // renderInitMapForDirection() {
  //   const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
  //     zoom: 7,
  //     center: {lat: -33.8688, lng: 151.2093}
  //   });
  //   this.directionsDisplay.setMap(map);
  // }

  getUserData() {
    this.vendor = this.helper.checkForUserData();
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
          lat: resp.coords.latitude, 
          lng: resp.coords.longitude
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





  onClickSayThanks() {
    // console.log('say thanks');    
    this.route.navigate(['vendor-job']);
  }




}
