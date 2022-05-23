import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseIpComponent } from './analyse-ip.component';

describe('AnalyseIpComponent', () => {
  let component: AnalyseIpComponent;
  let fixture: ComponentFixture<AnalyseIpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyseIpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyseIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
