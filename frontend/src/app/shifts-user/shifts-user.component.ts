import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ShiftsComponent } from '../shifts/shifts.component';
import { Shift } from '../services/types';

@Component({
  selector: 'app-shifts-user',
  standalone: true,
  imports: [ShiftsComponent],
  templateUrl: './shifts-user.component.html',
  styleUrl: './shifts-user.component.css'
})
export class ShiftsUserComponent {
  constructor(
    private apiService: ApiService
  ) {}

  shifts: Shift[] = []

  ngOnInit() {
    this.apiService
      .getShifts()
      .subscribe((shifts) => {
        this.shifts = shifts
    })
  }
}
