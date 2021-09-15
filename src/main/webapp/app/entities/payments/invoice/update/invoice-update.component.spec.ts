jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { InvoiceService } from '../service/invoice.service';
import { IInvoice, Invoice } from '../invoice.model';
import { IPayment } from 'app/entities/payments/payment/payment.model';
import { PaymentService } from 'app/entities/payments/payment/service/payment.service';
import { IDealer } from 'app/entities/dealers/dealer/dealer.model';
import { DealerService } from 'app/entities/dealers/dealer/service/dealer.service';
import { IPlaceholder } from 'app/entities/erpService/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/erpService/placeholder/service/placeholder.service';

import { InvoiceUpdateComponent } from './invoice-update.component';

describe('Component Tests', () => {
  describe('Invoice Management Update Component', () => {
    let comp: InvoiceUpdateComponent;
    let fixture: ComponentFixture<InvoiceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let invoiceService: InvoiceService;
    let paymentService: PaymentService;
    let dealerService: DealerService;
    let placeholderService: PlaceholderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InvoiceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(InvoiceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InvoiceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      invoiceService = TestBed.inject(InvoiceService);
      paymentService = TestBed.inject(PaymentService);
      dealerService = TestBed.inject(DealerService);
      placeholderService = TestBed.inject(PlaceholderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Payment query and add missing value', () => {
        const invoice: IInvoice = { id: 456 };
        const payment: IPayment = { id: 60128 };
        invoice.payment = payment;

        const paymentCollection: IPayment[] = [{ id: 44880 }];
        jest.spyOn(paymentService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentCollection })));
        const additionalPayments = [payment];
        const expectedCollection: IPayment[] = [...additionalPayments, ...paymentCollection];
        jest.spyOn(paymentService, 'addPaymentToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        expect(paymentService.query).toHaveBeenCalled();
        expect(paymentService.addPaymentToCollectionIfMissing).toHaveBeenCalledWith(paymentCollection, ...additionalPayments);
        expect(comp.paymentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Dealer query and add missing value', () => {
        const invoice: IInvoice = { id: 456 };
        const dealer: IDealer = { id: 43784 };
        invoice.dealer = dealer;

        const dealerCollection: IDealer[] = [{ id: 44641 }];
        jest.spyOn(dealerService, 'query').mockReturnValue(of(new HttpResponse({ body: dealerCollection })));
        const additionalDealers = [dealer];
        const expectedCollection: IDealer[] = [...additionalDealers, ...dealerCollection];
        jest.spyOn(dealerService, 'addDealerToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        expect(dealerService.query).toHaveBeenCalled();
        expect(dealerService.addDealerToCollectionIfMissing).toHaveBeenCalledWith(dealerCollection, ...additionalDealers);
        expect(comp.dealersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Placeholder query and add missing value', () => {
        const invoice: IInvoice = { id: 456 };
        const placeholders: IPlaceholder[] = [{ id: 61962 }];
        invoice.placeholders = placeholders;

        const placeholderCollection: IPlaceholder[] = [{ id: 95570 }];
        jest.spyOn(placeholderService, 'query').mockReturnValue(of(new HttpResponse({ body: placeholderCollection })));
        const additionalPlaceholders = [...placeholders];
        const expectedCollection: IPlaceholder[] = [...additionalPlaceholders, ...placeholderCollection];
        jest.spyOn(placeholderService, 'addPlaceholderToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        expect(placeholderService.query).toHaveBeenCalled();
        expect(placeholderService.addPlaceholderToCollectionIfMissing).toHaveBeenCalledWith(
          placeholderCollection,
          ...additionalPlaceholders
        );
        expect(comp.placeholdersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const invoice: IInvoice = { id: 456 };
        const payment: IPayment = { id: 33941 };
        invoice.payment = payment;
        const dealer: IDealer = { id: 74624 };
        invoice.dealer = dealer;
        const placeholders: IPlaceholder = { id: 79504 };
        invoice.placeholders = [placeholders];

        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(invoice));
        expect(comp.paymentsSharedCollection).toContain(payment);
        expect(comp.dealersSharedCollection).toContain(dealer);
        expect(comp.placeholdersSharedCollection).toContain(placeholders);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Invoice>>();
        const invoice = { id: 123 };
        jest.spyOn(invoiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: invoice }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(invoiceService.update).toHaveBeenCalledWith(invoice);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Invoice>>();
        const invoice = new Invoice();
        jest.spyOn(invoiceService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: invoice }));
        saveSubject.complete();

        // THEN
        expect(invoiceService.create).toHaveBeenCalledWith(invoice);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Invoice>>();
        const invoice = { id: 123 };
        jest.spyOn(invoiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(invoiceService.update).toHaveBeenCalledWith(invoice);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPaymentById', () => {
        it('Should return tracked Payment primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPaymentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackDealerById', () => {
        it('Should return tracked Dealer primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDealerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPlaceholderById', () => {
        it('Should return tracked Placeholder primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPlaceholderById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedPlaceholder', () => {
        it('Should return option if no Placeholder is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedPlaceholder(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Placeholder for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedPlaceholder(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Placeholder is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedPlaceholder(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
