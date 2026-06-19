// SearchBar — full width search input with icon
import { Search } from 'lucide-react';

function SearchBar({ value, onChange, placeholder = 'Search listings...' }) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#ded6ca] bg-white py-3 pl-10 pr-4
          text-sm text-[#24301f] placeholder:text-[#858b7b]
          focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#304826]
          transition-all duration-200"
      />
    </div>
  );
}

export default SearchBar;
