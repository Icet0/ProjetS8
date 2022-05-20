import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDecoComponent } from './navbar-deco.component';

describe('NavbarDecoComponent', () => {
  let component: NavbarDecoComponent;
  let fixture: ComponentFixture<NavbarDecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarDecoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarDecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
