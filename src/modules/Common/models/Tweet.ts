import { Document, Model, Schema, model, models } from 'mongoose';

import { User } from './User';

export interface BasicTweet extends Document {
  date: string;
  hour: string;
  content: string;
  id: string;
  username: string;
  user: User;
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  quoteCount: number;
  conversationId: string;
  lang: string;
  sourceUrl: string;
  outlinks: string[] | null;
  media: TweetMedia[] | null;
  retweetedTweetId: string | null;
  retweetedTweet?: any;
  quotedTweetId: string | null;
  quotedTweet?: any;
  inReplyToTweetId: string | null;
  inReplyToUsername: string | null;
  inReplyToUser?: User;
  mentionedUsernames: string[] | null;
  coordinates: TweetCoordinates | null;
  place: TweetPlace | null;
  hashtags: string[] | null;
  cashtags: string[] | null;
  // links to be able to easily get all users concerned by a search
  searches: string[];
}

export interface TweetCoordinates {
  type: 'Point';
  coordinates: number[];
}

export interface TweetPlace {
  fullName: string;
  name: string;
  type: string;
  country: string;
  countryCode: string;
}

export interface TweetMedia {
  type: string;
  // if type is photo
  fullUrl?: string;
  previewUrl?: string;
  // if type is photo
  thumbnailUrl?: string;
  bitrate?: number;
  duration?: number;
  views?: number;
  contentType?: string;
}

export type Tweet = BasicTweet;

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const MediaSchema = new Schema({
  type: { type: String, index: true },
  fullUrl: { type: String, index: true },
  previewUrl: { type: String, index: true },
  thumbnailUrl: { type: String, index: true },
  bitrate: { type: Number, index: true },
  contentType: { type: String, index: true },
});

const PlaceSchema = new Schema({
  fullName: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  country: { type: String, index: true },
  countryCode: { type: String, index: true },
});

const schema = new Schema<Tweet>(
  {
    id: { type: String, required: true, index: true, unique: true },
    date: { type: Date, required: true, index: true },
    hour: { type: Date, required: true, index: true },
    // NOTE: we do not index `content` on purpose
    // it would be too costy in case text is too long or contains unicode characters
    content: { type: String, required: true },
    username: { type: String, required: true, index: true },
    replyCount: { type: Number, required: true, index: true },
    retweetCount: { type: Number, required: true, index: true },
    likeCount: { type: Number, required: true, index: true },
    quoteCount: { type: Number, required: true, index: true },
    conversationId: { type: String, index: true },
    lang: { type: String, index: true },
    sourceUrl: { type: String, index: true },
    outlinks: [
      {
        type: String,
        index:
          false /* Sometimes the links are too long and we do not need them to be searched on */,
      },
    ],
    media: [{ type: MediaSchema }],
    retweetedTweetId: { type: String, index: true },
    quotedTweetId: { type: String, index: true },
    inReplyToTweetId: { type: String, index: true },
    inReplyToUsername: { type: String, index: true },
    mentionedUsernames: [{ type: String, index: true }],
    coordinates: { type: PointSchema, index: '2dsphere' },
    place: { type: PlaceSchema, index: true },
    hashtags: [{ type: String, index: true }],
    cashtags: [{ type: String, index: true }],
    searches: [{ type: Schema.Types.ObjectId, index: true }],
  },
  {
    toObject: { virtuals: true },
    strict: 'throw',
    timestamps: true,
  }
);

schema.virtual('user', {
  ref: 'User',
  localField: 'username',
  foreignField: 'username',
  justOne: true,
});
schema.virtual('inReplyUser', {
  ref: 'User',
  localField: 'inReplyUser',
  foreignField: 'username',
  justOne: true,
});

schema.virtual('retweetedTweet', {
  ref: 'Tweet',
  localField: 'retweetedTweetId',
  foreignField: 'id',
  justOne: true,
});
schema.virtual('quotedTweet', {
  ref: 'Tweet',
  localField: 'quotedTweetId',
  foreignField: 'id',
  justOne: true,
});
schema.virtual('inReplyToTweet', {
  ref: 'Tweet',
  localField: 'inReplyToTweet',
  foreignField: 'id',
  justOne: true,
});

// combination array of

function getCombinations(valuesArray: String[]) {
  var combi = [];
  var temp = [];
  var slent = Math.pow(2, valuesArray.length);

  for (var i = 0; i < slent; i++) {
    temp = [];
    for (var j = 0; j < valuesArray.length; j++) {
      if (i & Math.pow(2, j)) {
        temp.push(valuesArray[j]);
      }
    }
    if (temp.length > 0) {
      combi.push(temp);
    }
  }

  combi.sort((a, b) => a.length - b.length);
  return combi;
}

const allCombinations = getCombinations(['hour', 'lang', 'username', 'hashtags']);

schema.index({ date: 1, searches: 1 });
schema.index({ hour: -1, searches: 1 });
schema.index({ searches: 1, hour: -1 });

allCombinations.forEach((combination) => {
  schema.index({
    // @ts-ignore
    ...combination.reduce((acc, val) => ({ ...acc, [val]: 1 }), {}),
    searches: 1,
  });
});

const TweetModel: Model<Tweet> = models?.Tweet || model('Tweet', schema);

export default TweetModel;
