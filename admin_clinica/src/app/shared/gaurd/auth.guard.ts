import { Injectable } from '@angular/core';
import {

  CanActivate,
  Router,

  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { routes } from '../routes/routes';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
//~ core-routing.module.ts ahi lo utilizamos
export class AuthGuard implements CanActivate {
  constructor(private router: Router, public auth: AuthService) {}
  canActivate(

  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      // if (localStorage.getItem('authenticated')) {
      //   return true;
      // } else {
      //   this.router.navigate([routes.login]);
      //   return false;
      // }
      if (!this.auth.token || !this.auth.user){
        this.router.navigate([routes.login]);
        return false;
      }
      let token = this.auth.token;
      // en el primer . viene el payload... -- header y footer
      let expiration = ( JSON.parse( atob(token.split(".")[1]) ) ).exp; // tiempo de expiracion
      if (Math.floor( (new Date().getTime()) / 1000) >= expiration ) {
        this.auth.logout();
        return false;
      }
      return true;
  }
}
