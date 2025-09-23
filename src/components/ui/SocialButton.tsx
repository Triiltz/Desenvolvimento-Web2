'use client';

interface SocialButtonProps {
  icon: string;
  provider: string;
  onClick?: () => void;
}

export function SocialButton({ icon, provider, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#e5e5e5] bg-white px-3 py-3 text-sm font-medium text-[#33302f] transition hover:-translate-y-0.5 hover:border-[#fe4f02] hover:text-[#fe4f02]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icon}
        alt={provider}
        width={20}
        height={20}
        className="h-5 w-5"
      />
      {provider}
    </button>
  );
}
