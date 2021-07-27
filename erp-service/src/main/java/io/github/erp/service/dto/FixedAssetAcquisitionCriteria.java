package io.github.erp.service.dto;

/*-
 * Copyright © 2021 Edwin Njeru (mailnjeru@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;
import io.github.jhipster.service.filter.BigDecimalFilter;
import io.github.jhipster.service.filter.LocalDateFilter;

/**
 * Criteria class for the {@link io.github.erp.domain.FixedAssetAcquisition} entity. This class is used
 * in {@link io.github.erp.web.rest.FixedAssetAcquisitionResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /fixed-asset-acquisitions?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class FixedAssetAcquisitionCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private LongFilter assetNumber;

    private StringFilter serviceOutletCode;

    private StringFilter assetTag;

    private StringFilter assetDescription;

    private LocalDateFilter purchaseDate;

    private StringFilter assetCategory;

    private BigDecimalFilter purchasePrice;

    private StringFilter fileUploadToken;

    public FixedAssetAcquisitionCriteria() {
    }

    public FixedAssetAcquisitionCriteria(FixedAssetAcquisitionCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.assetNumber = other.assetNumber == null ? null : other.assetNumber.copy();
        this.serviceOutletCode = other.serviceOutletCode == null ? null : other.serviceOutletCode.copy();
        this.assetTag = other.assetTag == null ? null : other.assetTag.copy();
        this.assetDescription = other.assetDescription == null ? null : other.assetDescription.copy();
        this.purchaseDate = other.purchaseDate == null ? null : other.purchaseDate.copy();
        this.assetCategory = other.assetCategory == null ? null : other.assetCategory.copy();
        this.purchasePrice = other.purchasePrice == null ? null : other.purchasePrice.copy();
        this.fileUploadToken = other.fileUploadToken == null ? null : other.fileUploadToken.copy();
    }

    @Override
    public FixedAssetAcquisitionCriteria copy() {
        return new FixedAssetAcquisitionCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public LongFilter getAssetNumber() {
        return assetNumber;
    }

    public void setAssetNumber(LongFilter assetNumber) {
        this.assetNumber = assetNumber;
    }

    public StringFilter getServiceOutletCode() {
        return serviceOutletCode;
    }

    public void setServiceOutletCode(StringFilter serviceOutletCode) {
        this.serviceOutletCode = serviceOutletCode;
    }

    public StringFilter getAssetTag() {
        return assetTag;
    }

    public void setAssetTag(StringFilter assetTag) {
        this.assetTag = assetTag;
    }

    public StringFilter getAssetDescription() {
        return assetDescription;
    }

    public void setAssetDescription(StringFilter assetDescription) {
        this.assetDescription = assetDescription;
    }

    public LocalDateFilter getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDateFilter purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public StringFilter getAssetCategory() {
        return assetCategory;
    }

    public void setAssetCategory(StringFilter assetCategory) {
        this.assetCategory = assetCategory;
    }

    public BigDecimalFilter getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimalFilter purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public StringFilter getFileUploadToken() {
        return fileUploadToken;
    }

    public void setFileUploadToken(StringFilter fileUploadToken) {
        this.fileUploadToken = fileUploadToken;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final FixedAssetAcquisitionCriteria that = (FixedAssetAcquisitionCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(assetNumber, that.assetNumber) &&
            Objects.equals(serviceOutletCode, that.serviceOutletCode) &&
            Objects.equals(assetTag, that.assetTag) &&
            Objects.equals(assetDescription, that.assetDescription) &&
            Objects.equals(purchaseDate, that.purchaseDate) &&
            Objects.equals(assetCategory, that.assetCategory) &&
            Objects.equals(purchasePrice, that.purchasePrice) &&
            Objects.equals(fileUploadToken, that.fileUploadToken);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        assetNumber,
        serviceOutletCode,
        assetTag,
        assetDescription,
        purchaseDate,
        assetCategory,
        purchasePrice,
        fileUploadToken
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FixedAssetAcquisitionCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (assetNumber != null ? "assetNumber=" + assetNumber + ", " : "") +
                (serviceOutletCode != null ? "serviceOutletCode=" + serviceOutletCode + ", " : "") +
                (assetTag != null ? "assetTag=" + assetTag + ", " : "") +
                (assetDescription != null ? "assetDescription=" + assetDescription + ", " : "") +
                (purchaseDate != null ? "purchaseDate=" + purchaseDate + ", " : "") +
                (assetCategory != null ? "assetCategory=" + assetCategory + ", " : "") +
                (purchasePrice != null ? "purchasePrice=" + purchasePrice + ", " : "") +
                (fileUploadToken != null ? "fileUploadToken=" + fileUploadToken + ", " : "") +
            "}";
    }

}
