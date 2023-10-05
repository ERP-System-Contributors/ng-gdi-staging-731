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
import { SharedModule } from 'app/shared/shared.module';
import { CardIssuerChargesComponent } from './list/card-issuer-charges.component';
import { CardIssuerChargesDetailComponent } from './detail/card-issuer-charges-detail.component';
import { CardIssuerChargesUpdateComponent } from './update/card-issuer-charges-update.component';
import { CardIssuerChargesDeleteDialogComponent } from './delete/card-issuer-charges-delete-dialog.component';
import { CardIssuerChargesRoutingModule } from './route/card-issuer-charges-routing.module';

@NgModule({
  imports: [SharedModule, CardIssuerChargesRoutingModule],
  declarations: [
    CardIssuerChargesComponent,
    CardIssuerChargesDetailComponent,
    CardIssuerChargesUpdateComponent,
    CardIssuerChargesDeleteDialogComponent,
  ],
  entryComponents: [CardIssuerChargesDeleteDialogComponent],
})
export class CardIssuerChargesModule {}
