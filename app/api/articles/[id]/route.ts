import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// PUT - Modifier un article
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate input
    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    // Validate images
    if (images && !Array.isArray(images)) {
      return NextResponse.json({ error: 'Images must be an array' }, { status: 400 });
    }

    // Ensure article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: Number(params.id) }
    });

    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    // Supprimer toutes les images existantes
    await prisma.articleImage.deleteMany({
      where: {
        articleId: parseInt(params.id)
      }
    });

    // Prepare images data
    const imagesData = images && images.length > 0 
      ? images.map((image: { url: string, publicId?: string }, index: number) => {
          // Validate each image object
          if (!image || !image.url) {
            throw new Error(`Invalid image at index ${index}: missing URL`);
          }
          
          return {
            url: image.url,
            cloudinaryPublicId: image.publicId || null,
            order: index
          };
        })
      : undefined;

    // Mettre à jour l'article avec les nouvelles images
    const article = await prisma.article.update({
      where: { id: Number(params.id) },
      data: {
        title,
        body,
        images: imagesData ? { create: imagesData } : undefined,
        updatedAt: new Date(),
      },
      include: {
        images: true
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Article update error:', error);
    
    // More detailed error handling
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Prisma specific error handling
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json({ 
          error: 'Unique constraint violation', 
          details: error.message 
        }, { status: 400 });
      }
      
      // Foreign key constraint violation
      if (error.code === 'P2003') {
        return NextResponse.json({ 
          error: 'Related record not found', 
          details: error.message 
        }, { status: 400 });
      }
    }

    // Generic error handling
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: 'Internal Server Error', 
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - Supprimer un article
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Les images seront automatiquement supprimées grâce à onDelete: Cascade
    await prisma.article.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
