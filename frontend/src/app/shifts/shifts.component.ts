import { Component, Input } from '@angular/core';
import { Shift } from '../services/types';
import { ApiService } from '../services/api.service'

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css',

})
export class ShiftsComponent {
  @Input() shifts!: Shift[]

  private dayMaxTS = 0

  constructor(
    public apiService: ApiService
  ) {}

  bookShift(id: string, i: number): void {
    this.setShiftLoading(i, true)
    
    this.apiService.bookShift(id)
      .subscribe({
        next: (shift: Shift) => {
          this.updateShift(shift, i)
          this.setShiftLoading(i, false)
        },
        error: (e) => {
          console.error(e)
          this.setShiftLoading(i, false)
        }
      })
  }

  cancelShift(id: string, i: number): void {
    this.setShiftLoading(i, true)

    this.apiService.cancelShit(id)
      .subscribe({
        next: (shift: Shift) => {
          this.updateShift(shift,i)
          this.setShiftLoading(i, false)
        },
        error: (e) => {
          console.error(e)
          this.setShiftLoading(i, false)
        }
      })
  }

  private updateShift(shift: Shift, index: number): void {
    this.shifts[index] = shift
  }

  private setShiftLoading(index: number, state: boolean): void {
    this.shifts[index].loading = state
  }

  isNewDay(timestamp: number, index: number): boolean {
    if (index == 0) this.resetTS()
    if (timestamp > this.dayMaxTS) {
      this.dayMaxTS = new Date(timestamp).setHours(23,59,59,999)
      return true
    }  
    return false
  }

  private resetTS(): void {
    this.dayMaxTS = new Date().setHours(23,59,59,999)
  }

  toDate(timestamp: number): string {
		const today = new Date().setHours(23,59,59,999)
		const tomorrow = today + 86400000

		if (today >= timestamp) {
			return "Today"
		}
		if (tomorrow >= timestamp) {
			return "Tomorrow"
		}
		
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  }

  toTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
  }
}
