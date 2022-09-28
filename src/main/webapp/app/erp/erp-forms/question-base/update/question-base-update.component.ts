import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuestionBase, QuestionBase } from '../question-base.model';
import { QuestionBaseService } from '../service/question-base.service';
import { IPlaceholder } from '../../../erp-pages/placeholder/placeholder.model';
import { UniversallyUniqueMappingService } from '../../../erp-pages/universally-unique-mapping/service/universally-unique-mapping.service';
import { IUniversallyUniqueMapping } from '../../../erp-pages/universally-unique-mapping/universally-unique-mapping.model';
import { PlaceholderService } from '../../../erp-pages/placeholder/service/placeholder.service';

@Component({
  selector: 'jhi-question-base-update',
  templateUrl: './question-base-update.component.html',
})
export class QuestionBaseUpdateComponent implements OnInit {
  isSaving = false;

  universallyUniqueMappingsSharedCollection: IUniversallyUniqueMapping[] = [];
  placeholdersSharedCollection: IPlaceholder[] = [];

  editForm = this.fb.group({
    id: [],
    value: [],
    key: [null, [Validators.required]],
    label: [null, [Validators.required]],
    required: [],
    order: [null, [Validators.required]],
    controlType: [null, [Validators.required]],
    placeholder: [],
    iterable: [],
    parameters: [],
    placeholderItems: [],
  });

  constructor(
    protected questionBaseService: QuestionBaseService,
    protected universallyUniqueMappingService: UniversallyUniqueMappingService,
    protected placeholderService: PlaceholderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questionBase }) => {
      this.updateForm(questionBase);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const questionBase = this.createFromForm();
    if (questionBase.id !== undefined) {
      this.subscribeToSaveResponse(this.questionBaseService.update(questionBase));
    } else {
      this.subscribeToSaveResponse(this.questionBaseService.create(questionBase));
    }
  }

  trackUniversallyUniqueMappingById(index: number, item: IUniversallyUniqueMapping): number {
    return item.id!;
  }

  trackPlaceholderById(index: number, item: IPlaceholder): number {
    return item.id!;
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestionBase<any>>>): void {
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

  protected updateForm(questionBase: IQuestionBase<any>): void {
    this.editForm.patchValue({
      id: questionBase.id,
      value: questionBase.value,
      key: questionBase.key,
      label: questionBase.label,
      required: questionBase.required,
      order: questionBase.order,
      controlType: questionBase.controlType,
      placeholder: questionBase.placeholder,
      iterable: questionBase.iterable,
      parameters: questionBase.parameters,
      placeholderItems: questionBase.placeholderItems,
    });

    this.universallyUniqueMappingsSharedCollection = this.universallyUniqueMappingService.addUniversallyUniqueMappingToCollectionIfMissing(
      this.universallyUniqueMappingsSharedCollection,
      ...(questionBase.parameters ?? [])
    );
    this.placeholdersSharedCollection = this.placeholderService.addPlaceholderToCollectionIfMissing(
      this.placeholdersSharedCollection,
      ...(questionBase.placeholderItems ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.universallyUniqueMappingService
      .query()
      .pipe(map((res: HttpResponse<IUniversallyUniqueMapping[]>) => res.body ?? []))
      .pipe(
        map((universallyUniqueMappings: IUniversallyUniqueMapping[]) =>
          this.universallyUniqueMappingService.addUniversallyUniqueMappingToCollectionIfMissing(
            universallyUniqueMappings,
            ...(this.editForm.get('parameters')!.value ?? [])
          )
        )
      )
      .subscribe(
        (universallyUniqueMappings: IUniversallyUniqueMapping[]) =>
          (this.universallyUniqueMappingsSharedCollection = universallyUniqueMappings)
      );

    this.placeholderService
      .query()
      .pipe(map((res: HttpResponse<IPlaceholder[]>) => res.body ?? []))
      .pipe(
        map((placeholders: IPlaceholder[]) =>
          this.placeholderService.addPlaceholderToCollectionIfMissing(placeholders, ...(this.editForm.get('placeholderItems')!.value ?? []))
        )
      )
      .subscribe((placeholders: IPlaceholder[]) => (this.placeholdersSharedCollection = placeholders));
  }

  protected createFromForm(): IQuestionBase<any> {
    return {
      ...new QuestionBase(),
      id: this.editForm.get(['id'])!.value,
      value: this.editForm.get(['value'])!.value,
      key: this.editForm.get(['key'])!.value,
      label: this.editForm.get(['label'])!.value,
      required: this.editForm.get(['required'])!.value,
      order: this.editForm.get(['order'])!.value,
      controlType: this.editForm.get(['controlType'])!.value,
      placeholder: this.editForm.get(['placeholder'])!.value,
      iterable: this.editForm.get(['iterable'])!.value,
      parameters: this.editForm.get(['parameters'])!.value,
      placeholderItems: this.editForm.get(['placeholderItems'])!.value,
    };
  }
}
