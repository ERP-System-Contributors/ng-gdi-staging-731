///
/// Erp System - Mark V No 1 (Ehud Series) Client 1.5.1
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SettlementCurrencyDetailComponent } from './settlement-currency-detail.component';

describe('SettlementCurrency Management Detail Component', () => {
  let comp: SettlementCurrencyDetailComponent;
  let fixture: ComponentFixture<SettlementCurrencyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettlementCurrencyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ settlementCurrency: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SettlementCurrencyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SettlementCurrencyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load settlementCurrency on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.settlementCurrency).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
