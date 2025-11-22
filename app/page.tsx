import Squares from '@/components/Squares';
//The @/ alias points to your project root (configured in tsconfig.json).
export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 z-0 h-screen w-full bg-red-500">        
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          borderColor='#fff'
          hoverFillColor='#222'
        />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-16 sm:px-6 lg:px-8">        {/* Hero Section */}
        <section className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to My Website
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Building beautiful experiences with modern web technologies
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#about"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Learn More
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-500 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-24">
          <h2 className="text-4xl font-bold mb-8 text-center text-slate-900 dark:text-slate-100">
            About Me
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                I'm a passionate developer who loves creating beautiful and functional web experiences.
                This website is built with Next.js, React, TypeScript, and Tailwind CSS.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                I enjoy working with modern technologies and am always learning something new.
                Feel free to explore and reach out if you'd like to connect!
              </p>
            </div>
          </div>
        </section>

        {/* Skills/Technologies Section */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold mb-12 text-center text-slate-900 dark:text-slate-100">
            Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Node.js",
              "Git",
              "Vercel",
              "Web Design",
            ].map((tech) => (
              <div
                key={tech}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <p className="text-slate-900 dark:text-slate-100 font-semibold">{tech}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-24">
          <h2 className="text-4xl font-bold mb-8 text-center text-slate-900 dark:text-slate-100">
            Get in Touch
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-lg text-slate-700 dark:text-slate-300 text-center mb-6">
                I'd love to hear from you! Whether you have a question or just want to say hi,
                feel free to reach out.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:your.email@example.com"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Email Me
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-600 dark:text-slate-400 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}

