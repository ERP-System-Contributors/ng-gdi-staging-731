jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IQuestionBase, QuestionBase } from '../question-base.model';
import { QuestionBaseService } from '../service/question-base.service';

import { QuestionBaseRoutingResolveService } from './question-base-routing-resolve.service';

describe('QuestionBase routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: QuestionBaseRoutingResolveService;
  let service: QuestionBaseService;
  let resultQuestionBase: IQuestionBase<any> | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(QuestionBaseRoutingResolveService);
    service = TestBed.inject(QuestionBaseService);
    resultQuestionBase = undefined;
  });

  describe('resolve', () => {
    it('should return IQuestionBase<any> returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultQuestionBase = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultQuestionBase).toEqual({ id: 123 });
    });

    it('should return new IQuestionBase<any> if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultQuestionBase = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultQuestionBase).toEqual(new QuestionBase());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as QuestionBase })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultQuestionBase = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultQuestionBase).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
