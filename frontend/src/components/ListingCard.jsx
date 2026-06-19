// ListingCard — displays a single listing with image, badges, price and seller info
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { CATEGORY_COLORS, CONDITION_COLORS } from '../constants/listingFilters';
import { useFavorites } from '../context/FavoritesContext';
import { formatDate, formatPrice, getInitials } from '../utils/listingFormat';

const FALLBACK_IMAGE = 'https://placehold.co/800x600/F3F4F6/9CA3AF?text=No+Image';

function ListingCard({ id, image, title, price, condition, category, sellerName, campus, date, saved: initialSaved }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isSaved, setIsSaved] = useState(initialSaved || false);
  const resolvedSaved = isFavorite(id) || isSaved;
  const safeTitle = title || 'Untitled listing';
  const safeSellerName = sellerName || 'Campus seller';
  const safeCampus = campus || 'Campus';

  function toggleSave(e) {
    e.preventDefault(); // Prevent card navigation
    e.stopPropagation();
    const next = toggleFavorite({ id, image, title: safeTitle, price, condition, category, sellerName: safeSellerName, campus: safeCampus, date });
    setIsSaved(next);
  }

  return (
    <Link to={`/listings/${id}`} className="block group">
      <article className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-md
        transition-shadow duration-200 overflow-hidden cursor-pointer">

        {/* Image section */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={image || FALLBACK_IMAGE}
            alt={safeTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
          />
          {/* Heart save button */}
          <button
            type="button"
            onClick={toggleSave}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5
              shadow-sm hover:scale-110 transition-all duration-200"
            aria-label={resolvedSaved ? 'Unsave listing' : 'Save listing'}
          >
            <Heart
              size={16}
              className={resolvedSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
        </div>

        {/* Card body */}
        <div className="flex min-h-48 flex-col p-4">
          {/* Badges row */}
          <div className="flex items-center justify-between gap-2">
            <span className={`max-w-[58%] truncate text-xs font-semibold px-2 py-0.5 ${CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700'}`}>
              {category || 'Other'}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 ${CONDITION_COLORS[condition] || 'bg-gray-100 text-gray-700'}`}>
              {condition || 'Good'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mt-3 text-sm leading-snug min-h-10">
            {safeTitle}
          </h3>

          {/* Price */}
          <p className="text-xl font-bold text-[#304826] mt-2">
            {formatPrice(price)}
          </p>

          {/* Seller and campus row */}
          <div className="mt-auto pt-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="w-7 h-7 shrink-0 bg-[#e4ded2] flex items-center justify-center">
                  <span className="text-[#304826] text-xs font-bold">{getInitials(safeSellerName)}</span>
                </div>
                <span className="truncate text-xs text-gray-600 font-medium">{safeSellerName}</span>
              </div>
              <div className="flex min-w-0 items-center gap-1 text-gray-400">
                <MapPin size={11} className="shrink-0" />
                <span className="truncate text-xs">{safeCampus}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{formatDate(date)}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ListingCard;
