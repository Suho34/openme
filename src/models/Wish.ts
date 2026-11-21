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

export interface IScrollNote {
  id: string;
  text: string;
  tag?: string;
}

export interface ITimeCapsule {
  id: string;
  prompt: string;
  message: string;
  voiceNoteUrl?: string;
  photoUrl?: string;
  voucher?: string;
  unlockedAt?: string;
}

export interface IWish extends Document {
  name: string;
  age?: number;
  sender: string;
  message: string;
  theme: string;
  replyTo?: string; // Id of the keepsake this one answers, if any
  reaction?: string; // One-tap reply: cried | loved | laughed | grateful | hug
  memories?: IMemory[];
  deliveryLock?: Date;
  timeline?: ITimelineEvent[];
  ambience?: string;
  cakeStyle?: string;
  letterFont?: string;
  voiceNoteUrl?: string; // Base64 audio string or URL
  tuneUrl?: string;
  tuneDurationSeconds?: number | null;
  scrollNotes?: IScrollNote[];
  scrollJarTitle?: string;
  timeCapsules?: ITimeCapsule[];
  createdAt: Date;
  deleteAt: Date; // Used for TTL index
  /** Private token that unlocks the sender-facing read receipt at /sent/[id]. */
  senderKey?: string;
  firstOpenedAt?: Date;
  lastOpenedAt?: Date;
  openCount?: number;
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

const ScrollNoteSchema = new Schema<IScrollNote>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  tag: { type: String },
});

const TimeCapsuleSchema = new Schema<ITimeCapsule>({
  id: { type: String, required: true },
  prompt: { type: String, required: true },
  message: { type: String, required: true },
  voiceNoteUrl: { type: String },
  photoUrl: { type: String },
  voucher: { type: String },
  unlockedAt: { type: String },
});

const WishSchema = new Schema<IWish>({
  name: { type: String, required: true },
  age: { type: Number },
  sender: { type: String, required: true },
  // A one-tap or voice reply can carry no words at all.
  message: { type: String, default: '' },
  theme: { type: String, required: true },
  replyTo: { type: String },
  reaction: { type: String },
  memories: [MemorySchema],
  deliveryLock: { type: Date },
  timeline: [TimelineEventSchema],
  ambience: { type: String },
  cakeStyle: { type: String },
  letterFont: { type: String },
  voiceNoteUrl: { type: String },
  tuneUrl: { type: String },
  tuneDurationSeconds: { type: Number, default: null },
  scrollNotes: [ScrollNoteSchema],
  scrollJarTitle: { type: String },
  timeCapsules: [TimeCapsuleSchema],
  createdAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, required: true },
  senderKey: { type: String, index: true },
  firstOpenedAt: { type: Date },
  lastOpenedAt: { type: Date },
  openCount: { type: Number, default: 0 },
});

// TTL index to automatically delete the document after deleteAt
WishSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

const Wish: Model<IWish> = mongoose.models.Wish || mongoose.model<IWish>('Wish', WishSchema);

export default Wish;
