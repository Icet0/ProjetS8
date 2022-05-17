import {Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";


export interface ImplRecherche {
  _funcDeclancherOnClick():void;
  _funcDeclancherOnEnter():void;
  _filter(value: string):string[];
}



@Component({
  selector: 'app-recherche-site',
  templateUrl: './recherche-site.component.html',
  styleUrls: ['./recherche-site.component.scss']
})
export class RechercheSiteComponent implements OnInit, OnChanges{
  @Input() siteWebList!: string[];
  @Input() myControl = new FormControl();
  @Input() filteredOptions!: Observable<string[]>;
  @Input() selectChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() implRechercheFunctions!: ImplRecherche;

  constructor() {
  }

  ngOnInit(): void {

    console.log("ON init recherche site component");
    // this._func= new Function();
    console.log(this.siteWebList);

  }

  public _onClick(){
    try {

      this.implRechercheFunctions._funcDeclancherOnClick();
      console.log("dans le try onClick");
    }catch (e) {
      console.log("dans recherche site component _Onclick Error",e);
    }
  }


  public _onEnter(){

    try {

      this.implRechercheFunctions._funcDeclancherOnEnter();
      console.log("dans le try onEnter");
    }catch (e) {
      console.log("dans recherche site component _onEnter Error",e);
    }
  }



  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    //
    // return this.siteWebList.filter(siteWebList => siteWebList.toLowerCase().includes(filterValue));
    return this.implRechercheFunctions._filter(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    setTimeout(() => {
      // this.siteWebList=changes["siteWebList"].currentValue;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );
    });
  }

}
