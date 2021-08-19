import './Search';

import { Document, Model, Schema, model, models } from 'mongoose';

export interface SearchVolumetry extends Document {
  date: Date;
  nbTweets: number;
  nbRetweets: number;
  nbLikes: number;
  nbQuotes: number;
  usernames: { [key: string]: number };
  languages: { [key: string]: number };
  associatedHashtags: { [key: string]: number };
  search: string;
  platformId: 'twitter';
}

const schema = new Schema(
  {
    date: { type: Date, required: true, index: true },
    nbTweets: { type: Number, required: true, index: true },
    nbRetweets: { type: Number, required: true, index: true },
    nbLikes: { type: Number, required: true, index: true },
    nbQuotes: { type: Number, required: true, index: true },
    languages: { type: Schema.Types.Mixed, default: {} },
    usernames: { type: Schema.Types.Mixed, default: {} },
    associatedHashtags: { type: Schema.Types.Mixed, default: {} },
    platformId: { type: String, required: true, index: true, enum: 'twitter', default: 'twitter' },
    search: { type: Schema.Types.ObjectId, ref: 'Search' },
  },
  {
    strict: 'throw',
    timestamps: true,
  }
);

const SearchVolumetryModel: Model<SearchVolumetry> =
  models?.SearchVolumetry || model('SearchVolumetry', schema);

export default SearchVolumetryModel;
