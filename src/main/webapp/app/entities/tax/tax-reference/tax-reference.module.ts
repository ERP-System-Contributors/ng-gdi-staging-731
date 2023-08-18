///
/// Erp System - Mark V No 5 (Ehud Series) Client 1.5.2
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
import { SharedModule } from 'app/shared/shared.module';
import { TaxReferenceComponent } from './list/tax-reference.component';
import { TaxReferenceDetailComponent } from './detail/tax-reference-detail.component';
import { TaxReferenceUpdateComponent } from './update/tax-reference-update.component';
import { TaxReferenceDeleteDialogComponent } from './delete/tax-reference-delete-dialog.component';
import { TaxReferenceRoutingModule } from './route/tax-reference-routing.module';

@NgModule({
  imports: [SharedModule, TaxReferenceRoutingModule],
  declarations: [TaxReferenceComponent, TaxReferenceDetailComponent, TaxReferenceUpdateComponent, TaxReferenceDeleteDialogComponent],
  entryComponents: [TaxReferenceDeleteDialogComponent],
})
export class ErpServiceTaxReferenceModule {}
