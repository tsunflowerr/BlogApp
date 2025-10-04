import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useOutletContext } from "react-router-dom";
import { Search, User, FileText, Folder, Tag } from "lucide-react";
import { useLikePost } from "../hooks/useLikePost";
import { useBookmark } from "../hooks/useBookmark";
import { useUserBookmarks } from "../hooks/useUserBookmarks";
import axios from "axios";
import { toast } from "react-toastify";
import ProfilePostCard from "../components/ProfilePostCard";

const url_api = "http://localhost:4000/api";

const SearchPage = ({ currentUser }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const { timeAgo } = useOutletContext();
  
  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
    categories: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Use custom hooks
  const { mutate: likePost } = useLikePost((updater) => {
    setSearchResults((prev) => ({
      ...prev,
      posts: updater(prev.posts)
    }));
  });

  const { data: userBookmarks = [] } = useUserBookmarks(currentUser?.token);
  const userBookmarkIds = userBookmarks?.map(post => post._id) || [];

  const { mutate: bookmarkPost } = useBookmark();

  const filters = [
    { key: "all", label: "All", icon: Search },
    { key: "posts", label: "Post", icon: FileText },
    { key: "users", label: "User", icon: User },
    { key: "categories", label: "Category", icon: Folder },
    { key: "tags", label: "Tag", icon: Tag }
  ];

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setSearchResults({ posts: [], users: [], categories: [], tags: [] });
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${url_api}/search?query=${query}`);
        if (res.data.success) {
          setSearchResults(res.data);
        }
      } catch (err) {
        console.error("Error searching:", err);
        toast.error("Failed to search");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleBookmark = (postId) => {
    bookmarkPost({ postId, token: currentUser?.token });
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
  };

  const handleTagClick = (tagSlug) => {
    navigate(`/tag/${tagSlug}`);
  };

  // User Card Component
  const UserCard = ({ user: userData }) => (
    <div
      onClick={() => handleUserClick(userData._id)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 cursor-pointer group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          {userData.avatar ? (
            <img
              src={userData.avatar}
              alt={userData.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
              {userData.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {userData.username}
          </h3>
          <p className="text-sm text-gray-600">{userData.email}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex gap-4 text-sm text-gray-500">
          <div>
            <span className="font-medium text-gray-900">{userData.followers?.length || 0}</span>
            <span className="ml-1">Followers</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">{userData.followings?.length || 0}</span>
            <span className="ml-1">Following</span>
          </div>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );

  // Category Card Component
  const CategoryCard = ({ category }) => (
    <div
      onClick={() => handleCategoryClick(category.slug)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 cursor-pointer group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Folder className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
        </div>
      </div>

      {category.description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{category.description}</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Category • {category.slug}
        </div>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
          View posts →
        </button>
      </div>
    </div>
  );

  // Tag Card Component
  const TagCard = ({ tag }) => (
    <div
      onClick={() => handleTagClick(tag.slug)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 cursor-pointer group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Tag className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
            #{tag.name}
          </h3>
        </div>
      </div>

      {tag.description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{tag.description}</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Tag • {tag.slug}
        </div>
        <button className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
          View posts →
        </button>
      </div>
    </div>
  );

  // Section Component
  const Section = ({ title, items, renderCard, showAll = false, limit = 5 }) => {
    if (!items || items.length === 0) return null;

    const displayItems = showAll ? items : items.slice(0, limit);

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          {title}
          <span className="text-sm font-normal text-gray-500">({items.length} results)</span>
        </h2>
        <div className="grid gap-4">
          {displayItems.map((item, index) => (
            <div key={item._id || index}>
              {renderCard(item)}
            </div>
          ))}
        </div>
        {!showAll && items.length > limit && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveFilter(title.toLowerCase().includes('post') ? 'posts' : 
                                           title.toLowerCase().includes('user') ? 'users' :
                                           title.toLowerCase().includes('category') ? 'categories' : 'tags')}
              className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Show {items.length - limit} more results
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Search content</h2>
            <p className="text-gray-500">Enter keywords to search for posts, users, categories and tags</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search results for "{query}"
          </h1>
          <p className="text-gray-600">
            Found {(searchResults.posts?.length || 0) + (searchResults.users?.length || 0) + 
            (searchResults.categories?.length || 0) + (searchResults.tags?.length || 0)} results
          </p>
        </div>

        {/* Filter tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-8">
          <div className="flex gap-2 overflow-x-auto justify-around">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const count = filter.key === 'all' 
                ? (searchResults.posts?.length || 0) + (searchResults.users?.length || 0) + 
                  (searchResults.categories?.length || 0) + (searchResults.tags?.length || 0)
                : searchResults[filter.key]?.length || 0;
              
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeFilter === filter.key
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                  {count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeFilter === filter.key
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Finding...</p>
          </div>
        ) : (
          <div>
            {activeFilter === "all" && (
              <div>
                <Section
                  title="Posts"
                  items={searchResults.posts}
                  renderCard={(post) => (
                    <ProfilePostCard
                      key={post._id}
                      post={post}
                      timeAgo={timeAgo}
                      currentUser={currentUser}
                      onLike={(postId) => likePost({ postId, token: currentUser?.token })}
                      onBookmark={handleBookmark}
                      isBookmarked={userBookmarkIds.includes(post._id)}
                    />
                  )}
                />
                <Section
                  title="Users"
                  items={searchResults.users}
                  renderCard={(user) => <UserCard user={user} />}
                />
                <Section
                  title="Categories"
                  items={searchResults.categories}
                  renderCard={(category) => <CategoryCard category={category} />}
                />
                <Section
                  title="Tags"
                  items={searchResults.tags}
                  renderCard={(tag) => <TagCard tag={tag} />}
                />
              </div>
            )}

            {activeFilter === "posts" && (
              <Section
                title="Posts"
                items={searchResults.posts}
                renderCard={(post) => (
                  <ProfilePostCard
                    key={post._id}
                    post={post}
                    timeAgo={timeAgo}
                    currentUser={currentUser}
                    onLike={(postId) => likePost({ postId, token: currentUser?.token })}
                    onBookmark={handleBookmark}
                    isBookmarked={userBookmarkIds.includes(post._id)}
                  />
                )}
                showAll={true}
              />
            )}

            {activeFilter === "users" && (
              <Section
                title="Users"
                items={searchResults.users}
                renderCard={(user) => <UserCard user={user} />}
                showAll={true}
              />
            )}

            {activeFilter === "categories" && (
              <Section
                title="Categories"
                items={searchResults.categories}
                renderCard={(category) => <CategoryCard category={category} />}
                showAll={true}
              />
            )}

            {activeFilter === "tags" && (
              <Section
                title="Tags"
                items={searchResults.tags}
                renderCard={(tag) => <TagCard tag={tag} />}
                showAll={true}
              />
            )}

            {/* No results */}
            {!loading && 
             !searchResults.posts?.length && 
             !searchResults.users?.length && 
             !searchResults.categories?.length && 
             !searchResults.tags?.length && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                  No results found
                </h2>
                <p className="text-gray-500 mb-6">
                  No results for "{query}". Try different keywords.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to home
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;