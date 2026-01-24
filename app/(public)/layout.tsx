// app/(public)/layout.tsx
import HeaderPublic from "@/layouts/public/HeaderPublic";
import FooterPublic from "@/layouts/public/FooterPublic";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-center text-sm text-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <HeaderPublic />
      <Breadcrumbs />
      <main className="flex-1">
        {children}
      </main>
      <FooterPublic />
    </div>
  );
}
