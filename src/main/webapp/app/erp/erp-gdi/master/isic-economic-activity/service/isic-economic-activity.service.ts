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

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IIsicEconomicActivity, getIsicEconomicActivityIdentifier } from '../isic-economic-activity.model';

export type EntityResponseType = HttpResponse<IIsicEconomicActivity>;
export type EntityArrayResponseType = HttpResponse<IIsicEconomicActivity[]>;

@Injectable({ providedIn: 'root' })
export class IsicEconomicActivityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/isic-economic-activities');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/isic-economic-activities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(isicEconomicActivity: IIsicEconomicActivity): Observable<EntityResponseType> {
    return this.http.post<IIsicEconomicActivity>(this.resourceUrl, isicEconomicActivity, { observe: 'response' });
  }

  update(isicEconomicActivity: IIsicEconomicActivity): Observable<EntityResponseType> {
    return this.http.put<IIsicEconomicActivity>(
      `${this.resourceUrl}/${getIsicEconomicActivityIdentifier(isicEconomicActivity) as number}`,
      isicEconomicActivity,
      { observe: 'response' }
    );
  }

  partialUpdate(isicEconomicActivity: IIsicEconomicActivity): Observable<EntityResponseType> {
    return this.http.patch<IIsicEconomicActivity>(
      `${this.resourceUrl}/${getIsicEconomicActivityIdentifier(isicEconomicActivity) as number}`,
      isicEconomicActivity,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIsicEconomicActivity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIsicEconomicActivity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIsicEconomicActivity[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addIsicEconomicActivityToCollectionIfMissing(
    isicEconomicActivityCollection: IIsicEconomicActivity[],
    ...isicEconomicActivitiesToCheck: (IIsicEconomicActivity | null | undefined)[]
  ): IIsicEconomicActivity[] {
    const isicEconomicActivities: IIsicEconomicActivity[] = isicEconomicActivitiesToCheck.filter(isPresent);
    if (isicEconomicActivities.length > 0) {
      const isicEconomicActivityCollectionIdentifiers = isicEconomicActivityCollection.map(
        isicEconomicActivityItem => getIsicEconomicActivityIdentifier(isicEconomicActivityItem)!
      );
      const isicEconomicActivitiesToAdd = isicEconomicActivities.filter(isicEconomicActivityItem => {
        const isicEconomicActivityIdentifier = getIsicEconomicActivityIdentifier(isicEconomicActivityItem);
        if (isicEconomicActivityIdentifier == null || isicEconomicActivityCollectionIdentifiers.includes(isicEconomicActivityIdentifier)) {
          return false;
        }
        isicEconomicActivityCollectionIdentifiers.push(isicEconomicActivityIdentifier);
        return true;
      });
      return [...isicEconomicActivitiesToAdd, ...isicEconomicActivityCollection];
    }
    return isicEconomicActivityCollection;
  }
}
