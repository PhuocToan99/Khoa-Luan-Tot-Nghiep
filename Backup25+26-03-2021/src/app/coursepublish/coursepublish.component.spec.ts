import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursepublishComponent } from './coursepublish.component';

describe('CoursepublishComponent', () => {
  let component: CoursepublishComponent;
  let fixture: ComponentFixture<CoursepublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursepublishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursepublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
