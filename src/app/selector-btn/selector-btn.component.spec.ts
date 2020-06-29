import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorBtnComponent } from './selector-btn.component';

describe('SelectorBtnComponent', () => {
  let component: SelectorBtnComponent;
  let fixture: ComponentFixture<SelectorBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
