// Importaciones necesarias para el componente
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaTwitter } from "react-icons/fa";


export default function PiePagina() {
  return (
    <footer>
      {/* Primera sección del footer: Azul oscuro */}
      <div className="bg-[#005B94] text-white py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6 text-sm">
          {/* Columna 1: Servicio al cliente */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-bold mb-3">Servicio al cliente</h4>
            <ul className="space-y-2">
              <li><Link href="#">Preguntas Frecuentes</Link></li>
              <li><Link href="#">Guía de tallas</Link></li>
              <li><Link href="#">Tutorial de compra</Link></li>
              <li><Link href="#">Términos y condiciones</Link></li>
              <li><Link href="#">Políticas de envíos</Link></li>
              <li><Link href="#">Políticas de privacidad</Link></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            </ul>
          </div>

          {/* Columna 2: Tiendas, Trabaja con nosotros, Libro de Reclamaciones */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-base font-bold mb-2">Nuestras Tiendas</h4>
            <h4 className="text-base font-bold mb-2">Trabaja con Nosotros</h4>

            <Link href="/libro-reclamaciones.png">
              <div className="border-2 border-white rounded-lg p-4 cursor-pointer">
                <Image src="/libro-de-reclamaciones.png" alt="Libro de Reclamaciones" width={150} height={60}/>
              </div>
            </Link>
          </div>

          {/* Columna 3: Contacto / Redes Sociales */}
          <div>
            <h4 className="text-base font-bold mb-3 text-center md:text-right">Contacto / Redes Sociales</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 justify-center md:justify-end">
                <FaWhatsapp size={22} />
                <a href="https://wa.me/51976262262" target="_blank" rel="noopener noreferrer">976 262 262</a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-end">
                <FaInstagram size={22} />
                <a href="https://instagram.com/Trainer.sport" target="_blank" rel="noopener noreferrer">Trainer.sport</a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-end">
                <FaFacebookF size={22} />
                <a href="https://facebook.com/Trainer.sport" target="_blank" rel="noopener noreferrer">Trainer.sport</a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-end">
                <FaTiktok size={22} />
                <a href="https://tiktok.com/@Trainer.sport" target="_blank" rel="noopener noreferrer">Trainer.sport</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Segunda sección del footer: Negra */}
      <div className="bg-black text-white text-xs py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-0
                      sm:justify-center"> {/* CAMBIO: sm:justify-center para pantallas grandes */}
            {/* El orden de los elementos se invirtió para pantallas pequeñas
                y se usó order-first/order-last para el centrado visual. */}
            <p className="text-center order-last sm:order-first sm:flex-grow sm:text-center"> {/* CAMBIO: text-center para el párrafo y order-last/order-first */}
                PEGASUS SPORT S.A.C. RUC 202020202020 - 2025 Todos los derechos reservados
            </p>

            <div className="flex gap-3 items-center order-first sm:order-last sm:flex-grow-0"> {/* CAMBIO: order-first/order-last */}
                <a href="#" target="_blank" rel="noopener noreferrer"
                  className="bg-gray-300 p-2 rounded-full text-black hover:text-blue-600 transition">
                  <FaFacebookF size={13} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer"
                  className="bg-gray-300 p-2 rounded-full text-black hover:text-blue-400 transition">
                  <FaTwitter size={13} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer"
                  className="bg-gray-300 p-2 rounded-full text-black hover:text-red-500 transition">
                  <FaYoutube size={13} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer"
                  className="bg-gray-300 p-2 rounded-full text-black hover:text-pink-500 transition">
                  <FaInstagram size={13} />
                </a>
            </div>
        </div>
      </div>

    </footer>
  );
}