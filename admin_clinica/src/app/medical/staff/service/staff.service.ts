import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';


//! command: ng g s medical/staff/service/staff --skip-tests

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  listUsers() {
    let headers = new HttpHeaders({ "Authorization": "Bearer "+this.authService.token });
    let URL = URL_SERVICIOS+"/staff";
    return this.http.get(URL, {headers: headers});
  }

  listConfig() {
    let headers = new HttpHeaders({ "Authorization": "Bearer "+this.authService.token });
    let URL = URL_SERVICIOS+"/staff/config";
    return this.http.get(URL, {headers: headers});
  }


}
