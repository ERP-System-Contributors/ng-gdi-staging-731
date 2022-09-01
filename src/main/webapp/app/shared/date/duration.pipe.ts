///
/// Erp System - Mark II No 28 (Baruch Series) Client 0.1.8-SNAPSHOT
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

import { Pipe, PipeTransform } from '@angular/core';

import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: any): string {
    if (value) {
      dayjs.extend(duration);
      return dayjs.duration(value).humanize();
    }
    return '';
  }
}
