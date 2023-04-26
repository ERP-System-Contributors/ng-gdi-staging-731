///
/// Erp System - Mark III No 12 (Caleb Series) Client 1.2.9
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

import * as dayjs from 'dayjs';
import { DepreciationRegime } from '../../erp-common/enumerations/depreciation-regime.model';
import { IPlaceholder } from '../../erp-pages/placeholder/placeholder.model';

export interface IFixedAssetNetBookValue {
  id?: number;
  assetNumber?: number | null;
  serviceOutletCode?: string | null;
  assetTag?: string | null;
  assetDescription?: string | null;
  netBookValueDate?: dayjs.Dayjs | null;
  assetCategory?: string | null;
  netBookValue?: number | null;
  depreciationRegime?: DepreciationRegime | null;
  fileUploadToken?: string | null;
  compilationToken?: string | null;
  placeholders?: IPlaceholder[] | null;
}

export class FixedAssetNetBookValue implements IFixedAssetNetBookValue {
  constructor(
    public id?: number,
    public assetNumber?: number | null,
    public serviceOutletCode?: string | null,
    public assetTag?: string | null,
    public assetDescription?: string | null,
    public netBookValueDate?: dayjs.Dayjs | null,
    public assetCategory?: string | null,
    public netBookValue?: number | null,
    public depreciationRegime?: DepreciationRegime | null,
    public fileUploadToken?: string | null,
    public compilationToken?: string | null,
    public placeholders?: IPlaceholder[] | null
  ) {}
}

export function getFixedAssetNetBookValueIdentifier(fixedAssetNetBookValue: IFixedAssetNetBookValue): number | undefined {
  return fixedAssetNetBookValue.id;
}
