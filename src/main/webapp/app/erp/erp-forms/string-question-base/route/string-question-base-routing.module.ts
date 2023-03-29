///
/// Erp System - Mark III No 12 (Caleb Series) Client 1.2.2
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
import { StringQuestionBaseComponent } from '../list/string-question-base.component';
import { StringQuestionBaseDetailComponent } from '../detail/string-question-base-detail.component';
import { StringQuestionBaseUpdateComponent } from '../update/string-question-base-update.component';
import { StringQuestionBaseRoutingResolveService } from './string-question-base-routing-resolve.service';

const stringQuestionBaseRoute: Routes = [
  {
    path: '',
    component: StringQuestionBaseComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StringQuestionBaseDetailComponent,
    resolve: {
      stringQuestionBase: StringQuestionBaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StringQuestionBaseUpdateComponent,
    resolve: {
      stringQuestionBase: StringQuestionBaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StringQuestionBaseUpdateComponent,
    resolve: {
      stringQuestionBase: StringQuestionBaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(stringQuestionBaseRoute)],
  exports: [RouterModule],
})
export class StringQuestionBaseRoutingModule {}
