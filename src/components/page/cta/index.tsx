import { Button } from "@/components/ui/button";
import {
  LucideGithub as Github,
  LucideInstagram as Instagram,
  LucideFacebook as Facebook,
} from "lucide-react";

export const CTA = () => {
  return (
    <section className="bg-indigo-500 text-white py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Connect with Us</h2>
      <p className="mt-4 text-lg">
        Follow us on social media to stay updated and engaged.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant={"secondary"}
          className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg"
        >
          <Facebook />
          Facebook
        </Button>
        <Button
          variant="secondary"
          className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg"
        >
          <Instagram />
          Instagram
        </Button>
        <Button
          variant={"secondary"}
          className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg"
        >
          <Github />
          Github
        </Button>
      </div>
    </section>
  );
};
