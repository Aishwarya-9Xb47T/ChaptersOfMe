import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart, GraduationCap, Compass, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const pillars = [
    {
      title: 'Poetry & Verses',
      desc: 'Giving form to that which is delicate, unspoken, and lingering in the corridors of the heart.',
      icon: <Feather className="w-5 h-5 text-rosewood-600" />,
    },
    {
      title: 'Life & Lessons',
      desc: 'Hard-won epiphanies, navigating change, and finding peace when circumstances are unscripted.',
      icon: <Compass className="w-5 h-5 text-amberGold-700" />,
    },
    {
      title: 'Student Life & Growth',
      desc: 'The quiet reality of late-night revision, ambitious doubts, friendship, and discovering our true voice.',
      icon: <GraduationCap className="w-5 h-5 text-sageMuted-600" />,
    },
    {
      title: 'Love & Family',
      desc: 'Remembering our origins, honouring silent maternal sacrifices, and embracing tender connections.',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amberGold-800 block mb-2">
          The Story Behind The Pages
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-950 tracking-tight mb-6">
          About Chapters of Me
        </h1>
        <p className="font-serif italic text-xl sm:text-2xl text-amberGold-900/90 leading-relaxed">
          "A sanctuary for the quiet truths, tender poems, and the unfolding lessons of a curious soul."
        </p>
      </div>

      {/* Main Author Showcase */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-parchment-200/90 p-8 sm:p-12 shadow-sm mb-16">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div className="w-48 sm:w-56 flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-amberGold-300 aspect-[3/4] bg-parchment-200">
              <img
                src="/Me.jpg"
                alt="N. S. Aishwarya"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-parchment-50 font-serif text-sm italic">
                  N. S. Aishwarya
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-ink-700 text-base sm:text-lg leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mb-2">
              Welcome, fellow traveler.
            </h2>
            <p>
              I am <strong>N. S. Aishwarya</strong>. For as long as I can remember, words have been the way I make sense of the world. In the rush of daily schedules, academic expectations, and digital noise, we rarely find space to acknowledge what is soft, honest, and vulnerable inside us.
            </p>
            <p>
              <em>Chapters of Me</em> was born out of a simple desire: to build a permanent, digital journal where feelings are not rushed, poems do not need to apologize for their tenderness, and life lessons can be shared without pretension.
            </p>
            <p>
              Here, you will find writings on <strong>student life</strong>—the exhaustion of exams, the quiet fear of the future, and the small victories of finishing another term. You will find tributes to <strong>family</strong>, reflections on <strong>life lessons</strong>, and above all, the stubborn pursuit of <strong>personal growth</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Writing Philosophy / Why this blog exists */}
      <section className="mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amberGold-800 block mb-2">
            Core Intentions
          </span>
          <h3 className="font-serif text-3xl font-bold text-ink-950">
            What You Will Find Here
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#FFFDF9] border border-parchment-200 shadow-xs hover:border-amberGold-400 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-parchment-100 border border-parchment-300 flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h4 className="font-serif text-xl font-bold text-ink-900 mb-2">
                {pillar.title}
              </h4>
              <p className="text-sm text-ink-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Author Quote Banner */}
      <section className="bg-gradient-to-br from-[#FAF6F0] to-[#F5ECE1] rounded-3xl border border-amberGold-300/80 p-8 sm:p-12 text-center mb-16 shadow-xs relative overflow-hidden">
        <Feather className="w-8 h-8 text-amberGold-600 mx-auto mb-4 opacity-75" />
        <blockquote className="font-serif italic text-2xl sm:text-3xl text-ink-950 max-w-2xl mx-auto leading-relaxed mb-4">
          "If one sentence written here makes you feel a little less lonely in what you carry, then this entire journal has fulfilled its purpose."
        </blockquote>
        <span className="text-xs uppercase tracking-widest text-amberGold-900 font-semibold block">
          — N. S. Aishwarya
        </span>
      </section>

      {/* Call to Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/writings"
          className="w-full sm:w-auto px-8 py-4 bg-ink-900 text-parchment-50 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition flex items-center justify-center gap-2"
        >
          <span>Explore My Writings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/contact"
          className="w-full sm:w-auto px-8 py-4 bg-[#FFFDF9] border border-parchment-300 text-ink-800 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-parchment-100 transition flex items-center justify-center gap-2"
        >
          <span>Send Me a Message</span>
        </Link>
      </div>
    </div>
  );
};
