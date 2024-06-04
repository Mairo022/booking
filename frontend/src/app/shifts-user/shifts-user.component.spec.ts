import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsUserComponent } from './shifts-user.component';

describe('ShiftsUserComponent', () => {
  let component: ShiftsUserComponent;
  let fixture: ComponentFixture<ShiftsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftsUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
