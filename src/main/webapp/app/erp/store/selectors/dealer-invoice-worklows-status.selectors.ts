///
/// Erp System - Mark II No 26 (Baruch Series) Client 0.1.5-SNAPSHOT
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

import {createFeatureSelector, createSelector} from "@ngrx/store";
import {State} from "../global-store.definition";
import {dealerInvoiceWorkflowStateSelector} from "../reducers/dealer-invoice-workflows-status.reducer";

export const dealerInvoiceWorkflows = createFeatureSelector<State>(dealerInvoiceWorkflowStateSelector);

export const dealerInvoiceSelectedDealer = createSelector(
  dealerInvoiceWorkflows,
  state => state.dealerInvoiceWorkflowState.invoiceDealer
);

export const dealerInvoiceSelected = createSelector(
  dealerInvoiceWorkflows,
  state => state.dealerInvoiceWorkflowState.selectedInvoice
);

export const dealerInvoiceSelectedPayment = createSelector(
  dealerInvoiceWorkflows,
  state => state.dealerInvoiceWorkflowState.invoicePayment
);

export const dealerInvoicePaymentLabels = createSelector(
  dealerInvoiceWorkflows,
  state => state.dealerInvoiceWorkflowState.selectedInvoiceLabels
);

export const dealerInvoicePlaceholders = createSelector(
  dealerInvoiceWorkflows,
  state => state.dealerInvoiceWorkflowState.selectedInvoicePlaceholders
);

export const dealerInvoicePaymentState = createSelector(
  dealerInvoiceWorkflows,
  state => state.dealerInvoiceWorkflowState.weArePayingAnInvoiceDealer
);
