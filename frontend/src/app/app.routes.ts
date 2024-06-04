import { Routes } from '@angular/router';
import { ShiftsUserComponent } from './shifts-user/shifts-user.component';
import { ShiftsAvailableComponent } from './shifts-available/shifts-available.component';

export const routes: Routes = [
    {
        path: '',
        component: ShiftsUserComponent
    },
    {
        path: 'shifts-available',
        component: ShiftsAvailableComponent
    }
];
