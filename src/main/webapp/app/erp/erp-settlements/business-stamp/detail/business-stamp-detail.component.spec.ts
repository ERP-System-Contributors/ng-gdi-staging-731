///
/// Erp System - Mark II No 28 (Baruch Series) Client 0.1.8-SNAPSHOT
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

import { BusinessStampDetailComponent } from './business-stamp-detail.component';

describe('BusinessStamp Management Detail Component', () => {
  let comp: BusinessStampDetailComponent;
  let fixture: ComponentFixture<BusinessStampDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessStampDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ businessStamp: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BusinessStampDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BusinessStampDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load businessStamp on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.businessStamp).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
