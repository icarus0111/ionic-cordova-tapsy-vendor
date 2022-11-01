import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorJobComponent } from './vendor-job.component';

describe('VendorJobComponent', () => {
  let component: VendorJobComponent;
  let fixture: ComponentFixture<VendorJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorJobComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
