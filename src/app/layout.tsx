import './globals.css';
import Header from '@/components/Header-and-Footer/header';
import Footer from '@/components/Header-and-Footer/footer';
import { CartProvider } from '@/context/CartContext'; // <--- Importa CartProvider

export const metadata = {
  title: 'Trainer Sport',
  description: 'Tu tienda de deportes online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider> {/* <--- Envuelve todo el contenido con CartProvider */}
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}