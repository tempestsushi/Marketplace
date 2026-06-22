// Listings page — browse all listings with search, filter and sort
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, ChevronLeft, ChevronRight, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';
import SearchBar from '../components/SearchBar';
import { listProducts } from '../api/productsClient';
import { ALL_CATEGORIES, ALL_CONDITIONS, SORT_OPTIONS } from '../constants/listingFilters';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

function getInitialFilter(searchParams, key, fallback) {
  return searchParams.get(key) || fallback;
}

function getInitialPage(searchParams) {
  const page = Number(searchParams.get('page') || 1);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

const PAGE_SIZE = 12;

function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(getInitialFilter(searchParams, 'search', ''));
  const [category, setCategory] = useState(getInitialFilter(searchParams, 'category', 'All'));
  const [condition, setCondition] = useState(getInitialFilter(searchParams, 'condition', 'All'));
  const [sort, setSort] = useState(getInitialFilter(searchParams, 'sort', 'newest'));
  const [page, setPage] = useState(getInitialPage(searchParams));
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const didMountFilters = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const resp = await listProducts({
          search: debouncedSearch,
          category,
          condition,
          sort,
          page,
          limit: PAGE_SIZE,
        });
        if (!alive) return;
        setListings(resp.rows || []);
        setPagination({
          total: Number(resp.total || 0),
          totalPages: Number(resp.totalPages || 1),
          hasNextPage: Boolean(resp.hasNextPage),
          hasPrevPage: Boolean(resp.hasPrevPage),
        });
        if (Number(resp.total || 0) > 0 && page > Number(resp.totalPages || 1)) {
          setPage(Number(resp.totalPages || 1));
        }
      } catch (e) {
        if (!alive) return;
        setListings([]);
        setPagination({ total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
        setError(e?.message || 'Could not load listings');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [category, condition, debouncedSearch, page, sort]);

  useEffect(() => {
    if (!didMountFilters.current) {
      didMountFilters.current = true;
      return;
    }
    setPage(1);
  }, [category, condition, debouncedSearch, sort]);

  useEffect(() => {
    const next = {};
    if (debouncedSearch) next.search = debouncedSearch;
    if (category !== 'All') next.category = category;
    if (condition !== 'All') next.condition = condition;
    if (sort !== 'newest') next.sort = sort;
    if (page > 1) next.page = String(page);
    setSearchParams(next, { replace: true });
  }, [category, condition, debouncedSearch, page, setSearchParams, sort]);

  const hasActiveFilters = category !== 'All' || condition !== 'All' || search !== '' || sort !== 'newest';

  function clearFilters() {
    setSearch('');
    setCategory('All');
    setCondition('All');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  }

  function removeFilter(filterName) {
    setPage(1);
    if (filterName === 'category') { setCategory('All'); setSearchParams({}); }
    if (filterName === 'condition') setCondition('All');
    if (filterName === 'search') setSearch('');
  }

  function goToPage(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), pagination.totalPages || 1);
    setPage(safePage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="pt-20 pb-16 page-enter">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Listings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Search campus items, compare prices, and contact sellers from one place.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {!loading && (
                <>
                  <span className="font-semibold text-gray-900">{pagination.total}</span> result{pagination.total === 1 ? '' : 's'}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        <section className="mb-6 border border-[#ded6ca] bg-[#fffdf9] p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Search books, notes, equipment..." />

            <label className="flex min-w-40 flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500">Category</span>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="border border-[#ded6ca] bg-white px-3 py-2 text-sm
                  transition-all focus:outline-none focus:ring-2 focus:ring-[#304826]"
              >
                {ALL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>

            <label className="flex min-w-36 flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500">Condition</span>
              <select
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setPage(1);
                }}
                className="border border-[#ded6ca] bg-white px-3 py-2 text-sm
                  transition-all focus:outline-none focus:ring-2 focus:ring-[#304826]"
              >
                {ALL_CONDITIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>

            <label className="flex min-w-44 flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500">Sort</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="border border-[#ded6ca] bg-white px-3 py-2 text-sm
                  transition-all focus:outline-none focus:ring-2 focus:ring-[#304826]"
              >
                {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-gray-500">
              <SlidersHorizontal size={16} />
              <span className="text-sm font-medium">Active filters</span>
            </div>
            {!hasActiveFilters && (
              <span className="text-sm text-gray-400">None</span>
            )}
            {hasActiveFilters && (
              <>
                {search && (
                  <span className="flex items-center gap-1 bg-[#e4ded2] px-3 py-1 text-xs font-medium text-[#304826]">
                    Search: "{search}"
                    <button type="button" onClick={() => removeFilter('search')} aria-label="Remove search filter"><X size={12} /></button>
                  </span>
                )}
                {category !== 'All' && (
                  <span className="flex items-center gap-1 bg-[#e4ded2] px-3 py-1 text-xs font-medium text-[#304826]">
                    {category}
                    <button type="button" onClick={() => removeFilter('category')} aria-label="Remove category filter"><X size={12} /></button>
                  </span>
                )}
                {condition !== 'All' && (
                  <span className="flex items-center gap-1 bg-[#e4ded2] px-3 py-1 text-xs font-medium text-[#304826]">
                    {condition}
                    <button type="button" onClick={() => removeFilter('condition')} aria-label="Remove condition filter"><X size={12} /></button>
                  </span>
                )}
                {sort !== 'newest' && (
                  <span className="flex items-center gap-1 bg-[#e4ded2] px-3 py-1 text-xs font-medium text-[#304826]">
                    {SORT_OPTIONS.find((option) => option.value === sort)?.label || 'Custom sort'}
                    <button type="button" onClick={() => { setSort('newest'); setPage(1); }} aria-label="Reset sort"><X size={12} /></button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto inline-flex items-center gap-1 border border-[#ded6ca] px-3 py-1.5 text-sm text-[#596352]
                    transition-all hover:bg-[#e4ded2]"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </>
            )}
          </div>
        </section>

        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Listings could not be loaded.</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Listings grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No listings found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
            <button
              type="button"
              onClick={clearFilters}
              className="bg-[#304826] px-6 py-2.5 text-sm font-medium text-white
                transition-colors duration-200 hover:bg-[#24381d]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-between gap-3 border border-[#ded6ca] bg-[#fffdf9] px-4 py-4 sm:flex-row">
                <p className="text-sm text-[#596352]">
                  Page <span className="font-bold text-[#24301f]">{page}</span> of{' '}
                  <span className="font-bold text-[#24301f]">{pagination.totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => goToPage(page - 1)}
                    className="inline-flex items-center gap-2 border border-[#ded6ca] px-4 py-2 text-sm font-semibold text-[#304826]
                      transition-colors hover:bg-[#e4ded2] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    type="button"
                    disabled={!pagination.hasNextPage}
                    onClick={() => goToPage(page + 1)}
                    className="inline-flex items-center gap-2 bg-[#304826] px-4 py-2 text-sm font-semibold text-white
                      transition-colors hover:bg-[#24381d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Listings;
