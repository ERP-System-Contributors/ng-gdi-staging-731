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

import { IPlaceholder } from '../placeholder/placeholder.model';
import { IUniversallyUniqueMapping } from '../universally-unique-mapping/universally-unique-mapping.model';

export interface IProcessStatus {
  id?: number;
  statusCode?: string;
  description?: string;
  placeholders?: IPlaceholder[] | null;
  parameters?: IUniversallyUniqueMapping[] | null;
}

export class ProcessStatus implements IProcessStatus {
  constructor(
    public id?: number,
    public statusCode?: string,
    public description?: string,
    public placeholders?: IPlaceholder[] | null,
    public parameters?: IUniversallyUniqueMapping[] | null
  ) {}
}

export function getProcessStatusIdentifier(processStatus: IProcessStatus): number | undefined {
  return processStatus.id;
}
