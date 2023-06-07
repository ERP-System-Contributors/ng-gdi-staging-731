///
/// Erp System - Mark III No 15 (Caleb Series) Client 1.3.7
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

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { LocalStorageService, NgxWebstorageModule, SessionStorageService } from 'ngx-webstorage';

describe('Auth JWT', () => {
  let service: AuthServerProvider;
  let localStorageService: LocalStorageService;
  let sessionStorageService: SessionStorageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthServerProvider);
    localStorageService = TestBed.inject(LocalStorageService);
    sessionStorageService = TestBed.inject(SessionStorageService);
  });

  describe('Get Token', () => {
    it('should return empty token if not found in local storage nor session storage', () => {
      const result = service.getToken();
      expect(result).toEqual('');
    });

    it('should return token from session storage if local storage is empty', () => {
      sessionStorageService.retrieve = jest.fn().mockReturnValue('sessionStorageToken');
      const result = service.getToken();
      expect(result).toEqual('sessionStorageToken');
    });

    it('should return token from localstorage storage', () => {
      localStorageService.retrieve = jest.fn().mockReturnValue('localStorageToken');
      const result = service.getToken();
      expect(result).toEqual('localStorageToken');
    });
  });

  describe('Login', () => {
    it('should clear session storage and save in local storage when rememberMe is true', () => {
      // GIVEN
      localStorageService.store = jest.fn();
      sessionStorageService.clear = jest.fn();

      // WHEN
      service.login({ username: 'John', password: '123', rememberMe: true }).subscribe();
      httpMock.expectOne('api/authenticate').flush({ id_token: '1' });

      // THEN
      httpMock.verify();
      expect(localStorageService.store).toHaveBeenCalledWith('authenticationToken', '1');
      expect(sessionStorageService.clear).toHaveBeenCalled();
    });

    it('should clear local storage and save in session storage when rememberMe is false', () => {
      // GIVEN
      sessionStorageService.store = jest.fn();
      localStorageService.clear = jest.fn();

      // WHEN
      service.login({ username: 'John', password: '123', rememberMe: false }).subscribe();
      httpMock.expectOne('api/authenticate').flush({ id_token: '1' });

      // THEN
      httpMock.verify();
      expect(sessionStorageService.store).toHaveBeenCalledWith('authenticationToken', '1');
      expect(localStorageService.clear).toHaveBeenCalled();
    });
  });

  describe('Logout', () => {
    it('should clear storage', () => {
      // GIVEN
      sessionStorageService.clear = jest.fn();
      localStorageService.clear = jest.fn();

      // WHEN
      service.logout().subscribe();

      // THEN
      expect(localStorageService.clear).toHaveBeenCalled();
      expect(sessionStorageService.clear).toHaveBeenCalled();
    });
  });
});
