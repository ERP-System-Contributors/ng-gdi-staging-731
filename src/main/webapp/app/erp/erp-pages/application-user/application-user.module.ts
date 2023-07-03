///
/// Erp System - Mark V No 1 (Ehud Series) Client 1.5.1
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
import { ApplicationUserComponent } from './list/application-user.component';
import { ApplicationUserDetailComponent } from './detail/application-user-detail.component';
import { ApplicationUserUpdateComponent } from './update/application-user-update.component';
import { ApplicationUserDeleteDialogComponent } from './delete/application-user-delete-dialog.component';
import { ApplicationUserRoutingModule } from './route/application-user-routing.module';
import { ErpCommonModule } from '../../erp-common/erp-common.module';

@NgModule({
  imports: [SharedModule, ApplicationUserRoutingModule, ErpCommonModule],
  declarations: [
    ApplicationUserComponent,
    ApplicationUserDetailComponent,
    ApplicationUserUpdateComponent,
    ApplicationUserDeleteDialogComponent,
  ],
  entryComponents: [ApplicationUserDeleteDialogComponent],
})
export class ApplicationUserModule {}
