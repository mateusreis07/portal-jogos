import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - FoxChaos',
  description: 'Learn more about FoxChaos, the premier destination for free online HTML5 browser games.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 md:p-12 shadow-xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-8 text-center flex items-center justify-center gap-3">
          <span className="text-primary text-3xl">🎮</span> About FoxChaos
        </h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-slate-300 leading-relaxed mb-6">
            Welcome to <strong>FoxChaos</strong>, your ultimate destination for free online browser games. We believe that gaming should be accessible, instantaneous, and fun for everyone, anywhere, at any time.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            Our mission is to curate and provide the highest quality HTML5 games on the web. Whether you're on a desktop computer during a break, or on your mobile phone commuting, FoxChaos delivers blazing fast games without the need for downloads or installations.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Why Play Here?</h2>
          <ul className="list-disc pl-6 space-y-3 text-slate-300 mb-6">
            <li><strong>No Downloads:</strong> Click and play instantly. No storage space required.</li>
            <li><strong>Cross-Platform:</strong> Play seamlessly on PC, Mac, tablets, and smartphones.</li>
            <li><strong>Growing Library:</strong> We constantly update our catalog with the newest and most popular titles.</li>
            <li><strong>Safe Environment:</strong> Our team carefully reviews every game to ensure it meets our quality and safety standards.</li>
          </ul>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 mt-10">
            <h3 className="text-xl font-bold text-white mb-2">Publishers & Developers</h3>
            <p className="text-slate-400 text-base m-0">
              Are you an HTML5 game developer? We are always looking for great content to share with our audience. Contact us to feature your games on FoxChaos!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
