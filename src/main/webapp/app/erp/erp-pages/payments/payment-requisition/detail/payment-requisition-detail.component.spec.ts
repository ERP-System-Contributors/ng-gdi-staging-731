///
/// Erp System - Mark II No 17 (Baruch Series)
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

import { PaymentRequisitionDetailComponent } from './payment-requisition-detail.component';

describe('Component Tests', () => {
  describe('PaymentRequisition Management Detail Component', () => {
    let comp: PaymentRequisitionDetailComponent;
    let fixture: ComponentFixture<PaymentRequisitionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PaymentRequisitionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ paymentRequisition: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PaymentRequisitionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PaymentRequisitionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load paymentRequisition on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.paymentRequisition).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
