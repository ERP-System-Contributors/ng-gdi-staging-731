///
/// Erp System - Mark VI No 2 (Phoebe Series) Client 1.5.3
/// Copyright © 2021 - 2023 Edwin Njeru (mailnjeru@gmail.com)
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program. If not, see <http://www.gnu.org/licenses/>.
///

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CardPerformanceFlagComponent } from '../list/card-performance-flag.component';
import { CardPerformanceFlagDetailComponent } from '../detail/card-performance-flag-detail.component';
import { CardPerformanceFlagUpdateComponent } from '../update/card-performance-flag-update.component';
import { CardPerformanceFlagRoutingResolveService } from './card-performance-flag-routing-resolve.service';

const cardPerformanceFlagRoute: Routes = [
  {
    path: '',
    component: CardPerformanceFlagComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CardPerformanceFlagDetailComponent,
    resolve: {
      cardPerformanceFlag: CardPerformanceFlagRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CardPerformanceFlagUpdateComponent,
    resolve: {
      cardPerformanceFlag: CardPerformanceFlagRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CardPerformanceFlagUpdateComponent,
    resolve: {
      cardPerformanceFlag: CardPerformanceFlagRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cardPerformanceFlagRoute)],
  exports: [RouterModule],
})
export class CardPerformanceFlagRoutingModule {}
