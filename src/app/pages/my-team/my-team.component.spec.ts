import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTeamComponent } from './my-team.component';

describe('MyTeamComponent', () => {
  let component: MyTeamComponent;
  let fixture: ComponentFixture<MyTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTeamComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
