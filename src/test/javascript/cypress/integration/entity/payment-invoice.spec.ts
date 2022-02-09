import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('PaymentInvoice e2e test', () => {
  const paymentInvoicePageUrl = '/payment-invoice';
  const paymentInvoicePageUrlPattern = new RegExp('/payment-invoice(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const paymentInvoiceSample = { invoiceNumber: 'Kansas' };

  let paymentInvoice: any;
  let settlementCurrency: any;
  let dealer: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/settlement-currencies',
      body: {
        iso4217CurrencyCode: 'Mar',
        currencyName: 'Codes specifically reserved for testing purposes',
        country: 'Gibraltar',
        fileUploadToken: 'multi-byte red',
        compilationToken: 'Account',
      },
    }).then(({ body }) => {
      settlementCurrency = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/dealers',
      body: {
        dealerName: 'Cambridgeshire Pataca',
        taxNumber: 'Cotton Account Cotton',
        postalAddress: 'Borders even-keeled mindshare',
        physicalAddress: 'up uniform',
        accountName: 'Investment Account',
        accountNumber: 'back-end Assistant',
        bankersName: 'fuchsia',
        bankersBranch: 'grid-enabled',
        bankersSwiftCode: 'primary',
        fileUploadToken: 'asymmetric',
        compilationToken: 'lime',
      },
    }).then(({ body }) => {
      dealer = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/payment-invoices+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/payment-invoices').as('postEntityRequest');
    cy.intercept('DELETE', '/api/payment-invoices/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/purchase-orders', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/placeholders', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/payment-labels', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/settlement-currencies', {
      statusCode: 200,
      body: [settlementCurrency],
    });

    cy.intercept('GET', '/api/dealers', {
      statusCode: 200,
      body: [dealer],
    });
  });

  afterEach(() => {
    if (paymentInvoice) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/payment-invoices/${paymentInvoice.id}`,
      }).then(() => {
        paymentInvoice = undefined;
      });
    }
  });

  afterEach(() => {
    if (settlementCurrency) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/settlement-currencies/${settlementCurrency.id}`,
      }).then(() => {
        settlementCurrency = undefined;
      });
    }
    if (dealer) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/dealers/${dealer.id}`,
      }).then(() => {
        dealer = undefined;
      });
    }
  });

  it('PaymentInvoices menu should load PaymentInvoices page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('payment-invoice');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PaymentInvoice').should('exist');
    cy.url().should('match', paymentInvoicePageUrlPattern);
  });

  describe('PaymentInvoice page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(paymentInvoicePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PaymentInvoice page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/payment-invoice/new$'));
        cy.getEntityCreateUpdateHeading('PaymentInvoice');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', paymentInvoicePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/payment-invoices',

          body: {
            ...paymentInvoiceSample,
            settlementCurrency: settlementCurrency,
            biller: dealer,
          },
        }).then(({ body }) => {
          paymentInvoice = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/payment-invoices+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [paymentInvoice],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(paymentInvoicePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PaymentInvoice page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('paymentInvoice');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', paymentInvoicePageUrlPattern);
      });

      it('edit button click should load edit PaymentInvoice page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PaymentInvoice');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', paymentInvoicePageUrlPattern);
      });

      it('last delete button click should delete instance of PaymentInvoice', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('paymentInvoice').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', paymentInvoicePageUrlPattern);

        paymentInvoice = undefined;
      });
    });
  });

  describe('new PaymentInvoice page', () => {
    beforeEach(() => {
      cy.visit(`${paymentInvoicePageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('PaymentInvoice');
    });

    it('should create an instance of PaymentInvoice', () => {
      cy.get(`[data-cy="invoiceNumber"]`).type('Central Lock').should('have.value', 'Central Lock');

      cy.get(`[data-cy="invoiceDate"]`).type('2022-02-02').should('have.value', '2022-02-02');

      cy.get(`[data-cy="invoiceAmount"]`).type('40309').should('have.value', '40309');

      cy.get(`[data-cy="fileUploadToken"]`).type('deposit Ouguiya composite').should('have.value', 'deposit Ouguiya composite');

      cy.get(`[data-cy="compilationToken"]`).type('software Towels').should('have.value', 'software Towels');

      cy.get(`[data-cy="settlementCurrency"]`).select(1);
      cy.get(`[data-cy="biller"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        paymentInvoice = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', paymentInvoicePageUrlPattern);
    });
  });
});
