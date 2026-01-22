"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

// Iconos como componentes estáticos para evitar re-creación
const TermsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const PrivacyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const CookiesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

interface QuickLink {
  href: string;
  label: string;
  Icon: React.ComponentType;
}

// Array definido fuera del componente - se crea una sola vez
const links: QuickLink[] = [
  {
    href: "/legal/terminos-y-condiciones",
    label: "Términos y Condiciones",
    Icon: TermsIcon,
  },
  {
    href: "/legal/politica-de-privacidad",
    label: "Política de Privacidad",
    Icon: PrivacyIcon,
  },
  {
    href: "/legal/politica-de-cookies",
    label: "Política de Cookies",
    Icon: CookiesIcon,
  },
];

// Componente de enlace individual memoizado
const QuickLinkItem = memo(function QuickLinkItem({
  href,
  label,
  Icon,
  isActive,
}: QuickLink & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 text-sm rounded px-2 py-2 transition-colors ${
        isActive
          ? "text-blue-600 font-medium bg-blue-100"
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-100"
      }`}
    >
      <Icon />
      {label}
    </Link>
  );
});

export default function QuickLinks() {
  const pathname = usePathname();

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-4 bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Enlaces Rápidos</h2>
        <nav className="space-y-1">
          {links.map((link) => (
            <QuickLinkItem
              key={link.href}
              {...link}
              isActive={pathname === link.href}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
