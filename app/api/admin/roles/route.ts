import { NextResponse } from 'next/server';
import prisma from '@utils/prisma';

export async function GET() {
  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json({ roles }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
