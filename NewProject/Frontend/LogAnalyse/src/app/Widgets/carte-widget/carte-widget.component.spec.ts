import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteWidgetComponent } from './carte-widget.component';

describe('CarteWidgetComponent', () => {
  let component: CarteWidgetComponent;
  let fixture: ComponentFixture<CarteWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
