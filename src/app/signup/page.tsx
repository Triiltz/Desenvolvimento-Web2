'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TextInput } from '@/components/ui/TextInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { SocialButton } from '@/components/ui/SocialButton';

interface MessageState {
  text: string;
  type: 'info' | 'success' | 'error';
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    if (message) {
      timer = window.setTimeout(() => setMessage(null), 3200);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setMessage({ text: 'Preencha todos os campos.', type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ text: 'As senhas não coincidem.', type: 'error' });
      return;
    }
    if (!acceptTerms) {
      setMessage({ text: 'É necessário aceitar os termos.', type: 'error' });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          acceptTerms,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || 'Falha no cadastro', type: 'error' });
        return;
      }
      setMessage({ text: 'Conta criada com sucesso!', type: 'success' });
      localStorage.setItem('fizy_token', data.token);
      localStorage.setItem('fizy_last_email', email);
      setTimeout(() => router.push('/'), 1000);
    } catch (err) {
      setMessage({ text: 'Erro ao criar conta.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider: string) => {
    setMessage({
      text: `Cadastro com ${provider} em desenvolvimento`,
      type: 'info',
    });
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[#f8f9fa] p-4 md:p-8 lg:p-10">
      {message && (
        <div
          className={`fixed left-1/2 top-5 z-[1000] -translate-x-1/2 rounded-xl px-6 py-3 text-sm font-medium text-white shadow-lg animate-slide-down ${
            message.type === 'success'
              ? 'bg-green-600'
              : message.type === 'error'
              ? 'bg-red-600'
              : 'bg-sky-600'
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="flex w-full max-w-[480px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] animate-fade-in-up lg:max-w-[1200px] lg:min-h-[680px] lg:flex-row lg:rounded-[28px] lg:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.15),0_10px_25px_-5px_rgba(0,0,0,0.08)] lg:backdrop-blur-sm">
        <div className="relative flex flex-col items-center gap-4 border-b border-[#e5e5e5] bg-gradient-to-br from-[#ffe4d6] to-white px-8 py-8 text-center lg:flex-1 lg:justify-center lg:gap-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-12 lg:[background:radial-gradient(circle_at_30%_30%,#ffffff_0%,#ffe4d6_70%)]">
          <div className="absolute -right-20 -top-16 hidden h-80 w-80 rounded-full bg-gradient-to-br from-[#fe4f02] to-[#ff8a4a] opacity-25 blur-lg mix-blend-multiply lg:block animate-[float_10s_linear_infinite]" />
          <div className="absolute -bottom-20 -left-16 hidden h-56 w-56 rounded-full bg-gradient-to-br from-[#fe4f02] to-[#ff8a4a] opacity-25 blur-lg mix-blend-multiply lg:block animate-[float_10s_linear_infinite_4s]" />
          <Image
            src="/images/splash_screen/logo.png"
            alt="FIZY Logo"
            width={90}
            height={90}
            priority
            className="h-16 w-16 object-contain lg:h-24 lg:w-24"
          />
          <h1 className="text-4xl font-bold tracking-wide text-[#fe4f02] lg:text-6xl lg:gradient-brand-text">
            FIZY
          </h1>
        </div>
        <div className="flex items-center justify-center px-8 py-8 lg:flex-1 lg:px-16 lg:py-14">
          <div className="w-full max-w-[440px]">
            <h2 className="mb-2 text-center text-2xl font-bold text-[#33302f] lg:text-left lg:text-[2.25rem]">
              Criar sua conta
            </h2>
            <p className="mb-8 text-center text-sm text-[#6c757d] lg:text-left lg:text-[1.05rem] lg:leading-relaxed">
              Junte-se ao FIZY e encontre os melhores preços
            </p>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-6 lg:gap-5"
            >
              <TextInput
                label="Nome completo"
                id="name"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                required
              />
              <TextInput
                label="Email"
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                required
              />
              <PasswordInput
                label="Senha"
                id="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />
              <PasswordInput
                label="Confirmar senha"
                id="confirmPassword"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />
              <div className="flex items-start gap-2 rounded-lg bg-[#fafafa] p-3 text-sm">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#fe4f02]"
                  required
                />
                <label
                  htmlFor="acceptTerms"
                  className="leading-snug text-[#6b6867]"
                >
                  Aceito os{' '}
                  <a
                    href="#"
                    className="font-medium text-[#fe4f02] hover:underline"
                  >
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a
                    href="#"
                    className="font-medium text-[#fe4f02] hover:underline"
                  >
                    Política de Privacidade
                  </a>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-xl bg-[#fe4f02] px-6 py-4 font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-[#e04502] hover:shadow-[0_4px_12px_rgba(254,79,2,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Criando...' : 'Criar conta'}
              </button>
            </form>
            <div className="relative my-8 text-center text-xs font-medium tracking-wide text-[#6c757d]">
              <div className="absolute inset-0 flex items-center">
                <span className="h-px w-full bg-[#e5e5e5]" />
              </div>
              <span className="relative inline-block bg-white px-4">
                ou continue com
              </span>
            </div>
            <div className="mb-8 flex flex-wrap gap-4">
              {[
                { provider: 'Google', icon: '/images/login/icons/Google.svg' },
                {
                  provider: 'Facebook',
                  icon: '/images/login/icons/Facebook.svg',
                },
                { provider: 'Apple', icon: '/images/login/icons/Apple.svg' },
              ].map((s) => (
                <SocialButton
                  key={s.provider}
                  provider={s.provider}
                  icon={s.icon}
                  onClick={() => handleSocial(s.provider)}
                />
              ))}
            </div>
            <div className="text-center text-sm text-[#6c757d]">
              <p>
                Já tem uma conta?{' '}
                <a
                  href="/login"
                  className="font-medium text-[#fe4f02] hover:underline"
                >
                  Fazer login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
