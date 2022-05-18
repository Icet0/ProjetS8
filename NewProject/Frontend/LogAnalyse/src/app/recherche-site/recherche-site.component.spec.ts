import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheSiteComponent } from './recherche-site.component';

describe('RechercheSiteComponent', () => {
  let component: RechercheSiteComponent;
  let fixture: ComponentFixture<RechercheSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechercheSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechercheSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
