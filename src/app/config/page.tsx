'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserToken = { id?: string; email?: string; name?: string };

export default function ConfigPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [preferredFuel, setPreferredFuel] = useState('Gasolina');
  const [radius, setRadius] = useState(5); // km
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type?: 'info' | 'success' | 'error' }>
  >([]);

  const user: UserToken | null = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('fizy_token');
    if (!token) return null;
    try {
      const json = JSON.parse(atob(token));
      return json?.user || null;
    } catch {
      return null;
    }
  }, []);

  const pushToast = useCallback(
    (message: string, type: 'info' | 'success' | 'error' = 'info') => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
    },
    []
  );

  const confirmAction = (fn: () => void, question: string) => {
    if (window.confirm(question)) fn();
  };

  const changeFuel = () => {
    const value = window.prompt(
      'Combustível preferido (Gasolina / Etanol / Diesel / GNV):',
      preferredFuel
    );
    if (value) {
      setPreferredFuel(value);
      pushToast('Combustível atualizado', 'success');
    }
  };
  const changeRadius = () => {
    const value = window.prompt(
      'Raio de busca em km (1 - 50):',
      String(radius)
    );
    if (!value) return;
    const n = Number(value);
    if (isNaN(n) || n < 1 || n > 50) {
      pushToast('Valor inválido', 'error');
      return;
    }
    setRadius(n);
    pushToast('Raio atualizado', 'success');
  };

  const toggleNotifications = () => {
    setNotifications((n) => {
      const next = !n;
      pushToast(`Notificações ${next ? 'ativadas' : 'desativadas'}`, 'success');
      return next;
    });
  };

  const simpleInfo = (msg: string) => pushToast(msg, 'info');

  const logout = () => {
    confirmAction(() => {
      localStorage.removeItem('fizy_token');
      pushToast('Logout realizado!', 'success');
      setTimeout(() => router.push('/login'), 800);
    }, 'Tem certeza que deseja sair da conta?');
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-neutral-100 py-4 px-2 md:py-6 md:px-6">
      <div className="w-full max-w-[1400px] bg-white md:rounded-3xl md:shadow-xl flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 md:px-10 py-4 border-b sticky top-0 bg-white/90 backdrop-blur z-20">
          <button
            onClick={() => router.push('/')}
            aria-label="Voltar para o mapa"
            title="Voltar para o mapa"
            className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-800 flex-1 text-center md:text-center">
            Configurações
          </h1>
          <div className="w-11" />
        </header>

        <main className="flex flex-col lg:grid lg:grid-cols-[380px_1fr] gap-6 md:gap-10 px-4 md:px-10 pt-6 pb-16">
          {/* Profile panel */}
          <section className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl shadow-sm p-6 flex flex-col gap-6 h-fit sticky top-28">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-orange-500 bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-3xl shadow-inner">
                  {(user?.name || user?.email || 'U').slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-800">
                    {user?.name || 'Usuário'}
                  </h2>
                  <p className="text-sm text-neutral-500 break-all max-w-[180px]">
                    {user?.email || 'email@exemplo.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  simpleInfo('Edição de perfil em desenvolvimento')
                }
                className="w-11 h-11 rounded-xl border border-neutral-200 text-neutral-500 hover:text-orange-600 hover:border-orange-400 flex items-center justify-center transition"
                aria-label="Editar perfil"
              >
                <EditIcon className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={logout}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-red-500 text-red-500 font-medium py-3 hover:bg-red-500 hover:text-white transition shadow-sm"
            >
              <LogoutIcon className="w-5 h-5" /> Sair da conta
            </button>
          </section>

          {/* Content sections */}
          <div className="flex flex-col gap-6">
            <ConfigSection title="Preferências">
              <ConfigItem
                icon={<FolderIcon className="w-6 h-6" />}
                title="Combustível preferido"
                subtitle={preferredFuel}
                actionType="arrow"
                onAction={changeFuel}
              />
              <ConfigItem
                icon={<LocationIcon className="w-6 h-6" />}
                title="Raio de busca"
                subtitle={`${radius} km`}
                actionType="arrow"
                onAction={changeRadius}
              />
              <ConfigItem
                icon={<BellIcon className="w-6 h-6" />}
                title="Notificações"
                subtitle={notifications ? 'Ativadas' : 'Desativadas'}
                actionType="toggle"
                toggleValue={notifications}
                onToggle={toggleNotifications}
              />
            </ConfigSection>

            <ConfigSection title="Conta">
              <ConfigItem
                icon={<ShieldIcon className="w-6 h-6" />}
                title="Privacidade"
                subtitle="Gerenciar dados pessoais"
                actionType="arrow"
                onAction={() => simpleInfo('Privacidade em desenvolvimento')}
              />
              <ConfigItem
                icon={<DocIcon className="w-6 h-6" />}
                title="Termos de uso"
                subtitle="Políticas e condições"
                actionType="arrow"
                onAction={() => simpleInfo('Termos em desenvolvimento')}
              />
            </ConfigSection>

            <ConfigSection title="Suporte">
              <ConfigItem
                icon={<HelpIcon className="w-6 h-6" />}
                title="Ajuda e suporte"
                subtitle="Central de ajuda"
                actionType="arrow"
                onAction={() => simpleInfo('Suporte em desenvolvimento')}
              />
              <ConfigItem
                icon={<InfoIcon className="w-6 h-6" />}
                title="Sobre o app"
                subtitle="FIZY v1.0.0"
                actionType="arrow"
                onAction={() => simpleInfo('Sobre em desenvolvimento')}
              />
            </ConfigSection>
          </div>
        </main>

        {/* Toasts */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-[calc(100%-2rem)] max-w-md">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={
                'rounded-xl px-5 py-3 text-white shadow-lg animate-slide-down text-sm font-medium flex items-center gap-2 ' +
                (t.type === 'success'
                  ? 'bg-green-600'
                  : t.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-blue-600')
              }
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Components
function ConfigSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-5 md:p-7 flex flex-col gap-1">
      <h3 className="text-sm font-semibold tracking-wide text-neutral-700 uppercase mb-3 border-b pb-2">
        {title}
      </h3>
      <div>{children}</div>
    </section>
  );
}

interface ConfigItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  actionType: 'arrow' | 'toggle';
  onAction?: () => void;
  toggleValue?: boolean;
  onToggle?: () => void;
}

function ConfigItem({
  icon,
  title,
  subtitle,
  actionType,
  onAction,
  toggleValue,
  onToggle,
}: ConfigItemProps) {
  return (
    <div className="group flex items-center justify-between py-4 border-b last:border-b-0 border-neutral-200/70">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-orange-600">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-800">{title}</span>
          {subtitle && (
            <span className="text-xs text-neutral-500 mt-0.5">{subtitle}</span>
          )}
        </div>
      </div>
      {actionType === 'arrow' && (
        <button
          onClick={onAction}
          className="w-8 h-8 rounded-lg text-neutral-400 hover:text-orange-600 hover:bg-neutral-100 flex items-center justify-center transition"
          aria-label="Abrir"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      )}
      {actionType === 'toggle' && (
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!toggleValue}
            onChange={onToggle}
            className="sr-only"
          />
          <span
            className={
              'w-12 h-7 flex items-center rounded-full p-1 transition ' +
              (toggleValue ? 'bg-orange-500' : 'bg-neutral-300')
            }
          >
            <span
              className={
                'h-5 w-5 rounded-full bg-white shadow-md transform transition ' +
                (toggleValue ? 'translate-x-5' : 'translate-x-0')
              }
            />
          </span>
        </label>
      )}
    </div>
  );
}

// Icons (inline SVG react components)
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}
function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.166 2.5a2.357 2.357 0 013.334 3.334l-8.334 8.333-4.166.833.833-4.166L14.166 2.5z" />
    </svg>
  );
}
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7.5 5L12.5 10L7.5 15" />
    </svg>
  );
}
function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path d="M3 7a2 2 0 012-2h4.5a2 2 0 011.6.8L14 8h7a2 2 0 012 2v7a2 2 0 01-2 2H9a7 7 0 01-7-7V7z" />
    </svg>
  );
}
function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 21s-7-6-7-13a7 7 0 0114 0c0 7-7 13-7 13z" />
      <circle cx="12" cy="8" r="3" />
    </svg>
  );
}
function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function DocIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}
function HelpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 17h.01" />
      <path d="M12 13a3 3 0 10-3-3" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
function LogoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
