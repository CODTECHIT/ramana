import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  if (category === 'all') {
    return {
      title: 'All Jewellery Collections | Ramana Jewells',
      description: 'Explore our entire range of premium handcrafted South Indian temple jewellery, from bridal sets to daily wear.',
    };
  }

  try {
    const res = await fetch(`${apiUrl}/api/categories`);
    if (!res.ok) throw new Error('Categories not found');
    const categories = await res.json();
    const categoryData = categories.find((c: any) => c.slug === category);

    if (!categoryData) {
      return {
        title: 'Collection Not Found',
      };
    }

    const previousImages = (await parent).openGraph?.images || [];
    const imageUrl = categoryData.heroImage || categoryData.img;

    return {
      title: `${categoryData.name} Collection | Ramana Jewells`,
      description: categoryData.description || `Explore our exclusive ${categoryData.name} collection at Ramana Jewells. Premium handcrafted South Indian temple jewellery.`,
      openGraph: {
        title: `${categoryData.name} Collection`,
        description: categoryData.description || `Explore our exclusive ${categoryData.name} collection at Ramana Jewells.`,
        images: imageUrl ? [{ url: imageUrl }, ...previousImages] : previousImages,
      },
    };
  } catch (error) {
    return {
      title: 'Collection | Ramana Jewells',
    };
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
