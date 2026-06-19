export const ALL_CATEGORIES = ['All', 'Books', 'Notes', 'Electronics', 'Stationery', 'Lab Equipment', 'Other'];

export const ALL_CONDITIONS = ['All', 'New', 'Good', 'Fair', 'Poor'];

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export const CATEGORY_CARDS = [
  { icon: 'books', label: 'Books', color: 'bg-[#fffdf9] border-[#ded6ca] text-[#304826] hover:bg-[#e4ded2]' },
  { icon: 'notes', label: 'Notes', color: 'bg-[#fffdf9] border-[#ded6ca] text-[#304826] hover:bg-[#e4ded2]' },
  { icon: 'electronics', label: 'Electronics', color: 'bg-[#fffdf9] border-[#ded6ca] text-[#304826] hover:bg-[#e4ded2]' },
  { icon: 'stationery', label: 'Stationery', color: 'bg-[#fffdf9] border-[#ded6ca] text-[#304826] hover:bg-[#e4ded2]' },
  { icon: 'lab', label: 'Lab Equipment', color: 'bg-[#fffdf9] border-[#ded6ca] text-[#304826] hover:bg-[#e4ded2]' },
  { icon: 'other', label: 'Other', color: 'bg-[#fffdf9] border-[#ded6ca] text-[#304826] hover:bg-[#e4ded2]' },
];

export const CONDITION_COLORS = {
  New: 'bg-green-100 text-green-700',
  'Like New': 'bg-blue-100 text-blue-700',
  Good: 'bg-yellow-100 text-yellow-700',
  Fair: 'bg-orange-100 text-orange-700',
  Poor: 'bg-red-100 text-red-700',
};

export const CATEGORY_COLORS = {
  Books: 'bg-[#e4ded2] text-[#304826]',
  Notes: 'bg-[#e4ded2] text-[#304826]',
  Electronics: 'bg-[#e4ded2] text-[#304826]',
  Stationery: 'bg-[#e4ded2] text-[#304826]',
  'Lab Equipment': 'bg-[#e4ded2] text-[#304826]',
  Other: 'bg-gray-100 text-gray-700',
};
