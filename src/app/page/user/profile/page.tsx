'use client'; // Necesario porque usamos useRouter

import { useRouter } from 'next/navigation'; // Importamos el hook para navegar
import ProfilePage from '@/view/profile'; // Importamos el COMPONENTE ProfilePage

// Esta es la PÁGINA que se renderiza en la URL /page/user/profile
export default function UserProfileRoutePage() {
  const router = useRouter(); // Inicializamos el router para la navegación

  // Función que se ejecutará cuando el componente ProfilePage llame a su prop onLogout
  const handleLogout = () => {
    // Aquí iría tu lógica real para cerrar la sesión del usuario (ej. borrar tokens, limpiar estado global)
    console.log('Cerrando sesión del usuario...');
    router.push('/page/user/login'); // Redirige a la página de login después de cerrar sesión
  };

  return (
    // Renderizamos el COMPONENTE ProfilePage y le pasamos la función handleLogout
    <ProfilePage onLogout={handleLogout} />
  );
}
