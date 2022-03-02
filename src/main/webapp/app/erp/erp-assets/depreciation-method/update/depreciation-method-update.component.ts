import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDepreciationMethod, DepreciationMethod } from '../depreciation-method.model';
import { DepreciationMethodService } from '../service/depreciation-method.service';
import { IPlaceholder } from 'app/entities/erpService/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/erpService/placeholder/service/placeholder.service';
import { DepreciationTypes } from '../../../erp-common/enumerations/depreciation-types.model';

@Component({
  selector: 'jhi-depreciation-method-update',
  templateUrl: './depreciation-method-update.component.html',
})
export class DepreciationMethodUpdateComponent implements OnInit {
  isSaving = false;
  depreciationTypesValues = Object.keys(DepreciationTypes);

  placeholdersSharedCollection: IPlaceholder[] = [];

  editForm = this.fb.group({
    id: [],
    depreciationMethodName: [null, [Validators.required]],
    description: [],
    depreciationType: [null, [Validators.required]],
    placeholders: [],
  });

  constructor(
    protected depreciationMethodService: DepreciationMethodService,
    protected placeholderService: PlaceholderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ depreciationMethod }) => {
      this.updateForm(depreciationMethod);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const depreciationMethod = this.createFromForm();
    if (depreciationMethod.id !== undefined) {
      this.subscribeToSaveResponse(this.depreciationMethodService.update(depreciationMethod));
    } else {
      this.subscribeToSaveResponse(this.depreciationMethodService.create(depreciationMethod));
    }
  }

  trackPlaceholderById(index: number, item: IPlaceholder): number {
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepreciationMethod>>): void {
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

  protected updateForm(depreciationMethod: IDepreciationMethod): void {
    this.editForm.patchValue({
      id: depreciationMethod.id,
      depreciationMethodName: depreciationMethod.depreciationMethodName,
      description: depreciationMethod.description,
      depreciationType: depreciationMethod.depreciationType,
      placeholders: depreciationMethod.placeholders,
    });

    this.placeholdersSharedCollection = this.placeholderService.addPlaceholderToCollectionIfMissing(
      this.placeholdersSharedCollection,
      ...(depreciationMethod.placeholders ?? [])
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
  }

  protected createFromForm(): IDepreciationMethod {
    return {
      ...new DepreciationMethod(),
      id: this.editForm.get(['id'])!.value,
      depreciationMethodName: this.editForm.get(['depreciationMethodName'])!.value,
      description: this.editForm.get(['description'])!.value,
      depreciationType: this.editForm.get(['depreciationType'])!.value,
      placeholders: this.editForm.get(['placeholders'])!.value,
    };
  }
}
