///
/// Erp System - Mark II No 17 (Baruch Series)
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
import { SharedModule } from 'app/shared/shared.module';
import { PrepaymentAmortizationComponent } from './list/prepayment-amortization.component';
import { PrepaymentAmortizationDetailComponent } from './detail/prepayment-amortization-detail.component';
import { PrepaymentAmortizationUpdateComponent } from './update/prepayment-amortization-update.component';
import { PrepaymentAmortizationDeleteDialogComponent } from './delete/prepayment-amortization-delete-dialog.component';
import { PrepaymentAmortizationRoutingModule } from './route/prepayment-amortization-routing.module';

@NgModule({
  imports: [SharedModule, PrepaymentAmortizationRoutingModule],
  declarations: [
    PrepaymentAmortizationComponent,
    PrepaymentAmortizationDetailComponent,
    PrepaymentAmortizationUpdateComponent,
    PrepaymentAmortizationDeleteDialogComponent,
  ],
  entryComponents: [PrepaymentAmortizationDeleteDialogComponent],
})
export class PrepaymentAmortizationModule {}
