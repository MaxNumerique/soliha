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
    console.error('Erreur lors de la récupération des articles:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Créer un nouvel article
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      console.error('No token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token.value, process.env.JWT_SECRET || 'SECRET') as any;
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userRoles = decodedToken.roles;

    const canManageArticles = userRoles.some((role: string) => 
      ['Admin', 'Admin Article', 'Utilisateur Spécial'].includes(role)
    );

    if (!canManageArticles) {
      console.error('User does not have permission to manage articles', { roles: userRoles });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, body, images } = await req.json();

    console.log('Received article data:', { 
      title, 
      body, 
      imagesCount: images ? images.length : 0 
    });

    // Validate input
    if (!title || !body) {
      console.error('Missing required fields', { title, body });
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    // Validate images
    const validImages = images 
      ? images.filter((img: any) => img && typeof img.url === 'string')
      : [];

    const article = await prisma.article.create({
      include: {
        images: true
      },
      data: {
        title,
        body,
        images: validImages.length > 0 ? {
          create: validImages.map((img: any, index: number) => ({
            url: img.url || img,  // Handle both { url: '...' } and direct string
            order: index
          }))
        } : undefined,
        authorId: decodedToken.userId
      }
    });

    console.log('Article created successfully:', article);

    return NextResponse.json(article);
  } catch (error) {
    console.error('Detailed error during article creation:', error);
    return NextResponse.json({ 
      error: error instanceof Error 
        ? error.message 
        : 'Internal Server Error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}