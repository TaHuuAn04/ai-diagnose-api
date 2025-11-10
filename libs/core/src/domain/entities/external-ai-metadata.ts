import { AiServiceName, KnowledgeDataSourceType } from '../enums';

import { BaseEntity } from './base';

export class DifyUserMetadata {
  accountId: string;

  tenantId: string;
}

export class DifyDatasetMetadata {
  id: string;

  name: string;

  dataSourceType: KnowledgeDataSourceType;

  enabled: boolean;
}

export class DifyAppMetadata {
  appId: string;

  accessToken: string;

  datasets?: DifyDatasetMetadata[];

  modelConfig?: string;

  datasetIds?: string[];
}

export class ExternalAiMetadataEntity extends BaseEntity {
  referenceEntity: string;

  referenceId: string;

  metadata: {
    [AiServiceName.DIFY]: {
      app?: DifyAppMetadata;
      user?: DifyUserMetadata;
    };
  };
}
