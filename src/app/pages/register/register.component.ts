import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpermethodsService } from 'src/app/service/helpermethods.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController } from '@ionic/angular';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  [x: string]: any;
  registerForm: FormGroup;
  
  constructor(
    private route:Router,
    private helper: HelpermethodsService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.initializeForm();
  }



  ionViewWillEnter(){
    console.log('ionViewWillEnter() called on SubCategoryComponent.');
    this.initializeForm();
    this.getServiceDetailsFromLocal();    
  }




  // fileChange(event){
  //   if(event.target.files && event.target.files[0]){
  //     let reader = new FileReader();

  //     reader.onload = (event:any) => {
  //       this.img1 = event.target.result;
  //     }
  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  //     let fileList: FileList = event.target.files;  
  //     let file: File = fileList[0];
  //     console.log(file);
  // }




  location() {
    this.route.navigate(['/location']);
  }




  async getServiceDetailsFromLocal() {
    let localServiceData = localStorage.getItem('service');
    // console.log('local service data :...............', localServiceData);    
    if(localServiceData) {
      this.serviceData = this.helper.decryptData(localServiceData);
      this.title = this.serviceData.name;
      return this.serviceData;
    }
  }





  initializeForm(){
    // window.localStorage.removeItem('token');
    this.registerForm = this.formBuilder.group({
      car_brand: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z ]*$/)])],
      car_model: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      car_manufacturing_year: [null, Validators.compose([Validators.required])],
      registration_number: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(40)])],
      uploaded_image: [null, Validators.compose([])]
    });
  }




  getFormValue() {
    return this.registerForm.value;
  }



  getCustomerFormErrors() {
    return this.registerForm.controls;
  }



  disableSubmitBtn() {
    if(this.registerForm.valid){
      return false;
    }else{
      return true;
    }
  }




  getImage() {
    const options: CameraOptions = {
      quality: 30,
      allowEdit: false,
      destinationType: this.camera.DestinationType.FILE_URI,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(
      imageData => {
        alert('upload image data :...................'+ imageData);        
        this.imageURI = imageData;
        this.imageFileName = imageData
      },
      err => {
        console.log(err);
        // this.presentToast(err);
      }
    );
  }





  onSubmitRegisterForm(){
    console.log('form value :.....................', this.getFormValue());    
    this.route.navigate(['/location']);
  }





  goBack(){
    this.navCtrl.pop();
  }




}
