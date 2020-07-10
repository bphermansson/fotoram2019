import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GCalComponent } from './g-cal.component';

describe('GCalComponent', () => {
  let component: GCalComponent;
  let fixture: ComponentFixture<GCalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GCalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
