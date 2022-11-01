import { Component, OnInit } from '@angular/core';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { RouteGuard } from 'src/app/guard/route.guard';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
      private helper: HelpermethodsService, 
      private guard: RouteGuard, 
      private router: Router, 
      private geolocation: Geolocation
    ) {
    // this.checkForUserLoginStatus();
   }

  ionViewWillEnter() {
    this.checkForUserLoginStatus();
    // this.getLocation();
  }

  ionViewDidEnter() {
    // this.getLocation();
  }

  ngOnInit() {
    // console.log('Home component');   
    // this.checkForUserLoginStatus(); 
  }


  checkForUserLoginStatus() {
    if(this.guard.checkForUserData()) {
      this.router.navigate(['vendor-job']);
    }
  }


  getLocation() {
    return new Promise((resolve, reject)=>{
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

}
