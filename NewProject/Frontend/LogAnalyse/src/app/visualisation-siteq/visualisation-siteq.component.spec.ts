import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisationSiteqComponent } from './visualisation-siteq.component';

describe('VisualisationSiteqComponent', () => {
  let component: VisualisationSiteqComponent;
  let fixture: ComponentFixture<VisualisationSiteqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualisationSiteqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualisationSiteqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
