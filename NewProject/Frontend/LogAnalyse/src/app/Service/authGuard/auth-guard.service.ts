import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("in can Activate de AuthGuardService !!");
    if (!this.cookieService.get("loginCookie")) {
      // redirect to some view explaining what happened
      this.router.navigateByUrl('/login');
      return false;
    } else {
      return true;
    }
  }
}
