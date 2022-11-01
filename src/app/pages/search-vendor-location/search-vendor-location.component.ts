import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from 'src/app/service/api.service';
import { ToasterService } from 'src/app/service/toaster.service';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { Router } from '@angular/router';
declare var google;

@Component({
  selector: 'app-search-vendor-location',
  templateUrl: './search-vendor-location.component.html',
  styleUrls: ['./search-vendor-location.component.scss'],
})
export class SearchVendorLocationComponent implements OnInit {

  @ViewChild('mapElement', {static: true}) mapNativeElement: ElementRef;

  latitude: any;
  longitude: any;

  constructor(
    private geolocation: Geolocation, 
    private helper: HelpermethodsService,
    private route: Router,
    private apiService: ApiService

  ) { }

  ngOnInit() {
    this.getCurrentLocation();
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

    // this.sendNotification();
  }






  // sendNotification(){

  //   let payload = {
  //     vendor_id: 43,
  //     additionData: {
  //       customer_name: 'sdfsdf sdfsdf',
  //       id: '123456',
  //       address: 'dfs sdfsdf sdfsdf 12345'
  //     } 
  //   }

  //   this.apiService.sendPushNotification(payload).subscribe((data)=>{
  //     console.log('push send status :.................', data);      
  //   })
  // }





}
