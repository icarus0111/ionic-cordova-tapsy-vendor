import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SucessComponent } from './sucess.component';

describe('SucessComponent', () => {
  let component: SucessComponent;
  let fixture: ComponentFixture<SucessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucessComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
