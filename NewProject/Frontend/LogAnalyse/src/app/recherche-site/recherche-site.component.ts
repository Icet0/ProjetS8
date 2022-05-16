import {Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-recherche-site',
  templateUrl: './recherche-site.component.html',
  styleUrls: ['./recherche-site.component.scss']
})
export class RechercheSiteComponent implements OnInit, OnChanges{

  @Input() myControl = new FormControl();
  @Input() filteredOptions!: Observable<string[]>;
  @Input() selectChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() siteWebList: string[] = ['One', 'Two', 'Three','Four']
  @Input() _func!: Function;
  @Input() _func3!: Function;


  constructor() {
  }

  ngOnInit(): void {

    console.log("ON init recherche site component");
    // this._func= new Function();
    console.log(this.siteWebList);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  public _onClick(){
    try {
      this._func();
      console.log(this._func);
      console.log(this.siteWebList);
      console.log("dans le try onClick");
    }catch (e) {
      console.log("dans recherche site component _Onclick Error",e);
    }
  }


  public _onEnter(){}



  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.siteWebList.filter(siteWebList => siteWebList.toLowerCase().includes(filterValue));
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
