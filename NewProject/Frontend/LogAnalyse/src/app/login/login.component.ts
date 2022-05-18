import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private rooter:Router) { }

  ngOnInit(): void {
  }

  submitRegister(){
    console.log("in submitRegister ");
    this.rooter.navigateByUrl("/register");
  }

  submitLogin(){

  }

}
