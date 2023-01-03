///
/// Erp System - Mark III No 8 (Caleb Series) Client 0.9.0
/// Copyright © 2021 - 2022 Edwin Njeru (mailnjeru@gmail.com)
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
import { WorkInProgressTransferComponent } from '../list/work-in-progress-transfer.component';
import { WorkInProgressTransferDetailComponent } from '../detail/work-in-progress-transfer-detail.component';
import { WorkInProgressTransferUpdateComponent } from '../update/work-in-progress-transfer-update.component';
import { WorkInProgressTransferRoutingResolveService } from './work-in-progress-transfer-routing-resolve.service';

const workInProgressTransferRoute: Routes = [
  {
    path: '',
    component: WorkInProgressTransferComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WorkInProgressTransferDetailComponent,
    resolve: {
      workInProgressTransfer: WorkInProgressTransferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorkInProgressTransferUpdateComponent,
    resolve: {
      workInProgressTransfer: WorkInProgressTransferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorkInProgressTransferUpdateComponent,
    resolve: {
      workInProgressTransfer: WorkInProgressTransferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(workInProgressTransferRoute)],
  exports: [RouterModule],
})
export class WorkInProgressTransferRoutingModule {}
