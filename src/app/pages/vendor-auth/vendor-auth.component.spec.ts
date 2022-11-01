import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAuthComponent } from './vendor-auth.component';

describe('VendorAuthComponent', () => {
  let component: VendorAuthComponent;
  let fixture: ComponentFixture<VendorAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAuthComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
