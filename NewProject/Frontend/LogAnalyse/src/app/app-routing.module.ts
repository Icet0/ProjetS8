import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VisualisationComponent} from "./visualisation/visualisation.component";
import {CarteComponent} from "./carte/carte.component";
import {AffluenceComponent} from "./affluence/affluence/affluence.component";

const routes: Routes = [
  {path: 'visualisation', component:VisualisationComponent},
  {path: 'carte', component:CarteComponent},
  {path: 'affluence', component:AffluenceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
