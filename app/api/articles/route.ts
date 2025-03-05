import { NextRequest, NextResponse } from 'next/server';
import { hasRole } from '@/app/utils/roles';
import { authenticateUser } from '@/app/utils/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const user = await authenticateUser(req.body.email, req.body.password);
    if (!hasRole(user, 'Admin') && !hasRole(user, 'Editor Article')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Créer l'article
    const article = await prisma.article.create({
      data: {
        title: req.body.title,
        body: req.body.body,
        image: req.body.image,
        authorId: user.userId,
      },
    });

    return NextResponse.json(article);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

