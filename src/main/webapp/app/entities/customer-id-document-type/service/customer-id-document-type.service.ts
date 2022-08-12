///
/// Erp System - Mark II No 26 (Baruch Series) Client v 0.1.1-SNAPSHOT
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ICustomerIDDocumentType, getCustomerIDDocumentTypeIdentifier } from '../customer-id-document-type.model';

export type EntityResponseType = HttpResponse<ICustomerIDDocumentType>;
export type EntityArrayResponseType = HttpResponse<ICustomerIDDocumentType[]>;

@Injectable({ providedIn: 'root' })
export class CustomerIDDocumentTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/customer-id-document-types');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/customer-id-document-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(customerIDDocumentType: ICustomerIDDocumentType): Observable<EntityResponseType> {
    return this.http.post<ICustomerIDDocumentType>(this.resourceUrl, customerIDDocumentType, { observe: 'response' });
  }

  update(customerIDDocumentType: ICustomerIDDocumentType): Observable<EntityResponseType> {
    return this.http.put<ICustomerIDDocumentType>(
      `${this.resourceUrl}/${getCustomerIDDocumentTypeIdentifier(customerIDDocumentType) as number}`,
      customerIDDocumentType,
      { observe: 'response' }
    );
  }

  partialUpdate(customerIDDocumentType: ICustomerIDDocumentType): Observable<EntityResponseType> {
    return this.http.patch<ICustomerIDDocumentType>(
      `${this.resourceUrl}/${getCustomerIDDocumentTypeIdentifier(customerIDDocumentType) as number}`,
      customerIDDocumentType,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICustomerIDDocumentType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomerIDDocumentType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomerIDDocumentType[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addCustomerIDDocumentTypeToCollectionIfMissing(
    customerIDDocumentTypeCollection: ICustomerIDDocumentType[],
    ...customerIDDocumentTypesToCheck: (ICustomerIDDocumentType | null | undefined)[]
  ): ICustomerIDDocumentType[] {
    const customerIDDocumentTypes: ICustomerIDDocumentType[] = customerIDDocumentTypesToCheck.filter(isPresent);
    if (customerIDDocumentTypes.length > 0) {
      const customerIDDocumentTypeCollectionIdentifiers = customerIDDocumentTypeCollection.map(
        customerIDDocumentTypeItem => getCustomerIDDocumentTypeIdentifier(customerIDDocumentTypeItem)!
      );
      const customerIDDocumentTypesToAdd = customerIDDocumentTypes.filter(customerIDDocumentTypeItem => {
        const customerIDDocumentTypeIdentifier = getCustomerIDDocumentTypeIdentifier(customerIDDocumentTypeItem);
        if (
          customerIDDocumentTypeIdentifier == null ||
          customerIDDocumentTypeCollectionIdentifiers.includes(customerIDDocumentTypeIdentifier)
        ) {
          return false;
        }
        customerIDDocumentTypeCollectionIdentifiers.push(customerIDDocumentTypeIdentifier);
        return true;
      });
      return [...customerIDDocumentTypesToAdd, ...customerIDDocumentTypeCollection];
    }
    return customerIDDocumentTypeCollection;
  }
}
