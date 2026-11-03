import React from 'react';
import './CategoryFilter.css';

export interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  counts?: Record<string, number>;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  counts = {}
}: CategoryFilterProps) {
  return (
    <div className="category-filter-bar" role="tablist" aria-label="Clothing Categories">
      <div className="category-filter-scroll">
        {categories.map((category) => {
          const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
          const count = counts[category];

          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`category-pill-btn ${isSelected ? 'category-pill-active' : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              <span>{category}</span>
              {typeof count === 'number' && (
                <span className={`category-pill-count ${isSelected ? 'count-active' : ''}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
