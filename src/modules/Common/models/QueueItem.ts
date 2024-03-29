import { Document, Model, Schema, model, models } from 'mongoose';

import { Search } from './Search';

export enum QueueItemStatuses {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  DONE_ERROR = 'DONE_ERROR',
}

export enum QueueItemActionTypes {
  SEARCH = 'SEARCH',
}
export interface QueueItem extends Document {
  name: string;
  priority: number;
  action: QueueItemActionTypes;
  status: QueueItemStatuses;
  search: Search;
  processorId?: string;
  processingDate?: Date;
  metadata?: {
    lastEvaluatedUntilTweetId?: string;
    lastEvaluatedSinceTweetId?: string;
    numberTimesCrawled?: number;
  };
}

const schema = new Schema(
  {
    action: {
      type: String,
      required: true,
      index: true,
      enum: Object.values(QueueItemActionTypes),
    },
    priority: {
      type: Number,
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      index: true,
      enum: Object.values(QueueItemStatuses),
    },
    processorId: {
      type: String,
      index: true,
      description:
        'The name of the processor it has been processed by initially. This is useful if the procesor fails and needs to start again',
    },
    processingDate: {
      type: Date,
      required: true,
      index: true,
      default: new Date(),
    },
    metadata: {
      type: Schema.Types.Mixed,
      description:
        'field used to pass some filters or additional data to process data more finely (startDate, endDate, etc...)',
    },
    search: { type: Schema.Types.ObjectId, ref: 'Search' },
  },
  {
    strict: 'throw',
    timestamps: true,
  }
);
const QueueItemModel: Model<QueueItem> = models?.QueueItem || model('QueueItem', schema);

export default QueueItemModel;
