import { Component, EventEmitter, forwardRef, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { IDealer } from '../../../../entities/dealers/dealer/dealer.model';
import { concat, Observable, of, Subject } from 'rxjs';
import { DealerService } from '../../../../entities/dealers/dealer/service/dealer.service';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { DealerInputControlService } from './dealer-input-control.service';

@Component({
  selector: 'jhi-m2m-dealer-form-control',
  templateUrl: './m2m-dealer-form-control.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => M2MDealerFormControlComponent),
      multi: true
    }
  ]
})
export class M2MDealerFormControlComponent implements OnInit, ControlValueAccessor {

  // TODO Add logs and developer views to the component to aid in telemetry
  // TODO Create similar components for other entities
  // TODO Add self validation code via NG_VALIDATOR provider

  @HostBinding('attr.id') externalId = '';

  @Input() inputDealers: IDealer[] = [];

  @Input() inputControlLabel = '';

  @Output() dealerSelected: EventEmitter<IDealer[]> = new EventEmitter<IDealer[]>();

  selectedDealer: IDealer = {};

  isSaving = false;

  dealersSharedCollection: IDealer[] = [];

  minAccountLengthTerm = 3;

  dealersLoading = false;
  dealersInput$ = new Subject<string>();
  dealerLookups$: Observable<IDealer[]> = of([]);

  constructor(
    protected dealerService: DealerService,
    protected dealerInputControlService: DealerInputControlService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {
    this.getValues();
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};

  ngOnInit(): void {

    this.updateForm();

    this.loadRelationshipsOptions();

    this.loadDealers();
  }

  loadDealers(): void {
    this.dealerLookups$ = concat(
      of([]), // default items
      this.dealersInput$.pipe(
        /* filter(res => res.length >= this.minAccountLengthTerm), */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        filter(res => res !== null),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.dealersLoading = true),
        switchMap(term => this.dealerInputControlService.search(term).pipe(
          catchError(() => of([])),
          tap(() => this.dealersLoading = false)
        ))
      ),
      of([])
    );
  }

  trackDealerByFn(item: IDealer): number {
    return item.id!;
  }

  writeValue(value: IDealer[]): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (value) {
      this.inputDealers = value
    }
  }

  getValues(): void {
    // eslint-disable-next-line no-console
    console.log(`Picking changed values: ${this.selectedDealer}`);
    this.dealerSelected.emit(this.inputDealers);
  }

  previousState(): void {
    window.history.back();
  }

  protected updateForm(): void {
    this.dealersSharedCollection = this.dealerService.addDealerToCollectionIfMissing(
      this.inputDealers
    );
  }

  protected loadRelationshipsOptions(): void {
    this.dealerService
      .query()
      .pipe(map((res: HttpResponse<IDealer[]>) => res.body ?? []))
      .pipe(map((dealers: IDealer[]) => this.dealerService.addDealerToCollectionIfMissing(dealers)))
      .subscribe((dealers: IDealer[]) => (this.dealersSharedCollection = dealers));
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering,@typescript-eslint/no-empty-function
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering,@typescript-eslint/no-empty-function
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
