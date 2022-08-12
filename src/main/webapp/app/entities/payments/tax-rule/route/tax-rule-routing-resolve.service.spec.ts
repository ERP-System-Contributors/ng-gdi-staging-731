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

jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITaxRule, TaxRule } from '../tax-rule.model';
import { TaxRuleService } from '../service/tax-rule.service';

import { TaxRuleRoutingResolveService } from './tax-rule-routing-resolve.service';

describe('TaxRule routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TaxRuleRoutingResolveService;
  let service: TaxRuleService;
  let resultTaxRule: ITaxRule | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(TaxRuleRoutingResolveService);
    service = TestBed.inject(TaxRuleService);
    resultTaxRule = undefined;
  });

  describe('resolve', () => {
    it('should return ITaxRule returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTaxRule = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTaxRule).toEqual({ id: 123 });
    });

    it('should return new ITaxRule if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTaxRule = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTaxRule).toEqual(new TaxRule());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TaxRule })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTaxRule = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTaxRule).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
