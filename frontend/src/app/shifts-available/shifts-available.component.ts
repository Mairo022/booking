import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ShiftsComponent } from '../shifts/shifts.component';
import { Shift } from '../services/types';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-shifts-available',
  standalone: true,
  imports: [ShiftsComponent, RouterLink, RouterLinkActive, CommonModule, LoadingComponent],
  templateUrl: './shifts-available.component.html',
  styleUrl: './shifts-available.component.css'
})
export class ShiftsAvailableComponent {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  shifts: Shift[] = []
  shiftsProp: Shift[] = []
  locations: Map<string, number> = new Map()
  isDataLoaded = false

  ngOnInit() {
    this.initLoadShifts()
    this.initReactToParameterChanges()
  }

  private initLoadShifts(): void {
    const location = this.route.snapshot.queryParamMap.get("location")

    this.apiService
      .getShifts()
      .subscribe({
        next: (shifts) => {
          const activeShifts = this.getSortedActiveShiftsWithOverlaps(shifts)

          this.shifts = activeShifts
          this.shiftsProp = this.filterShifts("area" as keyof Shift, location, activeShifts)
          this.locations = this.createLocations(activeShifts)

          this.setLoaded()
          if (!location) this.addLocationParameter(this.locations)
        },
        error: (e) => {
          console.log(e);
          this.setLoaded() 
        }
      })
  }

  private initReactToParameterChanges(): void {
    this.route.queryParamMap
      .subscribe(params => {
        const location = params.get("location")
        this.shiftsProp = this.filterShifts("area" as keyof Shift, location)
      })
  }

  handleShiftStatusChange(): void {
    this.shiftsProp = this.setShiftOverlaps(this.shiftsProp)
  }

  private getSortedActiveShiftsWithOverlaps(shifts: Shift[]): Shift[] {
    return this.setShiftOverlaps(this.getSortedActiveShifts(shifts))
  }

  private getSortedActiveShifts(shifts: Shift[]): Shift[] {
    const currentTS = new Date().getTime()
    return shifts
            .sort((a, b) => a.startTime - b.startTime)
            .filter(shift => !shift.booked && shift.startTime > currentTS || shift.booked && shift.endTime > currentTS)
  }

  private setShiftOverlaps(shifts: Shift[]): Shift[] {
    return shifts.map((shift, i) => !shift.booked
        ? this.isShiftOverlapping(i, shifts)
          ? { ...shift, overlapping: true }
          : { ...shift, overlapping: false } 
        : shift)
  }

  private isShiftOverlapping(index: number, shifts: Shift[]): boolean {
    const shift = shifts[index]
    const startTS = shift.startTime
    const endTS = shift.endTime

    const dayInMS = 24 * 3600 * 1000
    const dayAgoTS = new Date(startTS - dayInMS).getTime()
    
    for (let i = index-1; i > -1; i--) {
      const shiftTemp = shifts[i]
      const insideTimeframe = shiftTemp.endTime > startTS
      const isOverlap = insideTimeframe && shiftTemp.booked

      if (isOverlap) return true

      const yesterday = shiftTemp.endTime < dayAgoTS
      if (yesterday) break;
    }

    const dayAfterTS = new Date(endTS - dayInMS).getTime()
    
    for (let i = index+1; i < shifts.length; i++) {
      const shiftTemp = shifts[i]
      const insideTimeframe = shiftTemp.startTime < endTS
      const isOverlap = insideTimeframe && shiftTemp.booked

      if (isOverlap) return true

      const tomorrow = shiftTemp.endTime < dayAfterTS
      if (tomorrow) break;
    }

    return false
  }

  private filterShifts(property: keyof Shift, value: string | number | null, shifts?: Shift[]): Shift[] {
    if (!value && shifts) return shifts
    if (shifts) return shifts.filter(shift => shift[property] === value)
    return this.shifts.filter(shift => shift[property] === value)
  }

  private createLocations(shifts: Shift[]): Map<string, number> {
    const locations = new Map<string, number>()

    for (const shift of shifts) {
      const location = shift.area

      if (locations.has(location)) {
        locations.set(location, locations.get(location) as number + 1)
      } else {
        locations.set(location, 1)
      }
    }

    return locations
  }

  private addLocationParameter(locations: Map<string, number>): void {
    this.router.navigate([], {
      queryParams: {
        location: locations.keys().next().value
      }
    })
  }

  private setLoaded(): void {
    this.isDataLoaded = true
  }
}
