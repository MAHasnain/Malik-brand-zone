import Link from "next/link";
import * as motion from "framer-motion/client";
import ArrivalRail from "./ArrivalRail";
import ProductCard from "./ProductCard";
import { getProducts } from "@/services/product.api";
import styles from "./HomeSections.module.css";

export default async function TrendingProducts() {
  const products = await getProducts({ limit: 8 });
  return (
    <section className={styles.arrivals} aria-labelledby="new-arrivals-heading">
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h2 id="new-arrivals-heading" className={styles.heading}>New Arrivals</h2>
            <p className={styles.intro}>Handpicked selections for the season.</p>
          </div>
          <Link href="/new-arrivals" className={styles.desktopLink}>View All</Link>
        </header>
        {Array.isArray(products) && products.length > 0 ? (
          <ArrivalRail>
            {products.map((product, index) => (
              <motion.li key={product._id} className={styles.card}
                initial={false}
                whileInView={{ y: [6, 0] }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.32, delay: (index % 2) * 0.045, ease: "easeOut" }}>
                <ProductCard product={product} />
              </motion.li>
            ))}
          </ArrivalRail>
        ) : (
          <p className={styles.empty}>No new arrivals available right now.</p>
        )}
        <Link href="/new-arrivals" className={styles.mobileLink}>View All Arrivals</Link>
      </div>
    </section>
  );
}
