import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
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
    // Supprimer toutes les images existantes
    await prisma.articleImage.deleteMany({
      where: {
        articleId: parseInt(params.id)
      }
    });

    // Mettre à jour l'article avec les nouvelles images
    const article = await prisma.article.update({
      where: { id: Number(params.id) },
      data: {
        title,
        body,
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            order: index
          }))
        },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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
