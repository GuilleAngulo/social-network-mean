import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedComponent } from './received.component';

describe('ReceivedComponent', () => {
  let component: ReceivedComponent;
  let fixture: ComponentFixture<ReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
