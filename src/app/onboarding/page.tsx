'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Steps adapted to match old first-steps (2 telas) for maior similaridade
const steps = [
  {
    key: 'welcome',
    title: 'Bem-vindo ao FIZY! 😄',
    text: 'Encontre os postos mais próximos com os melhores preços da sua região.',
    illustration: 'welcome',
  },
  {
    key: 'compare',
    title: 'Compare preços!',
    text: 'Veja em tempo real os preços e escolha a melhor opção para abastecer.',
    illustration: 'compare',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [phase, setPhase] = useState<'splash' | 'steps'>('splash');
  const [index, setIndex] = useState(0);

  // Splash auto advance (3s) similar to antigo splash.html
  useEffect(() => {
    if (phase === 'splash') {
      const t = setTimeout(() => setPhase('steps'), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const step = steps[index];

  const goNext = () => setIndex((i) => Math.min(i + 1, steps.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const setOnboardCookie = () => {
    try {
      // Cookie simples (não HttpOnly) apenas para sinalizar primeira visita concluída
      document.cookie = `fizy_onboarded=1; path=/; max-age=${
        60 * 60 * 24 * 365
      }`;
    } catch {}
  };
  const finish = () => {
    setOnboardCookie();
    router.push('/login');
  };
  const skip = () => {
    setOnboardCookie();
    router.push('/login');
  };

  // Splash screen reutiliza animações básicas com Tailwind
  if (phase === 'splash') {
    return (
      <main className="w-screen h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-orange-100 via-orange-50 to-white overflow-hidden">
        <div className="flex flex-col items-center animate-[fadeInUp_0.8s_ease]">
          <div className="mb-8 animate-[logoFloat_2s_ease-in-out_infinite]">
            {/* Placeholder do logo (poderá ser imagem futuramente) */}
            <div className="w-32 h-32 rounded-2xl bg-orange-500 shadow-lg flex items-center justify-center text-white text-4xl font-bold tracking-wider">
              FIZY
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-orange-600 tracking-wide drop-shadow-sm">
            FIZY
          </h1>
          <p className="mt-2 text-lg text-neutral-700">
            Encontre o melhor combustível
          </p>
        </div>
        <div className="absolute bottom-20 flex gap-3">
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"
              style={{ animationDelay: `${d * 0.25}s` }}
            />
          ))}
        </div>
        <button
          onClick={() => setPhase('steps')}
          className="absolute bottom-5 text-xs text-orange-600/70 hover:text-orange-700 transition"
        >
          Pular animação
        </button>
        {/* Keyframes inline via globals? Fallback usando classes utilitárias personalizadas já existentes (fade-in-up) */}
      </main>
    );
  }

  return (
    <main className="w-screen min-h-screen flex flex-col px-6 py-6 max-w-5xl mx-auto">
      {/* Progress bars estilo antigo (duas barras) */}
      <header className="flex justify-center mb-8">
        <div className="flex gap-4">
          {steps.map((s, i) => {
            const state =
              i === index ? 'active' : i < index ? 'completed' : 'idle';
            return (
              <div
                key={s.key}
                className={
                  'h-2 w-32 rounded-full transition-colors duration-300 ' +
                  (state === 'active'
                    ? 'bg-orange-500'
                    : state === 'completed'
                    ? 'bg-orange-400'
                    : 'bg-neutral-200')
                }
              />
            );
          })}
        </div>
      </header>

      {/* Content grid similar ao layout antigo */}
      <section className="flex-1 grid lg:grid-cols-2 gap-10 items-center mb-10">
        <Illustration type={step.illustration} index={index} />
        <div className="space-y-6 animate-[fadeInUp_0.6s_ease]">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-neutral-800">
            {step.title}
          </h1>
          <p className="text-lg text-neutral-600 max-w-md">{step.text}</p>
        </div>
      </section>

      {/* Navigation */}
      <nav className="mt-auto flex flex-col sm:flex-row gap-4 pb-4">
        <div className="flex gap-4 w-full">
          {index > 0 ? (
            <button
              onClick={goPrev}
              className="flex-1 px-5 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-medium hover:border-orange-400 hover:text-orange-600 transition"
            >
              Voltar
            </button>
          ) : (
            <button
              onClick={skip}
              className="flex-1 px-5 py-3 rounded-xl border border-neutral-300 text-neutral-600 font-medium hover:border-orange-400 hover:text-orange-600 transition"
            >
              Pular
            </button>
          )}
          {index < steps.length - 1 ? (
            <button
              onClick={goNext}
              className="flex-1 px-5 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex-1 px-5 py-3 rounded-xl bg-orange-600 text-white font-semibold shadow hover:bg-orange-700 transition"
            >
              Começar
            </button>
          )}
        </div>
      </nav>
    </main>
  );
}

function Illustration({ type, index }: { type: string; index: number }) {
  if (type === 'welcome') {
    return (
      <div className="relative w-full max-w-md h-96 flex items-center justify-center">
        <div className="w-52 h-96 bg-neutral-900 rounded-[2rem] p-5 shadow-2xl animate-[phoneFloat_3s_ease-in-out_infinite] flex flex-col items-center justify-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold text-2xl animate-pulse">
            FIZY
          </div>
          <div className="w-full space-y-3">
            <div className="h-3 w-4/5 mx-auto rounded bg-orange-500/90" />
            <div className="h-2 w-2/3 mx-auto rounded bg-neutral-300" />
          </div>
        </div>
        {/* Floating fuel icons */}
        <FuelBubble
          className="top-10 left-4 animate-[float1_4s_ease-in-out_infinite]"
          label="G"
        />
        <FuelBubble
          className="bottom-12 left-10 animate-[float3_4s_ease-in-out_infinite_1s]"
          label="E"
        />
        <FuelBubble
          className="top-1/2 right-6 animate-[float2_4s_ease-in-out_infinite_2s]"
          label="D"
        />
      </div>
    );
  }

  // compare illustration
  return (
    <div className="relative w-full max-w-md h-96 flex flex-col items-center justify-center gap-8">
      <div className="flex gap-4 flex-wrap justify-center price-cards">
        <ComparePriceCard
          order={1}
          station="Posto A"
          price="R$ 5,99"
          fuel="Gasolina"
        />
        <ComparePriceCard
          order={2}
          highlight
          station="Posto B"
          price="R$ 5,79"
          fuel="Gasolina"
        />
        <ComparePriceCard
          order={3}
          station="Posto C"
          price="R$ 5,89"
          fuel="Gasolina"
        />
      </div>
      <div className="animate-arrow-pulse">
        <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
          <path
            d="M8 20H32M32 20L24 12M32 20L24 28"
            stroke="#FE4F02"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function FuelBubble({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={
        'absolute w-12 h-12 rounded-full bg-orange-500 text-white font-semibold flex items-center justify-center shadow-lg ' +
        (className || '')
      }
    >
      {label}
    </span>
  );
}

function PriceCard({
  station,
  price,
  fuel,
  highlight,
  delay,
}: {
  station: string;
  price: string;
  fuel: string;
  highlight: boolean;
  delay: number;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className={
        'w-28 rounded-xl border p-3 text-center shadow bg-white animate-[fadeInUp_0.6s_ease_forwards] opacity-0 ' +
        (highlight ? 'border-orange-500 bg-orange-50' : 'border-neutral-200')
      }
    >
      <div className="text-[10px] text-neutral-500 mb-1">{station}</div>
      <div className="text-sm font-bold text-neutral-800 mb-1">{price}</div>
      <div className="text-[10px] text-neutral-500">{fuel}</div>
    </div>
  );
}

function ComparePriceCard({
  station,
  price,
  fuel,
  highlight,
  order,
}: {
  station: string;
  price: string;
  fuel: string;
  highlight?: boolean;
  order: number;
}) {
  const delay = 0.2 * order;
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className={
        'price-card opacity-0 animate-card-slide-in bg-white rounded-xl px-4 py-3 shadow text-center min-w-[110px] border ' +
        (highlight
          ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200'
          : 'border-neutral-200')
      }
    >
      <div className="station-name text-[11px] text-neutral-500 mb-1 font-medium">
        {station}
      </div>
      <div className="price text-base font-bold text-neutral-800 mb-1">
        {price}
      </div>
      <div className="fuel-type text-[10px] text-neutral-500">{fuel}</div>
    </div>
  );
}
