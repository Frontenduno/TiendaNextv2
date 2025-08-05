// src/app/page/products/[productId]/page.tsx

import { sampleProducts, Product } from '@/data/products';
import ProductDetailView from '@/view/ProductDetailView';
import { Metadata } from 'next';
import Link from 'next/link';

// Tipado de los parámetros de ruta
interface ProductPageProps {
    params: {
        productId: string;
    };
}

// Obtiene el producto por ID extraído del slug
async function getProduct(params: ProductPageProps['params']): Promise<Product | undefined> {
    const productIdSlug = params.productId;
    if (!productIdSlug) return undefined;

    const idParts = productIdSlug.split('-');
    const productIdNum = parseInt(idParts[idParts.length - 1]);
    if (isNaN(productIdNum)) return undefined;

    const product = sampleProducts.find(p => p.id === productIdNum);
    return product;
}

// Genera los metadatos dinámicos para SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const product = await getProduct(params);
    if (!product) {
        return {
            title: 'Producto no encontrado',
            description: 'La página del producto que buscas no existe.',
        };
    }

    return {
        title: `${product.name} - ${product.model}`,
        description: product.description,
        openGraph: {
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
        },
    };
}

// Componente de error 404 para producto no encontrado
const ProductNotFoundView = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
            <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-800">Producto No Encontrado</h2>
            <p className="mt-2 text-gray-600">
                Lo sentimos, pero no pudimos encontrar el producto que estás buscando.
            </p>
            <Link 
                href="/" 
                className="mt-6 inline-block px-6 py-3 text-lg font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
                Volver al inicio
            </Link>
        </div>
    </div>
);

// Componente principal de la página de detalle del producto
export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProduct(params);
    if (!product) return <ProductNotFoundView />;
    return <ProductDetailView product={product} />;
}
