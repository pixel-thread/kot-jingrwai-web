export const Features = () => {
  return (
    <section id="features" className="bg-indigo-500 text-white">
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          Powerful Features
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="p-6 bg-white  rounded-xl shadow-md">
            <h3 className="text-xl text-black font-semibold mb-2">
              ⚡ Lightning Fast
            </h3>
            <p className="text-black dark:text-white">
              Minimal load times and seamless transitions for a frictionless
              experience.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-200 rounded-xl shadow-md">
            <h3 className="text-xl text-black font-semibold mb-2">
              🔒 Built for Security
            </h3>
            <p className="text-black">
              Enterprise-grade encryption ensures your data remains safe.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-xl text-black font-semibold mb-2">
              ✨ Elegant Design
            </h3>
            <p className="text-black">
              Crafted with attention to typography, color, and user-focused
              details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
