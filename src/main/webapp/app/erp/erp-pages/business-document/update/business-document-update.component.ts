///
/// Erp System - Mark III No 3 (Caleb Series) Client 0.2.0-SNAPSHOT
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

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBusinessDocument, BusinessDocument } from '../business-document.model';
import { BusinessDocumentService } from '../service/business-document.service';
import { IPlaceholder } from '../../placeholder/placeholder.model';
import { DealerService } from '../../dealers/dealer/service/dealer.service';
import { IApplicationUser } from '../../application-user/application-user.model';
import { UniversallyUniqueMappingService } from '../../universally-unique-mapping/service/universally-unique-mapping.service';
import { ApplicationUserService } from '../../application-user/service/application-user.service';
import { IUniversallyUniqueMapping } from '../../universally-unique-mapping/universally-unique-mapping.model';
import { PlaceholderService } from '../../placeholder/service/placeholder.service';
import { IDealer } from '../../dealers/dealer/dealer.model';
import { v4 as uuidv4 } from 'uuid';
import { DataUtils, FileLoadError } from '../../../../core/util/data-util.service';
import { EventManager, EventWithContent } from '../../../../core/util/event-manager.service';
import { AlertError } from '../../../../shared/alert/alert-error.model';

@Component({
  selector: 'jhi-business-document-update',
  templateUrl: './business-document-update.component.html',
})
export class BusinessDocumentUpdateComponent implements OnInit {
  isSaving = false;

  applicationUsersSharedCollection: IApplicationUser[] = [];
  dealersSharedCollection: IDealer[] = [];
  universallyUniqueMappingsSharedCollection: IUniversallyUniqueMapping[] = [];
  placeholdersSharedCollection: IPlaceholder[] = [];

  editForm = this.fb.group({
    id: [],
    documentTitle: [null, [Validators.required]],
    description: [],
    documentSerial: [null, [Validators.required]],
    lastModified: [],
    attachmentFilePath: [null, [Validators.required]],
    documentFile: [null, [Validators.required]],
    documentFileContentType: [],
    createdBy: [null, Validators.required],
    lastModifiedBy: [],
    originatingDepartment: [null, Validators.required],
    applicationMappings: [],
    placeholders: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected businessDocumentService: BusinessDocumentService,
    protected applicationUserService: ApplicationUserService,
    protected dealerService: DealerService,
    protected universallyUniqueMappingService: UniversallyUniqueMappingService,
    protected placeholderService: PlaceholderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessDocument }) => {
      if (businessDocument.id === undefined) {
        businessDocument.documentSerial = uuidv4();
      }

      const today = dayjs();
      businessDocument.lastModified = today;

      this.updateForm(businessDocument);

      this.loadRelationshipsOptions();
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  updateOriginatingDepartment(dealerUpdate: IDealer): void {
    this.editForm.patchValue({
      originatingDepartment: dealerUpdate,
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  updateLastModifiedBy(dealerUpdate: IApplicationUser): void {
    this.editForm.patchValue({
      lastModifiedBy: dealerUpdate,
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  updateCreatedBy(dealerUpdate: IApplicationUser): void {
    this.editForm.patchValue({
      createdBy: dealerUpdate,
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
    const businessDocument = this.createFromForm();
    if (businessDocument.id !== undefined) {
      this.subscribeToSaveResponse(this.businessDocumentService.update(businessDocument));
    } else {
      this.subscribeToSaveResponse(this.businessDocumentService.create(businessDocument));
    }
  }

  trackApplicationUserById(index: number, item: IApplicationUser): number {
    return item.id!;
  }

  trackDealerById(index: number, item: IDealer): number {
    return item.id!;
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessDocument>>): void {
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

  protected updateForm(businessDocument: IBusinessDocument): void {
    this.editForm.patchValue({
      id: businessDocument.id,
      documentTitle: businessDocument.documentTitle,
      description: businessDocument.description,
      documentSerial: businessDocument.documentSerial,
      lastModified: businessDocument.lastModified ? businessDocument.lastModified.format(DATE_TIME_FORMAT) : null,
      attachmentFilePath: businessDocument.attachmentFilePath,
      documentFile: businessDocument.documentFile,
      documentFileContentType: businessDocument.documentFileContentType,
      createdBy: businessDocument.createdBy,
      lastModifiedBy: businessDocument.lastModifiedBy,
      originatingDepartment: businessDocument.originatingDepartment,
      applicationMappings: businessDocument.applicationMappings,
      placeholders: businessDocument.placeholders,
    });

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing(
      this.applicationUsersSharedCollection,
      businessDocument.createdBy,
      businessDocument.lastModifiedBy
    );
    this.dealersSharedCollection = this.dealerService.addDealerToCollectionIfMissing(
      this.dealersSharedCollection,
      businessDocument.originatingDepartment
    );
    this.universallyUniqueMappingsSharedCollection = this.universallyUniqueMappingService.addUniversallyUniqueMappingToCollectionIfMissing(
      this.universallyUniqueMappingsSharedCollection,
      ...(businessDocument.applicationMappings ?? [])
    );
    this.placeholdersSharedCollection = this.placeholderService.addPlaceholderToCollectionIfMissing(
      this.placeholdersSharedCollection,
      ...(businessDocument.placeholders ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing(
            applicationUsers,
            this.editForm.get('createdBy')!.value,
            this.editForm.get('lastModifiedBy')!.value
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.dealerService
      .query()
      .pipe(map((res: HttpResponse<IDealer[]>) => res.body ?? []))
      .pipe(
        map((dealers: IDealer[]) =>
          this.dealerService.addDealerToCollectionIfMissing(dealers, this.editForm.get('originatingDepartment')!.value)
        )
      )
      .subscribe((dealers: IDealer[]) => (this.dealersSharedCollection = dealers));

    this.universallyUniqueMappingService
      .query()
      .pipe(map((res: HttpResponse<IUniversallyUniqueMapping[]>) => res.body ?? []))
      .pipe(
        map((universallyUniqueMappings: IUniversallyUniqueMapping[]) =>
          this.universallyUniqueMappingService.addUniversallyUniqueMappingToCollectionIfMissing(
            universallyUniqueMappings,
            ...(this.editForm.get('applicationMappings')!.value ?? [])
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
          this.placeholderService.addPlaceholderToCollectionIfMissing(placeholders, ...(this.editForm.get('placeholders')!.value ?? []))
        )
      )
      .subscribe((placeholders: IPlaceholder[]) => (this.placeholdersSharedCollection = placeholders));
  }

  protected createFromForm(): IBusinessDocument {
    return {
      ...new BusinessDocument(),
      id: this.editForm.get(['id'])!.value,
      documentTitle: this.editForm.get(['documentTitle'])!.value,
      description: this.editForm.get(['description'])!.value,
      documentSerial: this.editForm.get(['documentSerial'])!.value,
      lastModified: this.editForm.get(['lastModified'])!.value
        ? dayjs(this.editForm.get(['lastModified'])!.value, DATE_TIME_FORMAT)
        : undefined,
      attachmentFilePath: this.editForm.get(['attachmentFilePath'])!.value,
      documentFileContentType: this.editForm.get(['documentFileContentType'])!.value,
      documentFile: this.editForm.get(['documentFile'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      lastModifiedBy: this.editForm.get(['lastModifiedBy'])!.value,
      originatingDepartment: this.editForm.get(['originatingDepartment'])!.value,
      applicationMappings: this.editForm.get(['applicationMappings'])!.value,
      placeholders: this.editForm.get(['placeholders'])!.value,
    };
  }
}
