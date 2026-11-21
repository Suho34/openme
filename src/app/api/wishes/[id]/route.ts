import { NextResponse } from "next/server";
import connectToDatabase from '@/lib/mongodb';
import Wish from '@/models/Wish';
import { toViewableWish } from '@/lib/wishAccess';

const OBJECT_ID = /^[a-f0-9]{24}$/i;

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    if (!OBJECT_ID.test(params.id)) {
      return NextResponse.json({ success: false, error: 'Wish not found' }, { status: 404 });
    }

    await connectToDatabase();

    const wish = await Wish.findById(params.id).lean();

    if (!wish) {
      return NextResponse.json({ success: false, error: 'Wish not found' }, { status: 404 });
    }

    // A scheduled wish only exposes its countdown data until the lock expires.
    return NextResponse.json(
      { success: true, wish: toViewableWish(wish as unknown as Record<string, unknown>) },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('Error fetching wish:', error);
    return NextResponse.json({ success: false, error: 'Could not load this keepsake.' }, { status: 500 });
  }
}
