import React from 'react';
import { Zap, ShieldCheck, Image, Smartphone } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Lightning Fast",
      desc: "Our optimized servers ensure you get your video converted and ready to download in seconds."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
      title: "No Watermark",
      desc: "Download clean, high-quality videos without any annoying logos or user IDs overlaid."
    },
    {
      icon: <Image className="w-6 h-6 text-purple-400" />,
      title: "Full HD Quality",
      desc: "We support original quality downloads, giving you the crispest visuals for your reposts."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-blue-400" />,
      title: "Mobile Optimized",
      desc: "Works perfectly on any device. Download directly to your iPhone, Android, or desktop."
    }
  ];

  return (
    <section className="py-20 bg-slate-900/50 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose SaveSora?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We are the simplest tool to archive and repost content. No sign-up required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
