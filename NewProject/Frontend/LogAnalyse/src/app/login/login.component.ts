import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MessageService} from "../message/message.service";
import {CookieService} from "ngx-cookie-service";
import {EnvServiceService} from "../env/env-service.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {
  login= "" ;
  password="";
  errorMessage="";
  loginEnv!:string;
  constructor(private http:HttpClient,private message:MessageService,private router:Router,private envServiceService:CookieService) {
    this.envServiceService=envServiceService;
  }

  ngOnInit(): void {

  }

  submitRegister(){
    this.router.navigateByUrl("/register");
  }


  submitLogin():void{
    if(this.login==""){
      this.errorMessage= " Veuillez saisir votre login ";
    }
    else if(this.password == ""){
      this.errorMessage = " Veuillez saisir votre mot de passe ";
    }
    else{
      this.errorMessage = "";
    }
    let tmp = {login:this.login,pwd:this.password};
    this.message.sendMessage("/authenticate",tmp).subscribe(
      (phpData)=>{
        console.log(phpData);
        if(phpData.data){
          console.log('données : '+this.login);
          this.envServiceService.set("loginCookie",this.login);
          this.router.navigateByUrl('/');
        }
        else {
          console.log('données : '+phpData.data['reason']);
        }
      })
  }

}
