import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratsComponent } from './congrats.component';

describe('CongratsComponent', () => {
  let component: CongratsComponent;
  let fixture: ComponentFixture<CongratsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongratsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongratsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
