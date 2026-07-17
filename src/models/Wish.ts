import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMemory {
  url: string;
  caption: string;
}

export interface ITimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface ITrivia {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IWish extends Document {
  name: string;
  age?: number;
  sender: string;
  message: string;
  theme: string;
  memories?: IMemory[];
  deliveryLock?: Date;
  timeline?: ITimelineEvent[];
  trivia?: ITrivia[];
  doodleType?: string;
  ambience?: string;
  voiceNoteUrl?: string; // Base64 audio string or URL
  createdAt: Date;
  deleteAt: Date; // Used for TTL index
}

const MemorySchema = new Schema<IMemory>({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
});

const TimelineEventSchema = new Schema<ITimelineEvent>({
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
});

const TriviaSchema = new Schema<ITrivia>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
});

const WishSchema = new Schema<IWish>({
  name: { type: String, required: true },
  age: { type: Number },
  sender: { type: String, required: true },
  message: { type: String, required: true },
  theme: { type: String, required: true },
  memories: [MemorySchema],
  deliveryLock: { type: Date },
  timeline: [TimelineEventSchema],
  trivia: [TriviaSchema],
  doodleType: { type: String },
  ambience: { type: String },
  voiceNoteUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, required: true },
});

// TTL index to automatically delete the document after deleteAt
WishSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

const Wish: Model<IWish> = mongoose.models.Wish || mongoose.model<IWish>('Wish', WishSchema);

export default Wish;
