import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DidNotParticipateHoldersComponent } from './did-not-participate-holders.component';

describe('DidNotParticipateHoldersComponent', () => {
  let component: DidNotParticipateHoldersComponent;
  let fixture: ComponentFixture<DidNotParticipateHoldersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DidNotParticipateHoldersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidNotParticipateHoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
