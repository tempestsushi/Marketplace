// Home page — hero, categories, recent listings, and how it works
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Camera,
  Gift,
  Handshake,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import ListingCard from "../components/ListingCard";
import SkeletonCard from "../components/SkeletonCard";
import CategoryCard from "../components/CategoryCard";
import { CATEGORY_CARDS } from "../constants/listingFilters";
import { listProducts } from "../api/productsClient";

const HOW_IT_WORKS = [
  {
    step: "01",
    Icon: Camera,
    title: "Post Your Item",
    desc: "List your books, notes or any academic item in minutes",
  },
  {
    step: "02",
    Icon: Search,
    title: "Browse & Connect",
    desc: "Find what you need and message the seller directly",
  },
  {
    step: "03",
    Icon: Handshake,
    title: "Meet & Exchange",
    desc: "Meet on campus and complete your exchange safely",
  },
];

const TRUST_ITEMS = [
  { Icon: BadgeCheck, label: "Verified Students" },
  { Icon: ShieldCheck, label: "Safer Campus Deals" },
  { Icon: PackageCheck, label: "Useful Academic Finds" },
  { Icon: Sparkles, label: "Simple Listing Tools" },
];

const SERVICE_ITEMS = [
  {
    Icon: Truck,
    title: "Campus Pickup",
    desc: "Meet at familiar university spots",
  },
  {
    Icon: RotateCcw,
    title: "Easy Resale",
    desc: "Relist items after the semester",
  },
  {
    Icon: ShieldCheck,
    title: "Secure Sessions",
    desc: "Protected login and account checks",
  },
];

const REWARD_ITEMS = [
  {
    Icon: BookOpen,
    title: "Save on Books",
    desc: "Find used course material faster",
  },
  {
    Icon: Gift,
    title: "Clear Your Shelf",
    desc: "Turn old supplies into cash",
  },
  {
    Icon: BadgeCheck,
    title: "Build Trust",
    desc: "Reviews help good sellers stand out",
  },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80";

function Home() {
  const [loading, setLoading] = useState(true);
  const [recentListings, setRecentListings] = useState([]);

  // Load recent real listings from API
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await listProducts({ limit: 6, sort: "newest" });
        if (!alive) return;
        setRecentListings(resp.rows || []);
      } catch {
        if (!alive) return;
        setRecentListings([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="page-enter bg-[#f7f3ee] text-[#24301f]">
      <section className="border-b border-[#ded6ca] bg-[#efe8df] pt-16">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#596352] sm:px-6 lg:px-8">
          <span>Student Verified</span>
          <span className="hidden sm:inline">Direct Seller Chat</span>
          <span className="hidden md:inline">Made for Campus Life</span>
          <span className="hidden lg:inline">Simple Local Exchange</span>
        </div>
      </section>

      <section
        className="relative min-h-[620px] border-b border-[#ded6ca] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(247,243,238,0.98) 0%, rgba(247,243,238,0.9) 42%, rgba(247,243,238,0.24) 78%), url(${HERO_IMAGE})`,
        }}
      >
        <div className="mx-auto grid min-h-[620px] max-w-7xl content-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#6f7965]">
              CampusMarket
            </p>
            <h1 className="font-serif text-5xl leading-[0.98] text-[#1f2c1b] md:text-7xl">
              Better finds for your campus life.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#4f5c49]">
              Buy textbooks, notes, electronics and everyday study essentials
              directly from students around your university.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/listings"
                className="inline-flex h-12 items-center bg-[#304826] px-7 text-sm font-bold text-white transition-colors hover:bg-[#24381d]"
              >
                Shop Now
              </Link>
              <Link
                to="/sell"
                className="inline-flex h-12 items-center gap-2 px-2 text-sm font-semibold text-[#304826] hover:text-[#1f2c1b]"
              >
                Start Selling <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-px border-y border-[#ded6ca] bg-[#ded6ca] sm:grid-cols-4">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="bg-[#f7f3ee]/90 px-4 py-5 text-center"
                >
                  <item.Icon
                    className="mx-auto mb-2 text-[#304826]"
                    size={22}
                    strokeWidth={1.6}
                  />
                  <p className="text-xs font-semibold leading-5 text-[#3f4938]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#6f7965] text-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-white/20 px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
          {SERVICE_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 py-6 md:px-8 first:md:pl-0 last:md:pr-0"
            >
              <item.Icon size={28} strokeWidth={1.5} />
              <div>
                <h3 className="text-sm font-bold">{item.title}</h3>
                <p className="mt-1 text-xs text-white/80">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <div>
          <h2 className="font-serif text-3xl text-[#1f2c1b]">
            Shop by Category
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#596352]">
            Everything you need for classes, projects, labs and daily student
            life.
          </p>
          <Link
            to="/listings"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#304826]"
          >
            View All Products <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_CARDS.map((cat) => (
            <CategoryCard
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              color={cat.color}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div className="bg-[#304826] p-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
            Student Perks
          </p>
          <h2 className="mt-4 max-w-sm font-serif text-4xl leading-tight">
            Good choices deserve better deals.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
            Keep useful items moving around campus and make every semester a
            little lighter.
          </p>
          <Link
            to="/register"
            className="mt-7 inline-flex bg-[#dbe8c3] px-5 py-3 text-sm font-bold text-[#304826]"
          >
            Join Now
          </Link>
        </div>
        <div className="grid border border-[#ded6ca] bg-[#fffdf9] md:grid-cols-3">
          {REWARD_ITEMS.map((item) => (
            <div
              key={item.title}
              className="border-b border-[#ded6ca] p-8 text-center last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center bg-[#6f7965] text-white">
                <item.Icon size={22} strokeWidth={1.6} />
              </div>
              <h3 className="text-sm font-bold text-[#24301f]">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#596352]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-[#1f2c1b]">Best Sellers</h2>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#304826]"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : recentListings.length === 0 ? (
          <div className="border border-[#ded6ca] bg-[#fffdf9] p-10 text-center">
            <h3 className="text-lg font-bold text-[#24301f]">
              No listings yet
            </h3>
            <p className="mt-2 text-sm text-[#596352]">
              Be the first student to post an item.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recentListings.slice(0, 4).map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-[#ded6ca] bg-[#fffdf9] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-3xl text-[#1f2c1b]">
            How CampusMarket Works
          </h2>
          <div className="mt-10 grid grid-cols-1 border border-[#ded6ca] md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="border-b border-[#ded6ca] p-8 text-center last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#858b7b]">
                  {item.step}
                </span>
                <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center bg-[#e4ded2] text-[#304826]">
                  <item.Icon size={26} strokeWidth={1.7} />
                </div>
                <h3 className="mt-5 text-base font-bold text-[#24301f]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#596352]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
