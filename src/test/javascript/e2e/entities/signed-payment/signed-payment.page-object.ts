import { element, by, ElementFinder } from 'protractor';

export class SignedPaymentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-signed-payment div table .btn-danger'));
  title = element.all(by.css('jhi-signed-payment div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }
}

export class SignedPaymentUpdatePage {
  pageTitle = element(by.id('jhi-signed-payment-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  paymentCategorySelect = element(by.id('field_paymentCategory'));
  transactionNumberInput = element(by.id('field_transactionNumber'));
  transactionDateInput = element(by.id('field_transactionDate'));
  transactionCurrencySelect = element(by.id('field_transactionCurrency'));
  transactionAmountInput = element(by.id('field_transactionAmount'));
  beneficiaryInput = element(by.id('field_beneficiary'));

  paymentLabelSelect = element(by.id('field_paymentLabel'));
  placeholderSelect = element(by.id('field_placeholder'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setPaymentCategorySelect(paymentCategory: string): Promise<void> {
    await this.paymentCategorySelect.sendKeys(paymentCategory);
  }

  async getPaymentCategorySelect(): Promise<string> {
    return await this.paymentCategorySelect.element(by.css('option:checked')).getText();
  }

  async paymentCategorySelectLastOption(): Promise<void> {
    await this.paymentCategorySelect.all(by.tagName('option')).last().click();
  }

  async setTransactionNumberInput(transactionNumber: string): Promise<void> {
    await this.transactionNumberInput.sendKeys(transactionNumber);
  }

  async getTransactionNumberInput(): Promise<string> {
    return await this.transactionNumberInput.getAttribute('value');
  }

  async setTransactionDateInput(transactionDate: string): Promise<void> {
    await this.transactionDateInput.sendKeys(transactionDate);
  }

  async getTransactionDateInput(): Promise<string> {
    return await this.transactionDateInput.getAttribute('value');
  }

  async setTransactionCurrencySelect(transactionCurrency: string): Promise<void> {
    await this.transactionCurrencySelect.sendKeys(transactionCurrency);
  }

  async getTransactionCurrencySelect(): Promise<string> {
    return await this.transactionCurrencySelect.element(by.css('option:checked')).getText();
  }

  async transactionCurrencySelectLastOption(): Promise<void> {
    await this.transactionCurrencySelect.all(by.tagName('option')).last().click();
  }

  async setTransactionAmountInput(transactionAmount: string): Promise<void> {
    await this.transactionAmountInput.sendKeys(transactionAmount);
  }

  async getTransactionAmountInput(): Promise<string> {
    return await this.transactionAmountInput.getAttribute('value');
  }

  async setBeneficiaryInput(beneficiary: string): Promise<void> {
    await this.beneficiaryInput.sendKeys(beneficiary);
  }

  async getBeneficiaryInput(): Promise<string> {
    return await this.beneficiaryInput.getAttribute('value');
  }

  async paymentLabelSelectLastOption(): Promise<void> {
    await this.paymentLabelSelect.all(by.tagName('option')).last().click();
  }

  async paymentLabelSelectOption(option: string): Promise<void> {
    await this.paymentLabelSelect.sendKeys(option);
  }

  getPaymentLabelSelect(): ElementFinder {
    return this.paymentLabelSelect;
  }

  async getPaymentLabelSelectedOption(): Promise<string> {
    return await this.paymentLabelSelect.element(by.css('option:checked')).getText();
  }

  async placeholderSelectLastOption(): Promise<void> {
    await this.placeholderSelect.all(by.tagName('option')).last().click();
  }

  async placeholderSelectOption(option: string): Promise<void> {
    await this.placeholderSelect.sendKeys(option);
  }

  getPlaceholderSelect(): ElementFinder {
    return this.placeholderSelect;
  }

  async getPlaceholderSelectedOption(): Promise<string> {
    return await this.placeholderSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class SignedPaymentDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-signedPayment-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-signedPayment'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
