import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@utils/prisma';


// Route pour modifier l'utilisateur

// export async function PUT(req: Request) {
//     try {
//         const { id } = req.params;
//         const { name, email, password, role } = await req.json();

//         // Vérifier si l'utilisateur existe
//         const existingUser = await prisma.user.findUnique({
//             where: { id },
//         });



//     } catch (error) {
        
//     }
// }