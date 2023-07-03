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

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAmortizationRecurrence, AmortizationRecurrence } from '../amortization-recurrence.model';
import { AmortizationRecurrenceService } from '../service/amortization-recurrence.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPlaceholder } from 'app/entities/system/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/system/placeholder/service/placeholder.service';
import { IPrepaymentMapping } from 'app/entities/prepayments/prepayment-mapping/prepayment-mapping.model';
import { PrepaymentMappingService } from 'app/entities/prepayments/prepayment-mapping/service/prepayment-mapping.service';
import { IUniversallyUniqueMapping } from 'app/entities/system/universally-unique-mapping/universally-unique-mapping.model';
import { UniversallyUniqueMappingService } from 'app/entities/system/universally-unique-mapping/service/universally-unique-mapping.service';
import { IDepreciationMethod } from 'app/entities/assets/depreciation-method/depreciation-method.model';
import { DepreciationMethodService } from 'app/entities/assets/depreciation-method/service/depreciation-method.service';
import { IPrepaymentAccount } from 'app/entities/prepayments/prepayment-account/prepayment-account.model';
import { PrepaymentAccountService } from 'app/entities/prepayments/prepayment-account/service/prepayment-account.service';
import { recurrenceFrequency } from 'app/entities/enumerations/recurrence-frequency.model';

@Component({
  selector: 'jhi-amortization-recurrence-update',
  templateUrl: './amortization-recurrence-update.component.html',
})
export class AmortizationRecurrenceUpdateComponent implements OnInit {
  isSaving = false;
  recurrenceFrequencyValues = Object.keys(recurrenceFrequency);

  placeholdersSharedCollection: IPlaceholder[] = [];
  prepaymentMappingsSharedCollection: IPrepaymentMapping[] = [];
  universallyUniqueMappingsSharedCollection: IUniversallyUniqueMapping[] = [];
  depreciationMethodsSharedCollection: IDepreciationMethod[] = [];
  prepaymentAccountsSharedCollection: IPrepaymentAccount[] = [];

  editForm = this.fb.group({
    id: [],
    firstAmortizationDate: [null, [Validators.required]],
    amortizationFrequency: [null, [Validators.required]],
    numberOfRecurrences: [null, [Validators.required]],
    notes: [],
    notesContentType: [],
    particulars: [],
    isActive: [],
    isOverWritten: [],
    timeOfInstallation: [null, [Validators.required]],
    recurrenceGuid: [null, [Validators.required]],
    prepaymentAccountGuid: [null, [Validators.required]],
    placeholders: [],
    parameters: [],
    applicationParameters: [],
    depreciationMethod: [null, Validators.required],
    prepaymentAccount: [null, Validators.required],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected amortizationRecurrenceService: AmortizationRecurrenceService,
    protected placeholderService: PlaceholderService,
    protected prepaymentMappingService: PrepaymentMappingService,
    protected universallyUniqueMappingService: UniversallyUniqueMappingService,
    protected depreciationMethodService: DepreciationMethodService,
    protected prepaymentAccountService: PrepaymentAccountService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ amortizationRecurrence }) => {
      if (amortizationRecurrence.id === undefined) {
        const today = dayjs().startOf('day');
        amortizationRecurrence.timeOfInstallation = today;
      }

      this.updateForm(amortizationRecurrence);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('erpSystemApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const amortizationRecurrence = this.createFromForm();
    if (amortizationRecurrence.id !== undefined) {
      this.subscribeToSaveResponse(this.amortizationRecurrenceService.update(amortizationRecurrence));
    } else {
      this.subscribeToSaveResponse(this.amortizationRecurrenceService.create(amortizationRecurrence));
    }
  }

  trackPlaceholderById(index: number, item: IPlaceholder): number {
    return item.id!;
  }

  trackPrepaymentMappingById(index: number, item: IPrepaymentMapping): number {
    return item.id!;
  }

  trackUniversallyUniqueMappingById(index: number, item: IUniversallyUniqueMapping): number {
    return item.id!;
  }

  trackDepreciationMethodById(index: number, item: IDepreciationMethod): number {
    return item.id!;
  }

  trackPrepaymentAccountById(index: number, item: IPrepaymentAccount): number {
    return item.id!;
  }

  getSelectedPlaceholder(option: IPlaceholder, selectedVals?: IPlaceholder[]): IPlaceholder {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedPrepaymentMapping(option: IPrepaymentMapping, selectedVals?: IPrepaymentMapping[]): IPrepaymentMapping {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedUniversallyUniqueMapping(
    option: IUniversallyUniqueMapping,
    selectedVals?: IUniversallyUniqueMapping[]
  ): IUniversallyUniqueMapping {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAmortizationRecurrence>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(amortizationRecurrence: IAmortizationRecurrence): void {
    this.editForm.patchValue({
      id: amortizationRecurrence.id,
      firstAmortizationDate: amortizationRecurrence.firstAmortizationDate,
      amortizationFrequency: amortizationRecurrence.amortizationFrequency,
      numberOfRecurrences: amortizationRecurrence.numberOfRecurrences,
      notes: amortizationRecurrence.notes,
      notesContentType: amortizationRecurrence.notesContentType,
      particulars: amortizationRecurrence.particulars,
      isActive: amortizationRecurrence.isActive,
      isOverWritten: amortizationRecurrence.isOverWritten,
      timeOfInstallation: amortizationRecurrence.timeOfInstallation
        ? amortizationRecurrence.timeOfInstallation.format(DATE_TIME_FORMAT)
        : null,
      recurrenceGuid: amortizationRecurrence.recurrenceGuid,
      prepaymentAccountGuid: amortizationRecurrence.prepaymentAccountGuid,
      placeholders: amortizationRecurrence.placeholders,
      parameters: amortizationRecurrence.parameters,
      applicationParameters: amortizationRecurrence.applicationParameters,
      depreciationMethod: amortizationRecurrence.depreciationMethod,
      prepaymentAccount: amortizationRecurrence.prepaymentAccount,
    });

    this.placeholdersSharedCollection = this.placeholderService.addPlaceholderToCollectionIfMissing(
      this.placeholdersSharedCollection,
      ...(amortizationRecurrence.placeholders ?? [])
    );
    this.prepaymentMappingsSharedCollection = this.prepaymentMappingService.addPrepaymentMappingToCollectionIfMissing(
      this.prepaymentMappingsSharedCollection,
      ...(amortizationRecurrence.parameters ?? [])
    );
    this.universallyUniqueMappingsSharedCollection = this.universallyUniqueMappingService.addUniversallyUniqueMappingToCollectionIfMissing(
      this.universallyUniqueMappingsSharedCollection,
      ...(amortizationRecurrence.applicationParameters ?? [])
    );
    this.depreciationMethodsSharedCollection = this.depreciationMethodService.addDepreciationMethodToCollectionIfMissing(
      this.depreciationMethodsSharedCollection,
      amortizationRecurrence.depreciationMethod
    );
    this.prepaymentAccountsSharedCollection = this.prepaymentAccountService.addPrepaymentAccountToCollectionIfMissing(
      this.prepaymentAccountsSharedCollection,
      amortizationRecurrence.prepaymentAccount
    );
  }

  protected loadRelationshipsOptions(): void {
    this.placeholderService
      .query()
      .pipe(map((res: HttpResponse<IPlaceholder[]>) => res.body ?? []))
      .pipe(
        map((placeholders: IPlaceholder[]) =>
          this.placeholderService.addPlaceholderToCollectionIfMissing(placeholders, ...(this.editForm.get('placeholders')!.value ?? []))
        )
      )
      .subscribe((placeholders: IPlaceholder[]) => (this.placeholdersSharedCollection = placeholders));

    this.prepaymentMappingService
      .query()
      .pipe(map((res: HttpResponse<IPrepaymentMapping[]>) => res.body ?? []))
      .pipe(
        map((prepaymentMappings: IPrepaymentMapping[]) =>
          this.prepaymentMappingService.addPrepaymentMappingToCollectionIfMissing(
            prepaymentMappings,
            ...(this.editForm.get('parameters')!.value ?? [])
          )
        )
      )
      .subscribe((prepaymentMappings: IPrepaymentMapping[]) => (this.prepaymentMappingsSharedCollection = prepaymentMappings));

    this.universallyUniqueMappingService
      .query()
      .pipe(map((res: HttpResponse<IUniversallyUniqueMapping[]>) => res.body ?? []))
      .pipe(
        map((universallyUniqueMappings: IUniversallyUniqueMapping[]) =>
          this.universallyUniqueMappingService.addUniversallyUniqueMappingToCollectionIfMissing(
            universallyUniqueMappings,
            ...(this.editForm.get('applicationParameters')!.value ?? [])
          )
        )
      )
      .subscribe(
        (universallyUniqueMappings: IUniversallyUniqueMapping[]) =>
          (this.universallyUniqueMappingsSharedCollection = universallyUniqueMappings)
      );

    this.depreciationMethodService
      .query()
      .pipe(map((res: HttpResponse<IDepreciationMethod[]>) => res.body ?? []))
      .pipe(
        map((depreciationMethods: IDepreciationMethod[]) =>
          this.depreciationMethodService.addDepreciationMethodToCollectionIfMissing(
            depreciationMethods,
            this.editForm.get('depreciationMethod')!.value
          )
        )
      )
      .subscribe((depreciationMethods: IDepreciationMethod[]) => (this.depreciationMethodsSharedCollection = depreciationMethods));

    this.prepaymentAccountService
      .query()
      .pipe(map((res: HttpResponse<IPrepaymentAccount[]>) => res.body ?? []))
      .pipe(
        map((prepaymentAccounts: IPrepaymentAccount[]) =>
          this.prepaymentAccountService.addPrepaymentAccountToCollectionIfMissing(
            prepaymentAccounts,
            this.editForm.get('prepaymentAccount')!.value
          )
        )
      )
      .subscribe((prepaymentAccounts: IPrepaymentAccount[]) => (this.prepaymentAccountsSharedCollection = prepaymentAccounts));
  }

  protected createFromForm(): IAmortizationRecurrence {
    return {
      ...new AmortizationRecurrence(),
      id: this.editForm.get(['id'])!.value,
      firstAmortizationDate: this.editForm.get(['firstAmortizationDate'])!.value,
      amortizationFrequency: this.editForm.get(['amortizationFrequency'])!.value,
      numberOfRecurrences: this.editForm.get(['numberOfRecurrences'])!.value,
      notesContentType: this.editForm.get(['notesContentType'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      particulars: this.editForm.get(['particulars'])!.value,
      isActive: this.editForm.get(['isActive'])!.value,
      isOverWritten: this.editForm.get(['isOverWritten'])!.value,
      timeOfInstallation: this.editForm.get(['timeOfInstallation'])!.value
        ? dayjs(this.editForm.get(['timeOfInstallation'])!.value, DATE_TIME_FORMAT)
        : undefined,
      recurrenceGuid: this.editForm.get(['recurrenceGuid'])!.value,
      prepaymentAccountGuid: this.editForm.get(['prepaymentAccountGuid'])!.value,
      placeholders: this.editForm.get(['placeholders'])!.value,
      parameters: this.editForm.get(['parameters'])!.value,
      applicationParameters: this.editForm.get(['applicationParameters'])!.value,
      depreciationMethod: this.editForm.get(['depreciationMethod'])!.value,
      prepaymentAccount: this.editForm.get(['prepaymentAccount'])!.value,
    };
  }
}
