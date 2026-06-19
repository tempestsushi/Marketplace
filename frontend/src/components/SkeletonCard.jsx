// SkeletonCard — animated placeholder shown while listings load
function SkeletonCard() {
  return (
    <div className="overflow-hidden border border-[#ded6ca] bg-white shadow-sm">
      {/* Image placeholder */}
      <div className="skeleton h-48 w-full" />

      <div className="p-4 space-y-3">
        {/* Badges row */}
        <div className="flex justify-between">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-5 w-16" />
        </div>

        {/* Title */}
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />

        {/* Price */}
        <div className="skeleton h-7 w-24" />

        {/* Seller row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="skeleton h-7 w-7" />
            <div className="skeleton h-4 w-20" />
          </div>
          <div className="skeleton h-4 w-24" />
        </div>

        {/* Date */}
        <div className="skeleton h-3 w-28" />
      </div>
    </div>
  );
}

export default SkeletonCard;
