import { InjectionToken } from '@angular/core';

import { Employee } from '@employee-management/shared-models';

export const EMPLOYEE_SEED_DATA = new InjectionToken<readonly Employee[]>('EMPLOYEE_SEED_DATA');
