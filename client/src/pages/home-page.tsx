import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "wouter";
import { MenuItem } from "@shared/schema";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { MenuSection } from "@/components/menu/menu-section";
import { CategoryFilter } from "@/components/ui/category-filter";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu", { search: searchQuery, category: selectedCategory }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await fetch(`/api/menu?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      return response.json();
    },
  });

  // Update search query from URL params
  useEffect(() => {
    const updateSearchFromURL = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const search = urlParams.get("search") || "";
      setSearchQuery(search);
    };

    updateSearchFromURL();

    // Listen for browser navigation changes
    window.addEventListener('popstate', updateSearchFromURL);

    return () => {
      window.removeEventListener('popstate', updateSearchFromURL);
    };
  }, []);

  // Extract unique categories from menu items
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).map((category) => ({
    id: category,
    name: category,
  }));

  // Since filtering is now done server-side, menuItems is already filtered
  const filteredItems = menuItems;

  // Filter popular items from the filtered results
  const popularItems = menuItems.filter((item) => item.isPopular);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-primary">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Delicious Food</span>
            <span className="block">Delivered To Your Door</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-white text-opacity-90 text-lg">
            Browse our menu and get your favorite meals delivered fast and fresh.
          </p>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="bg-background py-4 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Search Results Info */}
            {searchQuery && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} for "{searchQuery}"</span>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    window.history.replaceState(null, '', '/');
                  }}
                  className="text-sm text-muted-foreground hover:text-destructive underline transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Menu Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredItems.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full p-6 mb-4 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground mb-6">Try searching for something else or browse all items.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  window.history.replaceState(null, '', '/');
                }}
                className="text-primary hover:text-primary/80 underline"
              >
                Clear search and show all items
              </button>
            </div>
          ) : (
            <>
              {selectedCategory === "all" && popularItems.length > 0 && (
                <MenuSection title="Popular Items" items={popularItems} />
              )}

              <MenuSection
                title={
                  searchQuery
                    ? `Search Results${selectedCategory !== "all" ? ` in ${selectedCategory}` : ''}`
                    : selectedCategory === "all"
                      ? "All Items"
                      : selectedCategory
                }
                items={filteredItems}
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
      <CartSidebar />
    </div>
  );
}
