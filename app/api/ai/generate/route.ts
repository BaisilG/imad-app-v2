import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY missing' }, { status: 400 });
  }

  const { title } = await request.json();
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Write concise technical blog draft in HTML with headings and code block when relevant.'
      },
      { role: 'user', content: `Write a draft post about: ${title || 'latest developer tooling trends'}` }
    ]
  });

  const html = completion.choices[0]?.message?.content ?? '<p>No content generated.</p>';

  return NextResponse.json({
    excerpt: html.replace(/<[^>]+>/g, '').slice(0, 150),
    html,
    content: {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: html.replace(/<[^>]+>/g, '') }] }],
      html
    }
  });
}
