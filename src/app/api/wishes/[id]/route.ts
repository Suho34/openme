import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Wish from '@/models/Wish';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await connectToDatabase();

    const { id } = params;
    const wish = await Wish.findById(id);

    if (!wish) {
      return NextResponse.json({ success: false, error: 'Wish not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, wish });
  } catch (error: any) {
    console.error('Error fetching wish:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
