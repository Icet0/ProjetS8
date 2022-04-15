import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VisualisationComponent} from "./visualisation/visualisation.component";

const routes: Routes = [
  {path: 'visualisation', component:VisualisationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
