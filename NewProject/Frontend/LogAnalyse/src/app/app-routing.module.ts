import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VisualisationComponent} from "./visualisation/visualisation.component";
import {AffluenceComponent} from "./affluence/affluence/affluence.component";
import {VisualisationSiteqComponent} from "./visualisation-siteq/visualisation-siteq.component";
import {CarteWidgetComponent} from "./Widgets/carte-widget/carte-widget.component";
import {CarteViewComponent} from "./Views/carte-view/carte-view.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";

import {RechercheSiteComponent} from "./Widgets/recherche-site/recherche-site.component";
import {AuthGuardService} from "./Service/authGuard/auth-guard.service";
const routes: Routes = [

  // {path: '',redirectTo:"/login",pathMatch:'full'},//A voir si on
  {path: 'visualisation', component:VisualisationComponent,canActivate: [AuthGuardService]},
  {path: 'carte', component:CarteViewComponent,canActivate: [AuthGuardService]},
  {path: 'affluence', component:AffluenceComponent,canActivate: [AuthGuardService]},
  {path: 'visualisation/site', component:VisualisationSiteqComponent,canActivate: [AuthGuardService]},
  {path: 'register', component:RegisterComponent,},
  {path: 'login', component:LoginComponent},
  // {path: 'recherche',component:RechercheSiteComponent},


];

export const appRoutingProviders: any[] = [
  AuthGuardService
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
