import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ShiftsComponent } from '../shifts/shifts.component';
import { Shift } from '../services/types';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shifts-available',
  standalone: true,
  imports: [ShiftsComponent, RouterLink, RouterLinkActive, CommonModule],
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

  ngOnInit() {
    const location = this.route.snapshot.queryParamMap.get("location")

    this.apiService
      .getShifts()
      .subscribe((shifts) => {
        const activeShifts = this.getSortedActiveShifts(shifts)

        this.shifts = activeShifts
        this.shiftsProp = this.filterShifts("area" as keyof Shift, location, activeShifts)
        this.locations = this.createLocations(activeShifts)

        if (!location) this.addLocationParameter(this.locations)
    })

    this.route.queryParamMap
      .subscribe(params => {
        const location = params.get("location")
        this.shiftsProp = this.filterShifts("area" as keyof Shift, location)          
      })
  }

  getSortedActiveShifts(shifts: Shift[]): Shift[] {
    const currentTS = new Date().getTime()
    return shifts
            .sort((a, b) => a.startTime - b.startTime)
            .filter(shift => !shift.booked && shift.startTime > currentTS || shift.booked && shift.endTime > currentTS)
  }

  filterShifts(property: keyof Shift, value: string | number | null, shifts?: Shift[]): Shift[] {
    if (!value && shifts) return shifts
    if (shifts) return shifts.filter(shift => shift[property] === value)
    return this.shifts.filter(shift => shift[property] === value)
  }

  createLocations(shifts: Shift[]): Map<string, number> {
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

  addLocationParameter(locations: Map<string, number>): void {
    this.router.navigate([], {
      queryParams: {
        location: locations.keys().next().value
      }
    })
  }
}
