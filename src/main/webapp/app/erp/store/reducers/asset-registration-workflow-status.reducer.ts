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

import { IAssetRegistration } from '../../erp-assets/asset-registration/asset-registration.model';
import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from '../global-store.definition';
import {
  assetRegistrationCopyWorkflowInitiatedEnRoute,
  assetRegistrationCopyWorkflowInitiatedFromList,
  assetRegistrationCopyWorkflowInitiatedFromView,
  assetRegistrationCreationWorkflowInitiatedFromList,
  assetRegistrationEditWorkflowInitiatedEnRoute,
  assetRegistrationEditWorkflowInitiatedFromList,
  assetRegistrationEditWorkflowInitiatedFromView
} from '../actions/fixed-assets-register-update-status.actions';

export const assetRegistrationUpdateFormStateSelector = 'assetRegistrationUpdateForm';

export interface AssetRegistrationFormState {
  backEndFetchComplete: boolean;
  browserHasBeenRefreshed: boolean;
  selectedInstance: IAssetRegistration;
  weAreCopying: boolean;
  weAreEditing: boolean;
  weAreCreating: boolean;
}

const _assetRegistrationUpdateStateReducer = createReducer(
  initialState,

  // workflows for creation
  on(assetRegistrationCreationWorkflowInitiatedFromList, (state) => ({
    ...state,
    assetRegistrationFormState: {
      ...state.assetRegistrationFormState,
      weAreCopying: false,
      weAreEditing: false,
      weAreCreating: true,
    }
  })),

  //    workflows for copy
  on(assetRegistrationCopyWorkflowInitiatedEnRoute, (state, {copiedInstance}) => ({
    ...state,
    assetRegistrationFormState: {
      ...state.assetRegistrationFormState,
      selectedInstance: copiedInstance,
      weAreCopying: true,
      weAreEditing: false,
      weAreCreating: false,
    }
  })),

  on(assetRegistrationCopyWorkflowInitiatedFromView, (state, {copiedInstance}) => ({
    ...state,
    assetRegistrationFormState: {
      ...state.assetRegistrationFormState,
      selectedInstance: copiedInstance,
      weAreCopying: true,
      weAreEditing: false,
      weAreCreating: false,
    }
  })),

  on(assetRegistrationCopyWorkflowInitiatedFromList, (state, {copiedInstance}) => ({
    ...state,
    assetRegistrationFormState: {
      ...state.assetRegistrationFormState,
      selectedInstance: copiedInstance,
      weAreCopying: true,
      weAreEditing: false,
      weAreCreating: false,
    }
  })),


  //    workflows for edit workflows
  on(assetRegistrationEditWorkflowInitiatedEnRoute, (state, {editedInstance}) => ({
    ...state,
    assetRegistrationFormState: {
      ...state.assetRegistrationFormState,
      selectedInstance: editedInstance,
      weAreCopying: false,
      weAreEditing: true,
      weAreCreating: false,
    }
  })),

  on(assetRegistrationEditWorkflowInitiatedFromView, (state, {editedInstance}) => ({
    ...state,
    assetRegistrationFormState: {
      ...state.assetRegistrationFormState,
      selectedInstance: editedInstance,
      weAreCopying: false,
      weAreEditing: true,
      weAreCreating: false,
    }
  })),

  on(assetRegistrationEditWorkflowInitiatedFromList, (state, {editedInstance}) => ({
    ...state,
    assetRegistrationFormState: {
      ...state.assetRegistrationFormState,
      selectedInstance: editedInstance,
      weAreCopying: false,
      weAreEditing: true,
      weAreCreating: false,
    }
  })),
);

export function assetRegistrationUpdateStateReducer(state: State = initialState, action: Action): State {

  return _assetRegistrationUpdateStateReducer(state, action);
}
