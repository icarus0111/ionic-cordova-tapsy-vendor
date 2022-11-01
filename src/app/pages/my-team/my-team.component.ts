import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss'],
})
export class MyTeamComponent implements OnInit {

  constructor(private navCtrl: NavController,) { }

  ngOnInit() {}

  goBack(){
    this.navCtrl.pop();
  }

}
