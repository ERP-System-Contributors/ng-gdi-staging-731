package io.github.erp.modules;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static io.github.erp.modules.PaymentComputationUtils.onePlusVAT;
import static io.github.erp.modules.PaymentComputationUtils.queryNumerical;
import static org.assertj.core.api.Assertions.assertThat;

class PaymentComputationUtilsTest extends PaymentComputationTests {

    @BeforeEach
    void setUp() {
    }

    @Test
    void onePlusVATTest() {

        assertThat(onePlusVAT(taxRule)).isEqualTo(BigDecimal.valueOf(1.16));
    }

    @Test
    void queryNumericalTest() {

        assertThat(queryNumerical(requisition.getInvoicedAmount())).isEqualTo(BigDecimal.valueOf(40000).setScale(2, RoundingMode.HALF_EVEN));
    }
}
