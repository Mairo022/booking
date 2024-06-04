import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsAvailableComponent } from './shifts-available.component';

describe('ShiftsAvailableComponent', () => {
  let component: ShiftsAvailableComponent;
  let fixture: ComponentFixture<ShiftsAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftsAvailableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftsAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
