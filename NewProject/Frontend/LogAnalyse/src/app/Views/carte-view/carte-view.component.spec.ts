import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteViewComponent } from './carte-view.component';

describe('CarteViewComponent', () => {
  let component: CarteViewComponent;
  let fixture: ComponentFixture<CarteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
