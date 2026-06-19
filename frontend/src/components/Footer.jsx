// Footer — clean site footer with logo, quick links and copyright
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Mail, MessageCircle, ShieldCheck } from "lucide-react";

const FOOTER_LINKS = [
  { label: 'Listings', to: '/listings' },
  { label: 'Sell', to: '/sell' },
  { label: 'Orders', to: '/orders' },
  { label: 'Messages', to: '/messages' },
];

const SUPPORT_LINKS = [
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Admin', to: '/admin' },
];

function Footer() {
  return (
    <footer className="mt-auto border-t border-[#ded6ca] bg-[#efe8df] text-[#24301f]">
      <div className="mx-auto grid max-w-7xl gap-0 px-4 py-12 sm:px-6 lg:grid-cols-[1.35fr_1fr_1fr_1.2fr] lg:px-8">
        <div className="border-b border-[#ded6ca] pb-8 lg:border-b-0 lg:border-r lg:pr-10">
          <Link to="/" className="flex items-center gap-3 text-[#304826]">
            <BookOpen size={26} />
            <span className="text-xl font-bold tracking-[0.18em]">CAMPUSMARKET</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#596352]">
            A focused marketplace for students to buy, sell, and exchange campus essentials with less noise.
          </p>
          <Link
            to="/sell"
            className="mt-7 inline-flex items-center gap-2 bg-[#304826] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#24381d]"
          >
            Post a Listing <ArrowRight size={15} />
          </Link>
        </div>

        <div className="border-b border-[#ded6ca] py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-0">
          <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-[#858b7b]">Marketplace</h3>
          <div className="mt-5 grid gap-3">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-medium text-[#3f4938] hover:text-[#304826]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-b border-[#ded6ca] py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-0">
          <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-[#858b7b]">Account</h3>
          <div className="mt-5 grid gap-3">
            {SUPPORT_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-medium text-[#3f4938] hover:text-[#304826]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-8 lg:pl-10 lg:pt-0">
          <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-[#858b7b]">Campus Trust</h3>
          <div className="mt-5 grid gap-4 text-sm text-[#596352]">
            <div className="flex gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#304826]" />
              <span>Student-focused profiles and protected sessions.</span>
            </div>
            <div className="flex gap-3">
              <MessageCircle size={18} className="mt-0.5 shrink-0 text-[#304826]" />
              <span>Message sellers before meeting on campus.</span>
            </div>
            <div className="flex gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-[#304826]" />
              <span>Built for Pakistani university communities.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#ded6ca] px-4 py-4 text-center text-xs font-medium text-[#858b7b]">
        © 2026 CampusMarket. Made for student-to-student exchange.
      </div>
    </footer>
  );
}

export default Footer;
