///
/// Erp System - Mark III No 5 (Caleb Series) Client 0.4.0-SNAPSHOT
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SignedPaymentDetailComponent } from './signed-payment-detail.component';

describe('Component Tests', () => {
  describe('SignedPayment Management Detail Component', () => {
    let comp: SignedPaymentDetailComponent;
    let fixture: ComponentFixture<SignedPaymentDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SignedPaymentDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ signedPayment: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SignedPaymentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SignedPaymentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load signedPayment on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.signedPayment).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
