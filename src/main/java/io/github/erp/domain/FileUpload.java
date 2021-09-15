package io.github.erp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FileUpload.
 */
@Entity
@Table(name = "file_upload")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "fileupload")
public class FileUpload implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "file_name", nullable = false, unique = true)
    private String fileName;

    @Column(name = "period_from")
    private LocalDate periodFrom;

    @Column(name = "period_to")
    private LocalDate periodTo;

    @NotNull
    @Column(name = "file_type_id", nullable = false)
    private Long fileTypeId;

    @Lob
    @Column(name = "data_file", nullable = false)
    private byte[] dataFile;

    @NotNull
    @Column(name = "data_file_content_type", nullable = false)
    private String dataFileContentType;

    @Column(name = "upload_successful")
    private Boolean uploadSuccessful;

    @Column(name = "upload_processed")
    private Boolean uploadProcessed;

    @Column(name = "upload_token", unique = true)
    private String uploadToken;

    @ManyToMany
    @JoinTable(
        name = "rel_file_upload__placeholder",
        joinColumns = @JoinColumn(name = "file_upload_id"),
        inverseJoinColumns = @JoinColumn(name = "placeholder_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = {
            "containingPlaceholder",
            "dealers",
            "fileTypes",
            "fileUploads",
            "fixedAssetAcquisitions",
            "fixedAssetDepreciations",
            "fixedAssetNetBookValues",
            "invoices",
            "messageTokens",
            "payments",
            "paymentCalculations",
            "paymentRequisitions",
            "paymentCategories",
            "taxReferences",
            "taxRules",
        },
        allowSetters = true
    )
    private Set<Placeholder> placeholders = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FileUpload id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public FileUpload description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileName() {
        return this.fileName;
    }

    public FileUpload fileName(String fileName) {
        this.setFileName(fileName);
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public LocalDate getPeriodFrom() {
        return this.periodFrom;
    }

    public FileUpload periodFrom(LocalDate periodFrom) {
        this.setPeriodFrom(periodFrom);
        return this;
    }

    public void setPeriodFrom(LocalDate periodFrom) {
        this.periodFrom = periodFrom;
    }

    public LocalDate getPeriodTo() {
        return this.periodTo;
    }

    public FileUpload periodTo(LocalDate periodTo) {
        this.setPeriodTo(periodTo);
        return this;
    }

    public void setPeriodTo(LocalDate periodTo) {
        this.periodTo = periodTo;
    }

    public Long getFileTypeId() {
        return this.fileTypeId;
    }

    public FileUpload fileTypeId(Long fileTypeId) {
        this.setFileTypeId(fileTypeId);
        return this;
    }

    public void setFileTypeId(Long fileTypeId) {
        this.fileTypeId = fileTypeId;
    }

    public byte[] getDataFile() {
        return this.dataFile;
    }

    public FileUpload dataFile(byte[] dataFile) {
        this.setDataFile(dataFile);
        return this;
    }

    public void setDataFile(byte[] dataFile) {
        this.dataFile = dataFile;
    }

    public String getDataFileContentType() {
        return this.dataFileContentType;
    }

    public FileUpload dataFileContentType(String dataFileContentType) {
        this.dataFileContentType = dataFileContentType;
        return this;
    }

    public void setDataFileContentType(String dataFileContentType) {
        this.dataFileContentType = dataFileContentType;
    }

    public Boolean getUploadSuccessful() {
        return this.uploadSuccessful;
    }

    public FileUpload uploadSuccessful(Boolean uploadSuccessful) {
        this.setUploadSuccessful(uploadSuccessful);
        return this;
    }

    public void setUploadSuccessful(Boolean uploadSuccessful) {
        this.uploadSuccessful = uploadSuccessful;
    }

    public Boolean getUploadProcessed() {
        return this.uploadProcessed;
    }

    public FileUpload uploadProcessed(Boolean uploadProcessed) {
        this.setUploadProcessed(uploadProcessed);
        return this;
    }

    public void setUploadProcessed(Boolean uploadProcessed) {
        this.uploadProcessed = uploadProcessed;
    }

    public String getUploadToken() {
        return this.uploadToken;
    }

    public FileUpload uploadToken(String uploadToken) {
        this.setUploadToken(uploadToken);
        return this;
    }

    public void setUploadToken(String uploadToken) {
        this.uploadToken = uploadToken;
    }

    public Set<Placeholder> getPlaceholders() {
        return this.placeholders;
    }

    public void setPlaceholders(Set<Placeholder> placeholders) {
        this.placeholders = placeholders;
    }

    public FileUpload placeholders(Set<Placeholder> placeholders) {
        this.setPlaceholders(placeholders);
        return this;
    }

    public FileUpload addPlaceholder(Placeholder placeholder) {
        this.placeholders.add(placeholder);
        placeholder.getFileUploads().add(this);
        return this;
    }

    public FileUpload removePlaceholder(Placeholder placeholder) {
        this.placeholders.remove(placeholder);
        placeholder.getFileUploads().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FileUpload)) {
            return false;
        }
        return id != null && id.equals(((FileUpload) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FileUpload{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", fileName='" + getFileName() + "'" +
            ", periodFrom='" + getPeriodFrom() + "'" +
            ", periodTo='" + getPeriodTo() + "'" +
            ", fileTypeId=" + getFileTypeId() +
            ", dataFile='" + getDataFile() + "'" +
            ", dataFileContentType='" + getDataFileContentType() + "'" +
            ", uploadSuccessful='" + getUploadSuccessful() + "'" +
            ", uploadProcessed='" + getUploadProcessed() + "'" +
            ", uploadToken='" + getUploadToken() + "'" +
            "}";
    }
}
