import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ramanajewells.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Base routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/collections/all',
    '/shipping-and-returns',
    '/privacy-policy',
    '/terms-and-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch categories
    const categoriesRes = await fetch(`${apiUrl}/api/categories`, { next: { revalidate: 3600 } });
    let categories = [];
    if (categoriesRes.ok) {
      const data = await categoriesRes.json();
      categories = Array.isArray(data) ? data : (data.categories || []);
    }

    const categoryRoutes = categories.map((category: any) => ({
      url: `${baseUrl}/collections/${category.slug}`,
      lastModified: category.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Fetch products
    const productsRes = await fetch(`${apiUrl}/api/products?active=true`, { next: { revalidate: 3600 } });
    let products = [];
    if (productsRes.ok) {
      const data = await productsRes.json();
      products = Array.isArray(data) ? data : [];
    }

    const productRoutes = products.map((product: any) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt || new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    return [...routes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.warn('⚠️  Warning: Could not fetch dynamic routes for sitemap (Backend API might be offline). Falling back to static routes only.');
    // Return base routes if fetching fails
    return routes;
  }
}
