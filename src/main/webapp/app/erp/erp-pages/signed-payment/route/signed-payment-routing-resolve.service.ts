///
/// Erp System - Mark III No 14 (Caleb Series) Client 1.3.3
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
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISignedPayment, SignedPayment } from '../signed-payment.model';
import { SignedPaymentService } from '../service/signed-payment.service';

@Injectable({ providedIn: 'root' })
export class SignedPaymentRoutingResolveService implements Resolve<ISignedPayment> {
  constructor(protected service: SignedPaymentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISignedPayment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((signedPayment: HttpResponse<SignedPayment>) => {
          if (signedPayment.body) {
            return of(signedPayment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SignedPayment());
  }
}
