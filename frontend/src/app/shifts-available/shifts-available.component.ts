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

  firstRender = true

  ngOnInit() {
    const location = this.route.snapshot.queryParamMap.get("location")

    this.apiService
      .getShifts()
      .subscribe((shifts) => {
        this.locations = this.createLocations(shifts)
        this.shifts = shifts
        
        if (location) {
          this.shiftsProp = this.filterShifts("area" as keyof Shift, location, shifts)
        } else {
          this.addLocationParameter(this.locations)
        }
        this.firstRender = false
    })

    this.route.queryParamMap
      .subscribe(params => {
        const location = params.get("location")

        if (location && !this.firstRender) {
          this.shiftsProp = this.filterShifts("area" as keyof Shift, location)          
        }
      })
  }

  filterShifts(property: keyof Shift, value: string | number, shifts?: Shift[]): Shift[] {
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
