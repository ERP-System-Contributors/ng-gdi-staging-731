package io.github.erp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import io.github.erp.IntegrationTest;
import io.github.erp.domain.Payment;
import io.github.erp.domain.PaymentCategory;
import io.github.erp.domain.enumeration.CategoryTypes;
import io.github.erp.repository.PaymentCategoryRepository;
import io.github.erp.repository.search.PaymentCategorySearchRepository;
import io.github.erp.service.criteria.PaymentCategoryCriteria;
import io.github.erp.service.dto.PaymentCategoryDTO;
import io.github.erp.service.mapper.PaymentCategoryMapper;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PaymentCategoryResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PaymentCategoryResourceIT {

    private static final String DEFAULT_CATEGORY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CATEGORY_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY_DESCRIPTION = "BBBBBBBBBB";

    private static final CategoryTypes DEFAULT_CATEGORY_TYPE = CategoryTypes.CATEGORY0;
    private static final CategoryTypes UPDATED_CATEGORY_TYPE = CategoryTypes.CATEGORY1;

    private static final String ENTITY_API_URL = "/api/payment-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/_search/payment-categories";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PaymentCategoryRepository paymentCategoryRepository;

    @Autowired
    private PaymentCategoryMapper paymentCategoryMapper;

    /**
     * This repository is mocked in the io.github.erp.repository.search test package.
     *
     * @see io.github.erp.repository.search.PaymentCategorySearchRepositoryMockConfiguration
     */
    @Autowired
    private PaymentCategorySearchRepository mockPaymentCategorySearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPaymentCategoryMockMvc;

    private PaymentCategory paymentCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentCategory createEntity(EntityManager em) {
        PaymentCategory paymentCategory = new PaymentCategory()
            .categoryName(DEFAULT_CATEGORY_NAME)
            .categoryDescription(DEFAULT_CATEGORY_DESCRIPTION)
            .categoryType(DEFAULT_CATEGORY_TYPE);
        return paymentCategory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentCategory createUpdatedEntity(EntityManager em) {
        PaymentCategory paymentCategory = new PaymentCategory()
            .categoryName(UPDATED_CATEGORY_NAME)
            .categoryDescription(UPDATED_CATEGORY_DESCRIPTION)
            .categoryType(UPDATED_CATEGORY_TYPE);
        return paymentCategory;
    }

    @BeforeEach
    public void initTest() {
        paymentCategory = createEntity(em);
    }

    @Test
    @Transactional
    void createPaymentCategory() throws Exception {
        int databaseSizeBeforeCreate = paymentCategoryRepository.findAll().size();
        // Create the PaymentCategory
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);
        restPaymentCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isCreated());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        PaymentCategory testPaymentCategory = paymentCategoryList.get(paymentCategoryList.size() - 1);
        assertThat(testPaymentCategory.getCategoryName()).isEqualTo(DEFAULT_CATEGORY_NAME);
        assertThat(testPaymentCategory.getCategoryDescription()).isEqualTo(DEFAULT_CATEGORY_DESCRIPTION);
        assertThat(testPaymentCategory.getCategoryType()).isEqualTo(DEFAULT_CATEGORY_TYPE);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository, times(1)).save(testPaymentCategory);
    }

    @Test
    @Transactional
    void createPaymentCategoryWithExistingId() throws Exception {
        // Create the PaymentCategory with an existing ID
        paymentCategory.setId(1L);
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);

        int databaseSizeBeforeCreate = paymentCategoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeCreate);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository, times(0)).save(paymentCategory);
    }

    @Test
    @Transactional
    void checkCategoryNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = paymentCategoryRepository.findAll().size();
        // set the field null
        paymentCategory.setCategoryName(null);

        // Create the PaymentCategory, which fails.
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);

        restPaymentCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCategoryTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = paymentCategoryRepository.findAll().size();
        // set the field null
        paymentCategory.setCategoryType(null);

        // Create the PaymentCategory, which fails.
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);

        restPaymentCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPaymentCategories() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList
        restPaymentCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].categoryName").value(hasItem(DEFAULT_CATEGORY_NAME)))
            .andExpect(jsonPath("$.[*].categoryDescription").value(hasItem(DEFAULT_CATEGORY_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].categoryType").value(hasItem(DEFAULT_CATEGORY_TYPE.toString())));
    }

    @Test
    @Transactional
    void getPaymentCategory() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get the paymentCategory
        restPaymentCategoryMockMvc
            .perform(get(ENTITY_API_URL_ID, paymentCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(paymentCategory.getId().intValue()))
            .andExpect(jsonPath("$.categoryName").value(DEFAULT_CATEGORY_NAME))
            .andExpect(jsonPath("$.categoryDescription").value(DEFAULT_CATEGORY_DESCRIPTION))
            .andExpect(jsonPath("$.categoryType").value(DEFAULT_CATEGORY_TYPE.toString()));
    }

    @Test
    @Transactional
    void getPaymentCategoriesByIdFiltering() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        Long id = paymentCategory.getId();

        defaultPaymentCategoryShouldBeFound("id.equals=" + id);
        defaultPaymentCategoryShouldNotBeFound("id.notEquals=" + id);

        defaultPaymentCategoryShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultPaymentCategoryShouldNotBeFound("id.greaterThan=" + id);

        defaultPaymentCategoryShouldBeFound("id.lessThanOrEqual=" + id);
        defaultPaymentCategoryShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryNameIsEqualToSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryName equals to DEFAULT_CATEGORY_NAME
        defaultPaymentCategoryShouldBeFound("categoryName.equals=" + DEFAULT_CATEGORY_NAME);

        // Get all the paymentCategoryList where categoryName equals to UPDATED_CATEGORY_NAME
        defaultPaymentCategoryShouldNotBeFound("categoryName.equals=" + UPDATED_CATEGORY_NAME);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryNameIsNotEqualToSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryName not equals to DEFAULT_CATEGORY_NAME
        defaultPaymentCategoryShouldNotBeFound("categoryName.notEquals=" + DEFAULT_CATEGORY_NAME);

        // Get all the paymentCategoryList where categoryName not equals to UPDATED_CATEGORY_NAME
        defaultPaymentCategoryShouldBeFound("categoryName.notEquals=" + UPDATED_CATEGORY_NAME);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryNameIsInShouldWork() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryName in DEFAULT_CATEGORY_NAME or UPDATED_CATEGORY_NAME
        defaultPaymentCategoryShouldBeFound("categoryName.in=" + DEFAULT_CATEGORY_NAME + "," + UPDATED_CATEGORY_NAME);

        // Get all the paymentCategoryList where categoryName equals to UPDATED_CATEGORY_NAME
        defaultPaymentCategoryShouldNotBeFound("categoryName.in=" + UPDATED_CATEGORY_NAME);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryName is not null
        defaultPaymentCategoryShouldBeFound("categoryName.specified=true");

        // Get all the paymentCategoryList where categoryName is null
        defaultPaymentCategoryShouldNotBeFound("categoryName.specified=false");
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryNameContainsSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryName contains DEFAULT_CATEGORY_NAME
        defaultPaymentCategoryShouldBeFound("categoryName.contains=" + DEFAULT_CATEGORY_NAME);

        // Get all the paymentCategoryList where categoryName contains UPDATED_CATEGORY_NAME
        defaultPaymentCategoryShouldNotBeFound("categoryName.contains=" + UPDATED_CATEGORY_NAME);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryNameNotContainsSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryName does not contain DEFAULT_CATEGORY_NAME
        defaultPaymentCategoryShouldNotBeFound("categoryName.doesNotContain=" + DEFAULT_CATEGORY_NAME);

        // Get all the paymentCategoryList where categoryName does not contain UPDATED_CATEGORY_NAME
        defaultPaymentCategoryShouldBeFound("categoryName.doesNotContain=" + UPDATED_CATEGORY_NAME);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryDescriptionIsEqualToSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryDescription equals to DEFAULT_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldBeFound("categoryDescription.equals=" + DEFAULT_CATEGORY_DESCRIPTION);

        // Get all the paymentCategoryList where categoryDescription equals to UPDATED_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldNotBeFound("categoryDescription.equals=" + UPDATED_CATEGORY_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryDescriptionIsNotEqualToSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryDescription not equals to DEFAULT_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldNotBeFound("categoryDescription.notEquals=" + DEFAULT_CATEGORY_DESCRIPTION);

        // Get all the paymentCategoryList where categoryDescription not equals to UPDATED_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldBeFound("categoryDescription.notEquals=" + UPDATED_CATEGORY_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryDescriptionIsInShouldWork() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryDescription in DEFAULT_CATEGORY_DESCRIPTION or UPDATED_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldBeFound("categoryDescription.in=" + DEFAULT_CATEGORY_DESCRIPTION + "," + UPDATED_CATEGORY_DESCRIPTION);

        // Get all the paymentCategoryList where categoryDescription equals to UPDATED_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldNotBeFound("categoryDescription.in=" + UPDATED_CATEGORY_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryDescriptionIsNullOrNotNull() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryDescription is not null
        defaultPaymentCategoryShouldBeFound("categoryDescription.specified=true");

        // Get all the paymentCategoryList where categoryDescription is null
        defaultPaymentCategoryShouldNotBeFound("categoryDescription.specified=false");
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryDescriptionContainsSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryDescription contains DEFAULT_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldBeFound("categoryDescription.contains=" + DEFAULT_CATEGORY_DESCRIPTION);

        // Get all the paymentCategoryList where categoryDescription contains UPDATED_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldNotBeFound("categoryDescription.contains=" + UPDATED_CATEGORY_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryDescriptionNotContainsSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryDescription does not contain DEFAULT_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldNotBeFound("categoryDescription.doesNotContain=" + DEFAULT_CATEGORY_DESCRIPTION);

        // Get all the paymentCategoryList where categoryDescription does not contain UPDATED_CATEGORY_DESCRIPTION
        defaultPaymentCategoryShouldBeFound("categoryDescription.doesNotContain=" + UPDATED_CATEGORY_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryTypeIsEqualToSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryType equals to DEFAULT_CATEGORY_TYPE
        defaultPaymentCategoryShouldBeFound("categoryType.equals=" + DEFAULT_CATEGORY_TYPE);

        // Get all the paymentCategoryList where categoryType equals to UPDATED_CATEGORY_TYPE
        defaultPaymentCategoryShouldNotBeFound("categoryType.equals=" + UPDATED_CATEGORY_TYPE);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryTypeIsNotEqualToSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryType not equals to DEFAULT_CATEGORY_TYPE
        defaultPaymentCategoryShouldNotBeFound("categoryType.notEquals=" + DEFAULT_CATEGORY_TYPE);

        // Get all the paymentCategoryList where categoryType not equals to UPDATED_CATEGORY_TYPE
        defaultPaymentCategoryShouldBeFound("categoryType.notEquals=" + UPDATED_CATEGORY_TYPE);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryTypeIsInShouldWork() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryType in DEFAULT_CATEGORY_TYPE or UPDATED_CATEGORY_TYPE
        defaultPaymentCategoryShouldBeFound("categoryType.in=" + DEFAULT_CATEGORY_TYPE + "," + UPDATED_CATEGORY_TYPE);

        // Get all the paymentCategoryList where categoryType equals to UPDATED_CATEGORY_TYPE
        defaultPaymentCategoryShouldNotBeFound("categoryType.in=" + UPDATED_CATEGORY_TYPE);
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByCategoryTypeIsNullOrNotNull() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        // Get all the paymentCategoryList where categoryType is not null
        defaultPaymentCategoryShouldBeFound("categoryType.specified=true");

        // Get all the paymentCategoryList where categoryType is null
        defaultPaymentCategoryShouldNotBeFound("categoryType.specified=false");
    }

    @Test
    @Transactional
    void getAllPaymentCategoriesByPaymentIsEqualToSomething() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);
        Payment payment = PaymentResourceIT.createEntity(em);
        em.persist(payment);
        em.flush();
        paymentCategory.setPayment(payment);
        payment.setPaymentCategory(paymentCategory);
        paymentCategoryRepository.saveAndFlush(paymentCategory);
        Long paymentId = payment.getId();

        // Get all the paymentCategoryList where payment equals to paymentId
        defaultPaymentCategoryShouldBeFound("paymentId.equals=" + paymentId);

        // Get all the paymentCategoryList where payment equals to (paymentId + 1)
        defaultPaymentCategoryShouldNotBeFound("paymentId.equals=" + (paymentId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultPaymentCategoryShouldBeFound(String filter) throws Exception {
        restPaymentCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].categoryName").value(hasItem(DEFAULT_CATEGORY_NAME)))
            .andExpect(jsonPath("$.[*].categoryDescription").value(hasItem(DEFAULT_CATEGORY_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].categoryType").value(hasItem(DEFAULT_CATEGORY_TYPE.toString())));

        // Check, that the count call also returns 1
        restPaymentCategoryMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultPaymentCategoryShouldNotBeFound(String filter) throws Exception {
        restPaymentCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restPaymentCategoryMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingPaymentCategory() throws Exception {
        // Get the paymentCategory
        restPaymentCategoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPaymentCategory() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        int databaseSizeBeforeUpdate = paymentCategoryRepository.findAll().size();

        // Update the paymentCategory
        PaymentCategory updatedPaymentCategory = paymentCategoryRepository.findById(paymentCategory.getId()).get();
        // Disconnect from session so that the updates on updatedPaymentCategory are not directly saved in db
        em.detach(updatedPaymentCategory);
        updatedPaymentCategory
            .categoryName(UPDATED_CATEGORY_NAME)
            .categoryDescription(UPDATED_CATEGORY_DESCRIPTION)
            .categoryType(UPDATED_CATEGORY_TYPE);
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(updatedPaymentCategory);

        restPaymentCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, paymentCategoryDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isOk());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeUpdate);
        PaymentCategory testPaymentCategory = paymentCategoryList.get(paymentCategoryList.size() - 1);
        assertThat(testPaymentCategory.getCategoryName()).isEqualTo(UPDATED_CATEGORY_NAME);
        assertThat(testPaymentCategory.getCategoryDescription()).isEqualTo(UPDATED_CATEGORY_DESCRIPTION);
        assertThat(testPaymentCategory.getCategoryType()).isEqualTo(UPDATED_CATEGORY_TYPE);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository).save(testPaymentCategory);
    }

    @Test
    @Transactional
    void putNonExistingPaymentCategory() throws Exception {
        int databaseSizeBeforeUpdate = paymentCategoryRepository.findAll().size();
        paymentCategory.setId(count.incrementAndGet());

        // Create the PaymentCategory
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, paymentCategoryDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository, times(0)).save(paymentCategory);
    }

    @Test
    @Transactional
    void putWithIdMismatchPaymentCategory() throws Exception {
        int databaseSizeBeforeUpdate = paymentCategoryRepository.findAll().size();
        paymentCategory.setId(count.incrementAndGet());

        // Create the PaymentCategory
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository, times(0)).save(paymentCategory);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPaymentCategory() throws Exception {
        int databaseSizeBeforeUpdate = paymentCategoryRepository.findAll().size();
        paymentCategory.setId(count.incrementAndGet());

        // Create the PaymentCategory
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentCategoryMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository, times(0)).save(paymentCategory);
    }

    @Test
    @Transactional
    void partialUpdatePaymentCategoryWithPatch() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        int databaseSizeBeforeUpdate = paymentCategoryRepository.findAll().size();

        // Update the paymentCategory using partial update
        PaymentCategory partialUpdatedPaymentCategory = new PaymentCategory();
        partialUpdatedPaymentCategory.setId(paymentCategory.getId());

        partialUpdatedPaymentCategory
            .categoryName(UPDATED_CATEGORY_NAME)
            .categoryDescription(UPDATED_CATEGORY_DESCRIPTION)
            .categoryType(UPDATED_CATEGORY_TYPE);

        restPaymentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPaymentCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPaymentCategory))
            )
            .andExpect(status().isOk());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeUpdate);
        PaymentCategory testPaymentCategory = paymentCategoryList.get(paymentCategoryList.size() - 1);
        assertThat(testPaymentCategory.getCategoryName()).isEqualTo(UPDATED_CATEGORY_NAME);
        assertThat(testPaymentCategory.getCategoryDescription()).isEqualTo(UPDATED_CATEGORY_DESCRIPTION);
        assertThat(testPaymentCategory.getCategoryType()).isEqualTo(UPDATED_CATEGORY_TYPE);
    }

    @Test
    @Transactional
    void fullUpdatePaymentCategoryWithPatch() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        int databaseSizeBeforeUpdate = paymentCategoryRepository.findAll().size();

        // Update the paymentCategory using partial update
        PaymentCategory partialUpdatedPaymentCategory = new PaymentCategory();
        partialUpdatedPaymentCategory.setId(paymentCategory.getId());

        partialUpdatedPaymentCategory
            .categoryName(UPDATED_CATEGORY_NAME)
            .categoryDescription(UPDATED_CATEGORY_DESCRIPTION)
            .categoryType(UPDATED_CATEGORY_TYPE);

        restPaymentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPaymentCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPaymentCategory))
            )
            .andExpect(status().isOk());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeUpdate);
        PaymentCategory testPaymentCategory = paymentCategoryList.get(paymentCategoryList.size() - 1);
        assertThat(testPaymentCategory.getCategoryName()).isEqualTo(UPDATED_CATEGORY_NAME);
        assertThat(testPaymentCategory.getCategoryDescription()).isEqualTo(UPDATED_CATEGORY_DESCRIPTION);
        assertThat(testPaymentCategory.getCategoryType()).isEqualTo(UPDATED_CATEGORY_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingPaymentCategory() throws Exception {
        int databaseSizeBeforeUpdate = paymentCategoryRepository.findAll().size();
        paymentCategory.setId(count.incrementAndGet());

        // Create the PaymentCategory
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, paymentCategoryDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository, times(0)).save(paymentCategory);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPaymentCategory() throws Exception {
        int databaseSizeBeforeUpdate = paymentCategoryRepository.findAll().size();
        paymentCategory.setId(count.incrementAndGet());

        // Create the PaymentCategory
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository, times(0)).save(paymentCategory);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPaymentCategory() throws Exception {
        int databaseSizeBeforeUpdate = paymentCategoryRepository.findAll().size();
        paymentCategory.setId(count.incrementAndGet());

        // Create the PaymentCategory
        PaymentCategoryDTO paymentCategoryDTO = paymentCategoryMapper.toDto(paymentCategory);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paymentCategoryDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PaymentCategory in the database
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository, times(0)).save(paymentCategory);
    }

    @Test
    @Transactional
    void deletePaymentCategory() throws Exception {
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);

        int databaseSizeBeforeDelete = paymentCategoryRepository.findAll().size();

        // Delete the paymentCategory
        restPaymentCategoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, paymentCategory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PaymentCategory> paymentCategoryList = paymentCategoryRepository.findAll();
        assertThat(paymentCategoryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the PaymentCategory in Elasticsearch
        verify(mockPaymentCategorySearchRepository, times(1)).deleteById(paymentCategory.getId());
    }

    @Test
    @Transactional
    void searchPaymentCategory() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        paymentCategoryRepository.saveAndFlush(paymentCategory);
        when(mockPaymentCategorySearchRepository.search(queryStringQuery("id:" + paymentCategory.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(paymentCategory), PageRequest.of(0, 1), 1));

        // Search the paymentCategory
        restPaymentCategoryMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + paymentCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].categoryName").value(hasItem(DEFAULT_CATEGORY_NAME)))
            .andExpect(jsonPath("$.[*].categoryDescription").value(hasItem(DEFAULT_CATEGORY_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].categoryType").value(hasItem(DEFAULT_CATEGORY_TYPE.toString())));
    }
}
