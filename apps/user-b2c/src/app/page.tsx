import styles from "./page.module.css";
import { Main } from "@/components/Main"
// Mock data for the homepage
import { mockFeaturedProducts, mockCategories } from "@/mocks/products";

export default function Home() {
  return <Main className={styles.main} />;
}
