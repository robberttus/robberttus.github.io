import React, { useState } from 'react';
import { SITE_CONTENT } from '../data/siteData';
import { Send } from 'lucide-react';

interface ContactFormProps {
  compact?: boolean;
}

export const ContactFormSection: React.FC<ContactFormProps> = ({ compact = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Het contactformulier doet voorlopig niets zoals gevraagd
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="grid gap-px bg-[#1f1f1f] border border-[#1f1f1f]">
        <div className="grid gap-px bg-[#1f1f1f] md:grid-cols-2">
          {/* Je naam */}
          <div className="bg-[#0a0a0a] p-5 md:p-6 transition-colors focus-within:bg-[#111111]">
            <label
              htmlFor={compact ? 'home-name' : 'contact-name'}
              className="block hud-label text-[#9ca3af] mb-2.5"
            >
              {SITE_CONTENT.contact.fields.name} <span className="text-[#ffa600]">*</span>
            </label>
            <input
              id={compact ? 'home-name' : 'contact-name'}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Robbe Sonck"
              className="w-full border border-[#262626] bg-[#070707] px-3.5 py-2.5 text-sm text-white placeholder-[#52525b] transition-colors focus:border-[#ffa600] focus:outline-none"
            />
          </div>

          {/* Je e-mailadres */}
          <div className="bg-[#0a0a0a] p-5 md:p-6 transition-colors focus-within:bg-[#111111]">
            <label
              htmlFor={compact ? 'home-email' : 'contact-email'}
              className="block hud-label text-[#9ca3af] mb-2.5"
            >
              {SITE_CONTENT.contact.fields.email} <span className="text-[#ffa600]">*</span>
            </label>
            <input
              id={compact ? 'home-email' : 'contact-email'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@voorbeeld.be"
              className="w-full border border-[#262626] bg-[#070707] px-3.5 py-2.5 text-sm text-white placeholder-[#52525b] transition-colors focus:border-[#ffa600] focus:outline-none"
            />
          </div>
        </div>

        {/* Onderwerp */}
        <div className="bg-[#0a0a0a] p-5 md:p-6 transition-colors focus-within:bg-[#111111]">
          <label
            htmlFor={compact ? 'home-subject' : 'contact-subject'}
            className="block hud-label text-[#9ca3af] mb-2.5"
          >
            {SITE_CONTENT.contact.fields.subject} <span className="text-[#ffa600]">*</span>
          </label>
          <input
            id={compact ? 'home-subject' : 'contact-subject'}
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Onderwerp van je bericht"
            className="w-full border border-[#262626] bg-[#070707] px-3.5 py-2.5 text-sm text-white placeholder-[#52525b] transition-colors focus:border-[#ffa600] focus:outline-none"
          />
        </div>

        {/* Je bericht (optioneel) */}
        <div className="bg-[#0a0a0a] p-5 md:p-6 transition-colors focus-within:bg-[#111111]">
          <label
            htmlFor={compact ? 'home-message' : 'contact-message'}
            className="block hud-label text-[#9ca3af] mb-2.5"
          >
            {SITE_CONTENT.contact.fields.message}
          </label>
          <textarea
            id={compact ? 'home-message' : 'contact-message'}
            rows={compact ? 5 : 7}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Schrijf hier je bericht..."
            className="w-full resize-y border border-[#262626] bg-[#070707] px-3.5 py-2.5 text-sm text-white placeholder-[#52525b] transition-colors focus:border-[#ffa600] focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="bg-[#0a0a0a] px-5 py-4 md:px-6 flex items-center justify-between gap-4">
          <span className="hud-label text-[#6b7280] hidden sm:inline">
            robbesonck.be · contactformulier
          </span>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 bg-[#ffa600] px-7 font-mono-tech text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a0a0a] transition-colors duration-150 hover:bg-[#ffb733] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {SITE_CONTENT.contact.fields.submit}
          </button>
        </div>
      </div>
    </form>
  );
};
