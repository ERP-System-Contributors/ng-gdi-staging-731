///
/// Erp System - Mark III No 11 (Caleb Series) Client 1.1.1
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

import { Component } from '@angular/core';
import { VERSION as AngularVersion } from '@angular/core';
// import { VERSION } from '../../app.constants';
// import { environment } from '../../../environment';
import { versionInfo } from '../../../version-info';
// import { VERSION as EnvVersion } from 'environments/version';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  version = AngularVersion.full;
  // clientVersion = environment.appVersion;
  clientVersion = versionInfo
}
