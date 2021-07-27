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

import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;

/**
 * A DTO for the {@link io.github.erp.domain.TaxRule} entity.
 */
public class TaxRuleDTO implements Serializable {
    
    private Long id;

    @NotNull
    private String paymentNumber;

    @NotNull
    private LocalDate paymentDate;

    private Double telcoExciseDuty;

    private Double valueAddedTax;

    private Double withholdingVAT;

    private Double withholdingTaxConsultancy;

    private Double withholdingTaxRent;

    private Double cateringLevy;

    private Double serviceCharge;

    private Double withholdingTaxImportedService;

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaymentNumber() {
        return paymentNumber;
    }

    public void setPaymentNumber(String paymentNumber) {
        this.paymentNumber = paymentNumber;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Double getTelcoExciseDuty() {
        return telcoExciseDuty;
    }

    public void setTelcoExciseDuty(Double telcoExciseDuty) {
        this.telcoExciseDuty = telcoExciseDuty;
    }

    public Double getValueAddedTax() {
        return valueAddedTax;
    }

    public void setValueAddedTax(Double valueAddedTax) {
        this.valueAddedTax = valueAddedTax;
    }

    public Double getWithholdingVAT() {
        return withholdingVAT;
    }

    public void setWithholdingVAT(Double withholdingVAT) {
        this.withholdingVAT = withholdingVAT;
    }

    public Double getWithholdingTaxConsultancy() {
        return withholdingTaxConsultancy;
    }

    public void setWithholdingTaxConsultancy(Double withholdingTaxConsultancy) {
        this.withholdingTaxConsultancy = withholdingTaxConsultancy;
    }

    public Double getWithholdingTaxRent() {
        return withholdingTaxRent;
    }

    public void setWithholdingTaxRent(Double withholdingTaxRent) {
        this.withholdingTaxRent = withholdingTaxRent;
    }

    public Double getCateringLevy() {
        return cateringLevy;
    }

    public void setCateringLevy(Double cateringLevy) {
        this.cateringLevy = cateringLevy;
    }

    public Double getServiceCharge() {
        return serviceCharge;
    }

    public void setServiceCharge(Double serviceCharge) {
        this.serviceCharge = serviceCharge;
    }

    public Double getWithholdingTaxImportedService() {
        return withholdingTaxImportedService;
    }

    public void setWithholdingTaxImportedService(Double withholdingTaxImportedService) {
        this.withholdingTaxImportedService = withholdingTaxImportedService;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TaxRuleDTO)) {
            return false;
        }

        return id != null && id.equals(((TaxRuleDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TaxRuleDTO{" +
            "id=" + getId() +
            ", paymentNumber='" + getPaymentNumber() + "'" +
            ", paymentDate='" + getPaymentDate() + "'" +
            ", telcoExciseDuty=" + getTelcoExciseDuty() +
            ", valueAddedTax=" + getValueAddedTax() +
            ", withholdingVAT=" + getWithholdingVAT() +
            ", withholdingTaxConsultancy=" + getWithholdingTaxConsultancy() +
            ", withholdingTaxRent=" + getWithholdingTaxRent() +
            ", cateringLevy=" + getCateringLevy() +
            ", serviceCharge=" + getServiceCharge() +
            ", withholdingTaxImportedService=" + getWithholdingTaxImportedService() +
            "}";
    }
}
