import { Link } from "lucide-react";

export const About = () => {
  return (
    <>
      <section
        id={"about"}
        className="min-h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white flex flex-col px-6"
      >
        <header className="text-center py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We built <span className="font-semibold">MyApp</span> to empower
            people to work smarter, stay organized, and live better. Our
            mission: elegant simplicity + powerful productivity.
          </p>
        </header>

        {/* Values */}
        <section className="container mx-auto max-w-4xl py-16">
          <div className="grid sm:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">🌍 Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Technology should adapt to people — not the other way around. We
                envision a future where apps are intelligent, secure, and
                delightful.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">🤝 Our Commitment</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Privacy, performance, and design integrity are at the heart of
                what we do. Every update brings better features without
                compromising your trust.
              </p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};
