import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { catalogueService } from '../../services/catalogueService';
import { OutfitCard } from './OutfitCard';
import { CategoryFilter } from './CategoryFilter';
import { OutfitCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Outfit, Category } from '../../types';
import './OutfitGrid.css';

export interface OutfitGridProps {
  initialCategory?: string;
}

export function OutfitGrid({ initialCategory = 'All' }: OutfitGridProps) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [categories, setCategories] = useState<Category[]>(['All', 'Casual', 'Formal', 'Traditional', 'Streetwear', 'Party Wear']);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('loading');
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await catalogueService.getOutfits(selectedCategory, searchQuery);
        if (!ignore) {
          setOutfits(data.outfits || []);
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          setDataSource(data.source);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Unable to load clothing catalogue';
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [selectedCategory, searchQuery, reloadTrigger]);

  const handleRetry = () => {
    setReloadTrigger(prev => prev + 1);
  };

  // Compute category counts for pills
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: outfits.length };
    categories.forEach(c => {
      if (c !== 'All') {
        counts[c] = outfits.filter(o => o.category.toLowerCase() === c.toLowerCase()).length;
      }
    });
    return counts;
  }, [outfits, categories]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <section className="catalogue-section" id="catalogue-browse" aria-label="Clothing Catalogue">
      <div className="container">
        {/* Section Header */}
        <div className="catalogue-header animate-fade-up">
          <div className="catalogue-header-text">
            <div className="accent-pill">
              <Sparkles size={13} /> Curated Collection
            </div>
            <h2 className="catalogue-heading">Explore Your Next Look</h2>
            <p className="catalogue-subheading">
              Find your style. Explore different outfits and see what suits you before trying on virtually.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="catalogue-search-wrap">
            <div className="search-input-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles, fabrics, jackets..."
                className="search-input"
                aria-label="Search outfits"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          counts={categoryCounts}
        />

        {/* Grid Content State Machine */}
        {loading ? (
          /* Loading Skeletons */
          <div className="outfit-grid-container" aria-busy="true">
            {Array.from({ length: 8 }).map((_, idx) => (
              <OutfitCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <ErrorState
            title="Failed to Load Catalogue"
            message={error}
            onRetry={handleRetry}
            retryLabel="Reload Catalogue"
          />
        ) : outfits.length === 0 ? (
          /* Empty Search / Filter State */
          <EmptyState
            title="No outfits match your criteria"
            description={
              searchQuery
                ? `We couldn't find any clothing matching "${searchQuery}" in category ${selectedCategory}.`
                : `There are currently no items in the ${selectedCategory} category.`
            }
            actionLabel="Reset Filters"
            onAction={handleClearFilters}
          />
        ) : (
          /* Outfits Grid */
          <>
            <div className="catalogue-results-meta">
              <span className="results-count">
                Showing <strong>{outfits.length}</strong> {outfits.length === 1 ? 'outfit' : 'outfits'}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </span>
              {dataSource === 'backend' && (
                <span className="results-badge-live">
                  <span className="status-dot"></span> Live Backend Sync
                </span>
              )}
            </div>

            <div className="outfit-grid-container">
              {outfits.map((outfit) => (
                <OutfitCard key={outfit.id} outfit={outfit} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
