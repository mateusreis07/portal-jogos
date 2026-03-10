import { Metadata } from 'next';
import { Mail, MapPin, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - Arcade Hub',
  description: 'Get in touch with the Arcade Hub team for support, business inquiries, or feedback.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Have a question, feedback, or a business inquiry? We'd love to hear from you. Fill out the form or use our contact details below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Contact Info Cards */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="bg-primary/20 p-3 rounded-full mb-4 text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-1">Email</h3>
            <p className="text-slate-400 text-sm">support@arcadehub.example.com</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="bg-primary/20 p-3 rounded-full mb-4 text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-1">Social Media</h3>
            <p className="text-slate-400 text-sm">@ArcadeHubGames</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="bg-primary/20 p-3 rounded-full mb-4 text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-1">Office</h3>
            <p className="text-slate-400 text-sm">San Francisco, CA</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <form className="flex flex-col gap-6" action="#" method="POST">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
              <select
                id="subject"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option>General Inquiry</option>
                <option>Game Submission (Developers)</option>
                <option>Report a Bug</option>
                <option>Business Partnership</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea
                id="message"
                rows={5}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y"
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
