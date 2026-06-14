'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function DribbbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.311c-.115-.03-.99-.253-2.01-.253-.6 0-1.27.055-1.97.162a14.787 14.787 0 00-2.74-3.856c1.012-.38 2.602-.79 4.79-.364zm-5.02 9.04c.209-.393.414-.788.614-1.181 1.01.1 2.001.07 2.95-.077a8.53 8.53 0 01-3.56 1.258zm-1.59-11.23c2.27-.474 4.31-.173 5.39.088a8.535 8.535 0 01-1.85 4.474c-.075-.109-.15-.22-.23-.33a15.312 15.312 0 00-3.31-4.232zm-2.28 1.25c.086.09.176.19.26.29a15.54 15.54 0 013.385 4.4c-.02.03-.04.07-.06.1a15.625 15.625 0 01-8.007-1.66 8.53 8.53 0 014.422-3.13zm-5.18 8.34a8.496 8.496 0 01-.5-2.91c.04-.02.066-.04.102-.061a14.43 14.43 0 007.57 1.27c-.173.34-.349.69-.533 1.03a15.59 15.59 0 01-6.639-2.329zm4.74 3.77c-.01 0-.02 0-.03.01a8.49 8.49 0 01-2.3-3.04c.02-.08.05-.17.08-.25a16.814 16.814 0 006.24 2.22 8.497 8.497 0 01-3.99 1.06z" clipRule="evenodd" />
    </svg>
  );
}

const footerData = {
  facebookLink: 'https://facebook.com/investmirror',
  instaLink: 'https://instagram.com/investmirror',
  twitterLink: 'https://twitter.com/investmirror',
  githubLink: 'https://github.com/investmirror',
  dribbbleLink: 'https://dribbble.com/investmirror',
  services: [
    { text: 'Wealth Dashboard', href: '/dashboard' },
    { text: 'Asset Explorer', href: '/explorer' },
    { text: 'Behavioral DNA', href: '/archetype' },
    { text: 'Crisis Simulator', href: '/crash-lab' },
  ],
  about: [
    { text: 'Decision Journal', href: '/decision-journal' },
    { text: 'Behavioral Thesis', href: '/archetype' },
    { text: 'Meet the Team', href: '#' },
    { text: 'Careers', href: '#' },
  ],
  help: [
    { text: 'FAQs', href: '#' },
    { text: 'Support', href: '#' },

  ],
  contact: {
    email: 'contact@pranavk.tech',
    phone: '+91 8302801639',
    address: 'Rajasthan, India',
  },
  company: {
    name: 'InvestMirror',
    description:
      'Mirror your investment habits, discover your behavioral investor archetype, and stress-test your portfolio against historical financial crises.',
  },
};

const socialLinks = [
  { icon: FacebookIcon, label: 'Facebook', href: footerData.facebookLink },
  { icon: InstagramIcon, label: 'Instagram', href: footerData.instaLink },
  { icon: TwitterIcon, label: 'Twitter', href: footerData.twitterLink },
  { icon: GithubIcon, label: 'GitHub', href: footerData.githubLink },
  { icon: DribbbleIcon, label: 'Dribbble', href: footerData.dribbbleLink },
];

const contactInfo = [
  { icon: Mail, text: footerData.contact.email },
  { icon: Phone, text: footerData.contact.phone },
  { icon: MapPin, text: footerData.contact.address, isAddress: true },
];

export default function Footer() {
  return (
    <footer className="relative z-20 bg-[#0e0f0c] text-white py-16 sm:py-20 border-t border-zinc-950 rounded-t-[32px] w-full mt-16 shrink-0">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-3 sm:justify-start items-center">
              <div className="h-9 w-9 flex items-center justify-center">
                <img
                  src="/favicon/favicon.svg"
                  alt="InvestMirror Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                {footerData.company.name}
              </span>
            </div>

            <p className="text-zinc-400 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left text-xs font-semibold">
              {footerData.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-[#9fe870] transition-colors duration-200"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-mono tracking-widest uppercase text-white font-bold">[ About Us ]</p>
              <ul className="mt-8 space-y-4 text-xs">
                {footerData.about.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-zinc-400 hover:text-[#9fe870] transition-colors duration-200"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-[10px] font-mono tracking-widest uppercase text-white font-bold">[ Our Modules ]</p>
              <ul className="mt-8 space-y-4 text-xs">
                {footerData.services.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-zinc-400 hover:text-[#9fe870] transition-colors duration-200"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left col-span-2 sm:col-span-1">
              <p className="text-[10px] font-mono tracking-widest uppercase text-white font-bold">[ Help & Contact ]</p>
              <ul className="mt-8 space-y-4 text-xs">
                {(footerData.help as Array<{ text: string; href: string; hasIndicator?: boolean }>).map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={`${hasIndicator
                        ? 'group flex justify-center gap-1.5 sm:justify-start items-center'
                        : 'text-zinc-400 hover:text-[#9fe870] transition-colors duration-200'
                        }`}
                    >
                      <span className="text-zinc-400 group-hover:text-[#9fe870] transition-colors duration-200">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-[#9fe870] absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-[#9fe870] relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-1.5 sm:justify-start text-zinc-400 hover:text-[#9fe870] transition-colors duration-200"
                      href="#"
                    >
                      <Icon className="text-zinc-400 group-hover:text-[#9fe870] size-4 shrink-0" />
                      {isAddress ? (
                        <address className="text-zinc-400 group-hover:text-[#9fe870] -mt-0.5 flex-1 not-italic transition text-[11px] leading-tight">
                          {text}
                        </address>
                      ) : (
                        <span className="text-zinc-400 group-hover:text-[#9fe870] flex-1 transition text-[11px] leading-none">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800/80 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6 border-b border-zinc-800/20 pb-6 text-xs text-zinc-400">
            <span>Project developed for the</span>
            <a
              href="https://rupeestop.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mx-1 hover:opacity-80 transition-opacity duration-200"
            >
              <img src="/RP.webp" alt="Rupeestop Logo" className="h-5 w-auto rounded-sm brightness-110 contrast-110" />
            </a>
            <span>by</span>
            <a
              href="https://pranavk.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#9fe870] font-bold transition-colors duration-200"
            >
              Pranav Khandelwal
            </a>
          </div>

          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
              InvestMirror v1.0 // by Pranav
            </p>

            <p className="text-zinc-500 mt-4 text-[10px] font-mono transition sm:order-first sm:mt-0 uppercase">
              &copy; {new Date().getFullYear()} {footerData.company.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
