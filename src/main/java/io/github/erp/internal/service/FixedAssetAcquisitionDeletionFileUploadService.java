package io.github.erp.internal.service;

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
import tech.jhipster.service.filter.StringFilter;
import io.github.erp.internal.framework.service.DeletionUploadService;
import io.github.erp.service.FixedAssetAcquisitionQueryService;
import io.github.erp.service.FileUploadService;
import io.github.erp.service.criteria.FixedAssetAcquisitionCriteria;
import io.github.erp.service.dto.FixedAssetAcquisitionDTO;
import io.github.erp.service.dto.FileUploadDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("fixedAssetAcquisitionDeletionFileUploadService")
public class FixedAssetAcquisitionDeletionFileUploadService implements DeletionUploadService<FixedAssetAcquisitionDTO> {

    private final FileUploadService FileUploadService;
    private final FixedAssetAcquisitionQueryService fixedAssetAcquisitionQueryService;

    public FixedAssetAcquisitionDeletionFileUploadService(FileUploadService FileUploadService, FixedAssetAcquisitionQueryService fixedAssetAcquisitionQueryService) {
        this.FileUploadService = FileUploadService;
        this.fixedAssetAcquisitionQueryService = fixedAssetAcquisitionQueryService;
    }

    @Override
    public Optional<FileUploadDTO> findOne(long fileId) {

        return FileUploadService.findOne(fileId);
    }

    @Override
    public Optional<List<FixedAssetAcquisitionDTO>> findAllByUploadToken(String stringToken) {
        FixedAssetAcquisitionCriteria criteria = new FixedAssetAcquisitionCriteria();
        StringFilter uploadToken = new StringFilter();
        uploadToken.setEquals(stringToken);
        criteria.setFileUploadToken(uploadToken);
        return Optional.of(fixedAssetAcquisitionQueryService.findByCriteria(criteria));
    }
}
