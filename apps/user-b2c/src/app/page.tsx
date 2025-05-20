import { AppLayout } from "@/components/Layout/AppLayout";
import { Hero } from "@/components/Layout/Hero";
import { FeaturedProducts } from "@/components/Catalogue/FeaturedProducts";
import { CategoryShowcase } from "@/components/Catalogue/CategoryShowcase";
import { Newsletter } from "@/components/Newsletter/Newsletter";
import styles from "./page.module.css";

// Mock data for the homepage
import { mockFeaturedProducts, mockCategories } from "@/mocks/products";

export default function Home() {
  return (
    <AppLayout>
      <div className={styles.home}>
        <Hero />
        <FeaturedProducts products={mockFeaturedProducts} />
        <CategoryShowcase categories={mockCategories} />
        <Newsletter />
      </div>
    </AppLayout>
  );
}
