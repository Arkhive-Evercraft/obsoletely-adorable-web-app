"use client"
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <AppLayout requireAuth={false}>
      <Main pageHeading="About Obsoletely Adorable">
        <div className={styles.aboutContainer}>
          {/* Hero section with kawaii styling */}
          <div className={styles.heroSection}>
            <h2 className={styles.heroTitle}>Welcome to the Digital Adoption Shelter</h2>
            <p className={styles.heroSubtitle}>
              Where forgotten HTML tags find new homes in the hearts of developers 💾✨
            </p>
          </div>

          {/* Content sections */}
          <div className={styles.contentSection}>
            <h3 className={styles.sectionTitle}>Once Upon a Time on the Web...</h3>
            <div className={styles.sectionContent}>
              <p>
                In the wild west days of the internet, tags like <code>&lt;marquee&gt;</code>,
                <code>&lt;blink&gt;</code>, and <code>&lt;center&gt;</code> brought personality and flair to personal 
                blogs, fan pages, and GeoCities masterpieces. They were the building blocks of digital self-expression.
              </p>
            </div>
          </div>

          <div className={styles.contentSection}>
            <h3 className={styles.sectionTitle}>The Great Deprecation Event</h3>
            <div className={styles.sectionContent}>
              <p>
                As web standards evolved, these charming tags were marked as <strong>deprecated</strong> or 
                declared <strong>obsolete</strong>. They were told to pack their bags and 
                stop showing up to work. Modern browsers gave them the cold shoulder.
              </p>
              <p>
                💔 They don't really <em>do</em> anything anymore. Honestly, they probably shouldn't.
              </p>
            </div>
          </div>

          <div className={styles.contentSection}>
            <h3 className={styles.sectionTitle}>But We Still Love Them</h3>
            <div className={styles.sectionContent}>
              <p>
                That's where <strong>Obsoletely Adorable</strong> comes in! We've created a digital 
                sanctuary where these forgotten code fragments can live on as beloved mascots with backstories, 
                personalities, and adoption certificates.
              </p>
            </div>
          </div>

          <div className={styles.gridSection}>
            <h3 className={styles.gridTitle}>Perfect For:</h3>
            <div className={styles.perfectForGrid}>
              <div className={styles.gridItem}>
                <div className={styles.gridItemTitle}>Web Veterans</div>
                <div className={styles.gridItemDescription}>Who remember <code>&lt;font size="7"&gt;</code></div>
              </div>
              <div className={styles.gridItem}>
                <div className={styles.gridItemTitle}>Curious Newcomers</div>
                <div className={styles.gridItemDescription}>Wondering what <code>&lt;xmp&gt;</code> was</div>
              </div>
              <div className={styles.gridItem}>
                <div className={styles.gridItemTitle}>Everyone</div>
                <div className={styles.gridItemDescription}>Who likes cute + technically dead things</div>
              </div>
            </div>
          </div>

          <div className={styles.contentSection}>
            <h3 className={styles.sectionTitle}>Your Adoption Makes a Difference</h3>
            <div className={styles.sectionContent}>
              <p>
                When you adopt a tag, you're supporting open web projects, accessibility tools, and digital preservation. 
                You're not just rescuing <code>&lt;center&gt;</code> – you're helping keep the spirit of the web 
                <strong>weird, open, and wonderful</strong>.
              </p>
            </div>
          </div>

          {/* Footer message */}
          <div className={styles.footerSection}>
            <p className={styles.footerMessage}>
              Thanks for visiting. Thanks for caring.
            </p>
            <p className={styles.footerSubMessage}>
              Thank you for forgotten code a forever home. 🏠💖
            </p>
          </div>
        </div>
      </Main>
    </AppLayout>
  );
}