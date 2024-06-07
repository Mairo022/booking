import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ShiftsComponent } from '../shifts/shifts.component';
import { Shift } from '../services/types';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-shifts-user',
  standalone: true,
  imports: [ShiftsComponent, LoadingComponent],
  templateUrl: './shifts-user.component.html',
  styleUrl: './shifts-user.component.css'
})
export class ShiftsUserComponent {
  constructor(
    private apiService: ApiService
  ) {}

  shifts: Shift[] = []
  isDataLoaded = false

  ngOnInit() {
    this.apiService
      .getShifts()
      .subscribe({
        next: (shifts) => {
          this.shifts = this.getSortedBookedShifts(shifts)
          this.setLoaded()
        },
        error: (e) => {
          console.log(e);
          this.setLoaded()
        }
      })
  }

  handleShiftStatusChange(): void {
    this.shifts = this.getBookedShifts(this.shifts)
  }

  private getBookedShifts(shifts: Shift[]): Shift[] {
    return shifts.filter(shift => shift.booked)
  }

  private getSortedBookedShifts(shifts: Shift[]): Shift[] {
    return this
      .getBookedShifts(shifts)
      .sort((a, b) => a.startTime - b.startTime)
  }

  private setLoaded(): void {
    this.isDataLoaded = true
  }
}
