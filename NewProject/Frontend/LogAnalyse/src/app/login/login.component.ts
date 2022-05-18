import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MessageService} from "../message/message.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login= "" ;
  password="";
  errorMessage="";
  constructor(private http:HttpClient,private message:MessageService,private router:Router) { }

  ngOnInit(): void {
  }

  submitRegister(){
    console.log("in submitRegister ");
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
    let tmp = {username:this.login,password:this.password};
    this.message.sendMessage("/authentification",tmp).subscribe(
      (phpData)=>{
        if(phpData.status == 'OK'){
          console.log('données : '+phpData.data['login']);
          this.router.navigateByUrl('/');
        }
        else {
          console.log('données : '+phpData.data['reason']);
        }
      })
  }

}
