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

import { filterNaN, isPresent } from './operators';

describe('Operators Test', () => {
  describe('isPresent', () => {
    it('should remove null and undefined values', () => {
      expect([1, null, undefined].filter(isPresent)).toEqual([1]);
    });
  });

  describe('filterNaN', () => {
    it('should return 0 for NaN', () => {
      expect(filterNaN(NaN)).toBe(0);
    });
    it('should return number for a number', () => {
      expect(filterNaN(12345)).toBe(12345);
    });
  });
});
