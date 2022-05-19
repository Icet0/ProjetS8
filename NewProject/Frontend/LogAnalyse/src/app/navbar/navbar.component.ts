import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router,private envServiceService:CookieService) { }

  ngOnInit(): void {
  }
  deconnexion(){
    this.envServiceService.deleteAll();
    this.router.navigateByUrl('/login');
  }
}
