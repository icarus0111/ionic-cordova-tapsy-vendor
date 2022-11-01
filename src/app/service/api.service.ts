import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import {User} from "../model/user.model";
import {Observable} from "rxjs/index";
import {ApiResponse} from "../model/api.response";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  login(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/login`, payload);
  }

  updateUser(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/update`, payload);
  }

  getCategoryList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/category/list`);
  }

  getSubCategoryByCategoryId(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subcategory/getSubCategoryByCategoryId`, payload);
  }

  getServiceBySubCategoryId(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/service/getServiceBySubCategoryId`, payload);
  }

  searchForservice(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/service/searchForservice`, payload);
  }

  getServiceList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/service/list`);
  }

  getDistance(source, destination) : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${source}&destinations=place_id:${destination}&key=AIzaSyAvi8izJBiY5SXocu2gM-UH0cVr6LDpGks`);
  }


  //-------------------------------------------------------------
  // get all state list data  
  //-------------------------------------------------------------
  getAllStateList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/state/list`);
  }


  //-------------------------------------------------------------
  // 
  //-------------------------------------------------------------
  updateConnRow(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/connection/update`, payload);
  }


  addToken(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/connection/update`, payload);
  }


  sendPushNotification(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/sendNotification`, payload);
  }


  updateJobTableForVendorId(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/update`, payload);
  }


  createVendorDetails(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/vendor-details/create`, payload);
  }


  updateVendorDetails(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/vendor-details/update`, payload);
  }


  addEmployeeByCompany(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/vendor/addEmployeeByCompany`, payload);
  }


  addVendorById(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/vendor/getVendorById`, payload);
  }
  

  getEmployeeListByCompanyId(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/vendor/getEmployeeListByCompanyId`, payload);
  }

  // Added on 03-01-2020
  getMyAccountDetail(payload) : Observable<ApiResponse> {
    //console.log(`${environment.baseUrl}/user/get-details`);
    return this.http.post<ApiResponse>(`${environment.baseUrl}/user/get-vendor-details`, payload);
  }

  getStateList() : Observable<ApiResponse> {
    //console.log(`${environment.baseUrl}/user/get-details`);
    return this.http.get<ApiResponse>(`${environment.baseUrl}/state/list`);
  }

  account_upadate(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/update`, payload);
  }

  //-------------------------------------------------------------
  // get all jobs list data for vendor
  //-------------------------------------------------------------
  getAllJobsListByVendor(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/getjobsbyvendor`, payload);
  }



  getPayment(payload) : Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/pay/getPayment`, payload);
  }



  updatePaymentDetails(payload) : Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/payment-details/update`, payload);
  }



  updateJobs(payload) : Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/jobs/update`, payload);
  }

  getBookingDetails(payload) : Observable<ApiResponse> {
    //console.log(`${environment.baseUrl}/user/get-details`);
    console.log('getBookingDetails payload : ', payload);    
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/getjobbyid`, payload);
  }

  getLimitJobsListByUser(payload) : Observable<ApiResponse> {
    //console.log(`${environment.baseUrl}/user/get-details`);
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/getjobsbyvendorwithoffsetlimit`, payload);
  }


  getJobsById(payload) : Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/jobs/getjobbyid`, payload);
  }

  verifyMobile(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/verifymobile`, payload);
  }

  loginWithEmail(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/loginWithEmail`, payload);
  }


  register(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/register`, payload);
  }


}
