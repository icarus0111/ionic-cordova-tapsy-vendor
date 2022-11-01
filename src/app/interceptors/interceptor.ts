import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Injectable} from "@angular/core";
import { HelpermethodsService } from '../service/helpermethods.service';
// import { HelpermethodsService } from 'src/app/service/helpermethods.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private helper: HelpermethodsService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token');
    // console.log('token from local : .........', token);
    if (token) {
      token =  this.helper.decryptData(token);
      // console.log('interceptor token : .........', token);       
      request = request.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      });
    }

    if (request.method.toLowerCase() === 'post') {
        request =  request.clone({
          body: {
              TAP_REQ: this.helper.encryptDataFromRequest(request.body)
          }
        })         
    }
    return next.handle(request);
  }
}