import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffluenceComponent } from './affluence.component';

describe('AffluenceComponent', () => {
  let component: AffluenceComponent;
  let fixture: ComponentFixture<AffluenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffluenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffluenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
