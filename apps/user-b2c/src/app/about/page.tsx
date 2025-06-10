"use client"
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function AboutPage() {
  return (
    <AppLayout requireAuth={false}>
      <Main pageHeading="About">
        <section className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
          <p className="mb-4">
            Welcome to <strong>Obsoletely Adorable</strong>, a digital adoption shelter for the internet's most
            charmingly retired HTML tags.
          </p>

          <p className="mb-4">
            Once the stars of personal blogs, fan pages, and glitter-filled layouts, tags like <code>&lt;marquee&gt;</code>,
            <code>&lt;blink&gt;</code>, and <code>&lt;center&gt;</code> brought flair and personality to the early web. Over time, the web evolved and these tags were left behind.
          </p>

          <p className="mb-4">
            Some of them are <strong>deprecated</strong>, meaning they were officially told to stop showing up to work. Others are <strong>obsolete</strong>, which means modern browsers no longer support them at all, bless their little hearts. They don't really <em>do</em> anything anymore. Honestly, they probably shouldn't.
          </p>

          <p className="mb-4">
            But that doesn't mean we can't love them.
          </p>

          <p className="mb-4">
            We've given these forgotten bits of code new life. Each one has a mascot, a backstory, and digital adoption goodies you can download and share. It's a little silly, a little sentimental, and a lot of fun.
          </p>

          <div className="mb-4">
            <p className="font-semibold mb-2">This is for:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Web veterans who remember building sites with <code>&lt;font size="7"&gt;</code></li>
              <li>Curious newcomers wondering what <code>&lt;xmp&gt;</code> was ever doing</li>
              <li><strong>Anyone who likes cute things that also happen to be technically dead</strong></li>
            </ul>
          </div>

          <p className="mb-4">
            Adopting a tag supports open web projects, accessibility tools, and digital preservation. You're not just rescuing <code>&lt;center&gt;</code>. You're helping keep the spirit of the web weird, open, and wonderful.
          </p>

          <p className="italic">
            Thanks for visiting. Thanks for caring. And thank you for giving a deprecated tag a forever home.
          </p>
        </section>
      </Main>
    </AppLayout>
  );
}