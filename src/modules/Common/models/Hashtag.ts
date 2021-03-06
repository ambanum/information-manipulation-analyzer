import './HashtagVolumetry';

import * as mongoose from 'mongoose';

import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

const { Schema } = mongoose;

enum hashtagStatuses {
  PENDING = 'PENDING',
  DONE = 'DONE',
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
      enum: Object.values(hashtagStatuses),
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
  ref: 'HashtagVolumetry',
  localField: '_id',
  foreignField: 'hashtag',
});

export default mongoose?.models?.Hashtag || mongoose.model('Hashtag', schema);
