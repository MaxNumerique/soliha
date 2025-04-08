import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// GET - Récupérer tous les articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Créer un nouvel article
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET || 'SECRET') as any;
    const userRoles = decodedToken.roles;

    const canManageArticles = userRoles.some((role: string) => 
      ['Admin', 'Admin Article', 'Utilisateur Spécial'].includes(role)
    );

    if (!canManageArticles) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, body, images } = await req.json();
    const article = await prisma.article.create({
      include: {
        images: true
      },
      data: {
        title,
        body,
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            order: index
          }))
        },
        authorId: decodedToken.userId
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}