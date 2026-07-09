import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${slug}`, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      return {
        title: "Product Not Found",
      };
    }

    const product = await res.json();
    
    // Fallbacks
    const title = product.name;
    const description = product.description || `Buy ${product.name} at Ramana Jewells.`;
    const image = product.images && product.images.length > 0 ? product.images[0] : "";

    return {
      title: title,
      description: description,
      openGraph: {
        title: `${title} | Ramana Jewells`,
        description: description,
        images: image ? [{ url: image }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Ramana Jewells`,
        description: description,
        images: image ? [image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for product:", error);
    return {
      title: "Product",
    };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
