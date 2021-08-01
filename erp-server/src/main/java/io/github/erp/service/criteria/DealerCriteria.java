package io.github.erp.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.DoubleFilter;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.FloatFilter;
import tech.jhipster.service.filter.IntegerFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link io.github.erp.domain.Dealer} entity. This class is used
 * in {@link io.github.erp.web.rest.DealerResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /dealers?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class DealerCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter dealerName;

    private StringFilter taxNumber;

    private StringFilter postalAddress;

    private StringFilter physicalAddress;

    private StringFilter accountName;

    private StringFilter accountNumber;

    private StringFilter bankersName;

    private StringFilter bankersBranch;

    private StringFilter bankersSwiftCode;

    private LongFilter paymentId;

    public DealerCriteria() {}

    public DealerCriteria(DealerCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.dealerName = other.dealerName == null ? null : other.dealerName.copy();
        this.taxNumber = other.taxNumber == null ? null : other.taxNumber.copy();
        this.postalAddress = other.postalAddress == null ? null : other.postalAddress.copy();
        this.physicalAddress = other.physicalAddress == null ? null : other.physicalAddress.copy();
        this.accountName = other.accountName == null ? null : other.accountName.copy();
        this.accountNumber = other.accountNumber == null ? null : other.accountNumber.copy();
        this.bankersName = other.bankersName == null ? null : other.bankersName.copy();
        this.bankersBranch = other.bankersBranch == null ? null : other.bankersBranch.copy();
        this.bankersSwiftCode = other.bankersSwiftCode == null ? null : other.bankersSwiftCode.copy();
        this.paymentId = other.paymentId == null ? null : other.paymentId.copy();
    }

    @Override
    public DealerCriteria copy() {
        return new DealerCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getDealerName() {
        return dealerName;
    }

    public StringFilter dealerName() {
        if (dealerName == null) {
            dealerName = new StringFilter();
        }
        return dealerName;
    }

    public void setDealerName(StringFilter dealerName) {
        this.dealerName = dealerName;
    }

    public StringFilter getTaxNumber() {
        return taxNumber;
    }

    public StringFilter taxNumber() {
        if (taxNumber == null) {
            taxNumber = new StringFilter();
        }
        return taxNumber;
    }

    public void setTaxNumber(StringFilter taxNumber) {
        this.taxNumber = taxNumber;
    }

    public StringFilter getPostalAddress() {
        return postalAddress;
    }

    public StringFilter postalAddress() {
        if (postalAddress == null) {
            postalAddress = new StringFilter();
        }
        return postalAddress;
    }

    public void setPostalAddress(StringFilter postalAddress) {
        this.postalAddress = postalAddress;
    }

    public StringFilter getPhysicalAddress() {
        return physicalAddress;
    }

    public StringFilter physicalAddress() {
        if (physicalAddress == null) {
            physicalAddress = new StringFilter();
        }
        return physicalAddress;
    }

    public void setPhysicalAddress(StringFilter physicalAddress) {
        this.physicalAddress = physicalAddress;
    }

    public StringFilter getAccountName() {
        return accountName;
    }

    public StringFilter accountName() {
        if (accountName == null) {
            accountName = new StringFilter();
        }
        return accountName;
    }

    public void setAccountName(StringFilter accountName) {
        this.accountName = accountName;
    }

    public StringFilter getAccountNumber() {
        return accountNumber;
    }

    public StringFilter accountNumber() {
        if (accountNumber == null) {
            accountNumber = new StringFilter();
        }
        return accountNumber;
    }

    public void setAccountNumber(StringFilter accountNumber) {
        this.accountNumber = accountNumber;
    }

    public StringFilter getBankersName() {
        return bankersName;
    }

    public StringFilter bankersName() {
        if (bankersName == null) {
            bankersName = new StringFilter();
        }
        return bankersName;
    }

    public void setBankersName(StringFilter bankersName) {
        this.bankersName = bankersName;
    }

    public StringFilter getBankersBranch() {
        return bankersBranch;
    }

    public StringFilter bankersBranch() {
        if (bankersBranch == null) {
            bankersBranch = new StringFilter();
        }
        return bankersBranch;
    }

    public void setBankersBranch(StringFilter bankersBranch) {
        this.bankersBranch = bankersBranch;
    }

    public StringFilter getBankersSwiftCode() {
        return bankersSwiftCode;
    }

    public StringFilter bankersSwiftCode() {
        if (bankersSwiftCode == null) {
            bankersSwiftCode = new StringFilter();
        }
        return bankersSwiftCode;
    }

    public void setBankersSwiftCode(StringFilter bankersSwiftCode) {
        this.bankersSwiftCode = bankersSwiftCode;
    }

    public LongFilter getPaymentId() {
        return paymentId;
    }

    public LongFilter paymentId() {
        if (paymentId == null) {
            paymentId = new LongFilter();
        }
        return paymentId;
    }

    public void setPaymentId(LongFilter paymentId) {
        this.paymentId = paymentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final DealerCriteria that = (DealerCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(dealerName, that.dealerName) &&
            Objects.equals(taxNumber, that.taxNumber) &&
            Objects.equals(postalAddress, that.postalAddress) &&
            Objects.equals(physicalAddress, that.physicalAddress) &&
            Objects.equals(accountName, that.accountName) &&
            Objects.equals(accountNumber, that.accountNumber) &&
            Objects.equals(bankersName, that.bankersName) &&
            Objects.equals(bankersBranch, that.bankersBranch) &&
            Objects.equals(bankersSwiftCode, that.bankersSwiftCode) &&
            Objects.equals(paymentId, that.paymentId)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id,
            dealerName,
            taxNumber,
            postalAddress,
            physicalAddress,
            accountName,
            accountNumber,
            bankersName,
            bankersBranch,
            bankersSwiftCode,
            paymentId
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DealerCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (dealerName != null ? "dealerName=" + dealerName + ", " : "") +
            (taxNumber != null ? "taxNumber=" + taxNumber + ", " : "") +
            (postalAddress != null ? "postalAddress=" + postalAddress + ", " : "") +
            (physicalAddress != null ? "physicalAddress=" + physicalAddress + ", " : "") +
            (accountName != null ? "accountName=" + accountName + ", " : "") +
            (accountNumber != null ? "accountNumber=" + accountNumber + ", " : "") +
            (bankersName != null ? "bankersName=" + bankersName + ", " : "") +
            (bankersBranch != null ? "bankersBranch=" + bankersBranch + ", " : "") +
            (bankersSwiftCode != null ? "bankersSwiftCode=" + bankersSwiftCode + ", " : "") +
            (paymentId != null ? "paymentId=" + paymentId + ", " : "") +
            "}";
    }
}
