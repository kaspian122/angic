import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderListComponent } from './holder-list.component';

describe('HolderListComponent', () => {
  let component: HolderListComponent;
  let fixture: ComponentFixture<HolderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
