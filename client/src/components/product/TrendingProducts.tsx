import Link from "next/link";
import * as motion from "framer-motion/client";
import ArrivalRail from "./ArrivalRail";
import ProductCard from "./ProductCard";
import { getProducts } from "@/services/product.api";
import styles from "./HomeSections.module.css";

export default async function TrendingProducts({ bedding = false }: { bedding?: boolean } = {}) {
  const title = bedding ? "Bed Sheets & Comforters" : "New Arrivals";
  const href = bedding ? "/home-living#comforters-and-bed-sheets" : "/new-arrivals";
  const headingId = bedding ? "bedding-heading" : "new-arrivals-heading";
  const products = await getProducts(bedding ? { category: "comforters-and-bed-sheets", limit: 8 } : { limit: 8 });
  return (
    <section className={styles.arrivals} aria-labelledby={headingId}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h2 id={headingId} className={styles.heading}>{title}</h2>
            {!bedding && <p className={styles.intro}>Handpicked selections for the season.</p>}
          </div>
          <Link href={href} className={styles.desktopLink}>View All</Link>
        </header>
        {Array.isArray(products) && products.length > 0 ? (
          <ArrivalRail id={bedding ? "bedding-products" : "arrival-products"} label={title}>
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
          <p className={styles.empty}>{bedding ? "No bedding products available yet." : "No new arrivals available right now."}</p>
        )}
        <Link href={href} className={styles.mobileLink}>{bedding ? "View All Bedding" : "View All Arrivals"}</Link>
      </div>
    </section>
  );
}

