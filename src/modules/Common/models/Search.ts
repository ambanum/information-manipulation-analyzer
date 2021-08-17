import { Document, Model, Schema, model, models } from 'mongoose';

import { SearchVolumetry } from './SearchVolumetry';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export enum SearchStatuses {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE_FIRST_FETCH = 'DONE_FIRST_FETCH',
  PROCESSING_PREVIOUS = 'PROCESSING_PREVIOUS',
  PROCESSING_NEW = 'PROCESSING_NEW',
  DONE = 'DONE',
  DONE_ERROR = 'DONE_ERROR',
}

export enum SearchTypes {
  KEYWORD = 'KEYWORD',
  HASHTAG = 'HASHTAG',
  MENTION = 'MENTION',
  URL = 'URL',
  CASHTAG = 'CASHTAG',
}

export type SearchStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'DONE_FIRST_FETCH'
  | 'PROCESSING_PREVIOUS'
  | 'DONE'
  | 'DONE_ERROR';

export interface Search extends Document {
  name: string;
  status: SearchStatus;
  type: SearchTypes;
  volumetry: SearchVolumetry[];
  firstOccurenceDate: string;
  oldestProcessedDate?: string;
  newestProcessedDate?: string;
  error?: string;
}

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      index: true,
      enum: Object.values(SearchStatuses),
    },
    type: {
      type: String,
      required: true,
      index: true,
      enum: Object.values(SearchTypes),
    },
    firstOccurenceDate: {
      type: Date,
      index: true,
    },
    oldestProcessedDate: {
      type: Date,
      index: true,
    },
    newestProcessedDate: {
      type: Date,
      index: true,
    },
  },
  {
    strict: 'throw',
    timestamps: true,
  }
);

schema.plugin(mongooseLeanVirtuals);

schema.virtual('volumetry', {
  ref: 'SearchVolumetry',
  localField: '_id',
  foreignField: 'search',
});

const SearchModel: Model<Search> = models?.Search || model('Search', schema);

export default SearchModel;
