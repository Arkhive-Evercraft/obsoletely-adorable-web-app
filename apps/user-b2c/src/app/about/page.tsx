"use client"
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function AboutPage() {
  return (
    <AppLayout requireAuth={false}>
      <Main pageHeading="About Obsoletely Adorable">
        <section className="max-w-4xl mx-auto px-6 py-8">
          {/* Hero section with retro styling */}
          <div className="retro-panel mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-vapor-pink/20 via-vapor-purple/20 to-vapor-cyan/20"></div>
            <div className="relative z-10">
              <h2 className="neon-text text-center mb-4">Welcome to the Digital Adoption Shelter</h2>
              <p className="text-lg text-center text-vapor-purple font-retro">
                Where forgotten HTML tags find new homes in the hearts of developers 💾✨
              </p>
            </div>
          </div>

          {/* Main content in retro windows */}
          <div className="space-y-6">
            <div className="retro-window">
              <div className="retro-panel">
                <h3 className="text-vapor-cyan font-bold mb-3 font-retro text-lg">Once Upon a Time on the Web...</h3>
                <p className="mb-4 leading-relaxed">
                  In the wild west days of the internet, tags like <code>&lt;marquee&gt;</code>,
                  <code>&lt;blink&gt;</code>, and <code>&lt;center&gt;</code> brought personality and flair to personal 
                  blogs, fan pages, and GeoCities masterpieces. They were the building blocks of digital self-expression.
                </p>
              </div>
            </div>

            <div className="retro-window">
              <div className="retro-panel">
                <h3 className="text-vapor-mint font-bold mb-3 font-retro text-lg">The Great Deprecation Event</h3>
                <p className="mb-4 leading-relaxed">
                  As web standards evolved, these charming tags were marked as <strong className="text-vapor-coral">deprecated</strong> 
                  or declared <strong className="text-vapor-peach">obsolete</strong>. They were told to pack their bags and 
                  stop showing up to work. Modern browsers gave them the cold shoulder.
                </p>
                <p className="mb-4 leading-relaxed font-retro text-vapor-lavender">
                  💔 They don't really <em>do</em> anything anymore. Honestly, they probably shouldn't.
                </p>
              </div>
            </div>

            <div className="retro-window">
              <div className="retro-panel">
                <h3 className="text-vapor-pink font-bold mb-3 font-retro text-lg">But We Still Love Them</h3>
                <p className="mb-4 leading-relaxed">
                  That's where <strong className="neon-text">Obsoletely Adorable</strong> comes in! We've created a digital 
                  sanctuary where these forgotten code fragments can live on as beloved mascots with backstories, 
                  personalities, and adoption certificates.
                </p>
              </div>
            </div>

            <div className="retro-window bg-gradient-to-br from-vapor-purple/10 to-vapor-cyan/10">
              <div className="retro-panel">
                <h3 className="text-vapor-amber font-bold mb-4 font-retro text-lg text-center">Perfect For:</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="retro-button text-center">
                    <div className="font-bold text-retro-green">Web Veterans</div>
                    <div className="text-sm mt-1">Who remember <code>&lt;font size="7"&gt;</code></div>
                  </div>
                  <div className="retro-button text-center">
                    <div className="font-bold text-vapor-cyan">Curious Newcomers</div>
                    <div className="text-sm mt-1">Wondering what <code>&lt;xmp&gt;</code> was</div>
                  </div>
                  <div className="retro-button text-center">
                    <div className="font-bold text-vapor-pink">Everyone</div>
                    <div className="text-sm mt-1">Who likes cute + technically dead things</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="retro-window">
              <div className="retro-panel">
                <h3 className="text-vapor-coral font-bold mb-3 font-retro text-lg">Your Adoption Makes a Difference</h3>
                <p className="mb-4 leading-relaxed">
                  When you adopt a tag, you're supporting open web projects, accessibility tools, and digital preservation. 
                  You're not just rescuing <code>&lt;center&gt;</code> – you're helping keep the spirit of the web 
                  <span className="neon-text">weird, open, and wonderful</span>.
                </p>
              </div>
            </div>

            {/* Footer message */}
            <div className="text-center py-8">
              <div className="retro-panel bg-gradient-to-r from-vapor-pink/20 via-vapor-purple/20 to-vapor-cyan/20">
                <p className="font-retro text-lg text-vapor-lavender">
                  <span className="neon-text">Thanks for visiting. Thanks for caring.</span>
                </p>
                <p className="font-retro text-lg text-vapor-mint mt-2">
                  Thank you for giving a deprecated tag a forever home. 🏠💖
                </p>
              </div>
            </div>
          </div>
        </section>
      </Main>
    </AppLayout>
  );
}