import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Wish from '@/models/Wish';
import { z } from 'zod';

const wishSchema = z.object({
  name: z.string().min(1).max(100),
  age: z.number().optional(),
  sender: z.string().min(1).max(100),
  message: z.string().min(1).max(5000),
  theme: z.string().max(20),
  ambience: z.string().max(20).optional(),
  voiceNoteUrl: z.string().max(4000000).optional(), // ~3MB for 60s base64 audio max
  doodleType: z.string().max(20).optional(),
  deliveryLock: z.number().optional(),
  demo: z.boolean().optional(),
  memories: z.array(z.object({
    url: z.string().max(5000000), // ~5MB base64 string max
    caption: z.string().max(200)
  })).max(20).optional(),
  timeline: z.array(z.object({
    date: z.string().max(50),
    title: z.string().max(100),
    description: z.string().max(500)
  })).max(20).optional(),
  trivia: z.array(z.object({
    question: z.string().max(200),
    options: z.array(z.string().max(100)).max(6),
    correctAnswerIndex: z.number()
  })).max(10).optional(),
});

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const rawBody = await request.json();
    
    // Validate the incoming payload securely
    const validationResult = wishSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: validationResult.error.issues },
        { status: 400 }
      );
    }
    
    const body = validationResult.data;
    
    // Calculate deleteAt (7 days after deliveryLock, or 7 days after now)
    let deleteAt = new Date();
    if (body.deliveryLock) {
      deleteAt = new Date(new Date(body.deliveryLock).getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      deleteAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const newWish = new Wish({
      ...body,
      deleteAt,
    });

    const savedWish = await newWish.save();

    return NextResponse.json({ success: true, id: savedWish._id.toString() }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving wish:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
