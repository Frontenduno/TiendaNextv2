import { PropsWithChildren } from 'react';
import HeaderPublic from '@/layouts/public/HeaderPublic';

export default function PrivateLayout({ children }: PropsWithChildren) {
  return (
    <>
      <HeaderPublic />
      <main>{children}</main>
    </>
  );
}