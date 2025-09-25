import { NextRequest, NextResponse } from 'next/server';import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/; // mín 8, maiúscula, minúscula, número, símbolo

const SignupSchema = z
  .object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z
      .string()
      .email('Email inválido')
      .transform((v) => v.toLowerCase()),
    password: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .refine(
        (v) => strongPasswordRegex.test(v),
        'Senha fraca: use maiúscula, minúscula, número e símbolo'
      ),
    confirmPassword: z.string().min(8),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, 'Termos devem ser aceitos'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

function createPseudoToken(userId: number) {
  const payload = JSON.stringify({ sub: userId, iat: Date.now() });
  return Buffer.from(payload).toString('base64url');
}

export async function POST(req: NextRequest) {
  try {
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

    const parsed = SignupSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email já registrado' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    const token = createPseudoToken(user.id);
    const res = NextResponse.json(
      {
        token,
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 }
    );
    res.cookies.set('fizy_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error('Signup error', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
