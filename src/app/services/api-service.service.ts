import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http:HttpClient) { }

  baseUrl:string = environment.baseUrl + 'api/';

  register(model: any) {
    return this.http.post(this.baseUrl + 'Authentication/register', model);
  }

  resetPassword(model: any) {
    return this.http.post(this.baseUrl + 'Authentication/resetPassword', model);
  }


  login(model: any) {
    return this.http.post<any>(this.baseUrl + 'Authentication/login', model)
    .pipe(
      map((response: any) => {
        const user = response.user;
        localStorage.setItem('token', user.userID + user.email);
        localStorage.setItem('userID', user.userID);
        localStorage.setItem('email', user.email);
        
      })
    );
  }


  getSecurityQuestions():Observable<any>{
    return this.http.get<any>(this.baseUrl+ 'Authentication/getSecurityQuestions');
  }


  getProfileData(id: any) {
    return this.http.get<any>(this.baseUrl + `Authentication/getProfileData?id=${id}`);
  }

  verifyUserWithSecurity(email:any, question:any, ans:any){
    return this.http.get<any>(this.baseUrl + `Authentication/verifyUserWithSecurity?email=${email}&question=${question}&ans=${ans}`);

  }



  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

}
