///
/// Erp System - Mark III No 12 (Caleb Series) Client 1.2.2
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

jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFixedAssetNetBookValue, FixedAssetNetBookValue } from '../fixed-asset-net-book-value.model';
import { FixedAssetNetBookValueService } from '../service/fixed-asset-net-book-value.service';

import { FixedAssetNetBookValueRoutingResolveService } from './fixed-asset-net-book-value-routing-resolve.service';

describe('FixedAssetNetBookValue routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FixedAssetNetBookValueRoutingResolveService;
  let service: FixedAssetNetBookValueService;
  let resultFixedAssetNetBookValue: IFixedAssetNetBookValue | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(FixedAssetNetBookValueRoutingResolveService);
    service = TestBed.inject(FixedAssetNetBookValueService);
    resultFixedAssetNetBookValue = undefined;
  });

  describe('resolve', () => {
    it('should return IFixedAssetNetBookValue returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFixedAssetNetBookValue = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFixedAssetNetBookValue).toEqual({ id: 123 });
    });

    it('should return new IFixedAssetNetBookValue if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFixedAssetNetBookValue = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFixedAssetNetBookValue).toEqual(new FixedAssetNetBookValue());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FixedAssetNetBookValue })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFixedAssetNetBookValue = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFixedAssetNetBookValue).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
