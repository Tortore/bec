import { company } from "@/data/company";
import { Reveal } from "@/components/motion/reveal";

const quotes = [
  {
    quote:
      "Au-delà de la simple conception architecturale, notre mission est de bâtir un futur où chaque projet devient un symbole d'innovation et de fierté.",
    author: "Caleb Tshileu",
    role: "Directeur Général, co-fondateur",
  },
  {
    quote:
      "Nous nous engageons à transformer chaque idée en une œuvre architecturale unique, alliant modernité et durabilité.",
    author: "Bureau d'Études et Construction",
    role: "Vision du cabinet",
  },
  {
    quote:
      "Notre philosophie d'équipe repose sur l'innovation, la collaboration, et la proximité avec nos clients et partenaires.",
    author: "Équipe BEC",
    role: company.values[3].name,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Parole du cabinet</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">
            Une architecture de confiance.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {quotes.map((item, index) => (
            <Reveal key={item.author} delay={index * 0.08}>
              <blockquote className="flex h-full flex-col justify-between rounded-2xl bg-anthracite p-8 text-white">
                <p className="text-lg leading-relaxed text-white/85">“{item.quote}”</p>
                <footer className="mt-8">
                  <cite className="not-italic">
                    <span className="block font-medium">{item.author}</span>
                    <span className="mt-1 block text-sm text-white/55">{item.role}</span>
                  </cite>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
