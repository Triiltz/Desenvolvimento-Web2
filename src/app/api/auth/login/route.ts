import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';

const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha inválida'),
});

function createPseudoToken(userId: number) {
  const payload = JSON.stringify({ sub: userId, iat: Date.now() });
  return Buffer.from(payload).toString('base64url');
}

export async function POST(req: NextRequest) {
  try {
    // Garantir que o body seja JSON válido; tratar erro de parsing explicitamente
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type deve ser application/json' },
        { status: 415 }
      );
    }
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: 'JSON malformado' }, { status: 400 });
    }
    const parsed = LoginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    const token = createPseudoToken(user.id);
    const res = NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
    // Define cookie para middleware poder validar server-side
    res.cookies.set('fizy_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });
    return res;
  } catch (e) {
    console.error('Login error', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
