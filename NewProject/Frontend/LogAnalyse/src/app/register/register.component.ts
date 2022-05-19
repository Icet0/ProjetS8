import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "../message/message.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  login= "" ;
  password="";
  passwordConfirm= "";
  errorMessage="";
  constructor(private http:HttpClient,private message:MessageService,private router:Router,private envServiceService:CookieService) { }

  submitLogin(){
    this.router.navigateByUrl("/login");
  }
  checkPassword(): boolean{
    return this.password == this.passwordConfirm;
  }
  submitRegister(){
    if(this.login==""){
      this.errorMessage= " Veuillez saisir votre login ";
    }
    else if(this.password == ""){
      this.errorMessage = " Veuillez saisir votre mot de passe ";
    }
    else{
      this.errorMessage = "";
      let tmp = {login:this.login,pwd:this.password};
      this.message.sendMessage("/register",tmp).subscribe(
      (phpData)=>{
        console.log(phpData);
        if(phpData.data){
          console.log('données : '+this.login);
          //this.envServiceService.set("loginCookie",this.login);
          this.router.navigateByUrl('/login');
        }
        else {
          console.log('données : '+phpData.data['status']);
          this.errorMessage = phpData.data['status'];
        }
      })
    }
  }
  ngOnInit(): void {
  }

}
