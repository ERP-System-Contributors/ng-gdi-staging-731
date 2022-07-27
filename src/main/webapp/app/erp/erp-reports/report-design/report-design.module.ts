///
/// Erp System - Mark II No 21 (Baruch Series) Client v 0.1.0-SNAPSHOT
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
import { ReportDesignComponent } from './list/report-design.component';
import { ReportDesignDetailComponent } from './detail/report-design-detail.component';
import { ReportDesignUpdateComponent } from './update/report-design-update.component';
import { ReportDesignDeleteDialogComponent } from './delete/report-design-delete-dialog.component';
import { ReportDesignRoutingModule } from './route/report-design-routing.module';
import { ErpCommonModule } from '../../erp-common/erp-common.module';

@NgModule({
  imports: [SharedModule, ReportDesignRoutingModule, ErpCommonModule],
  declarations: [ReportDesignComponent, ReportDesignDetailComponent, ReportDesignUpdateComponent, ReportDesignDeleteDialogComponent],
  entryComponents: [ReportDesignDeleteDialogComponent],
})
export class ReportDesignModule {}
