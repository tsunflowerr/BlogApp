import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, User, FileText, Folder, Tag, Heart, MessageCircle, Eye } from "lucide-react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { MoreVertical } from "lucide-react";
import { useLikePost } from "../hooks/useLikePost";
import axios from "axios";
import { toast } from "react-toastify";

const url_api = "http://localhost:4000/api";

const SearchPage = ({currentUser}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
    categories: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filters = [
    { key: "all", label: "All", icon: Search },
    { key: "posts", label: "Post", icon: FileText },
    { key: "users", label: "User", icon: User },
    { key: "categories", label: "Category", icon: Folder },
    { key: "tags", label: "Tag", icon: Tag }
  ];

   const timeAgo = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const seconds = Math.floor((new Date() - date) / 1000);

      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval} minute${interval > 1 ? "s" : ""} ago`;
      return "Just now";
    };
  // Fetch search results
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

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
  };

  const handleTagClick = (tagSlug) => {
    navigate(`/tag/${tagSlug}`);
  };

  const { mutate: likePost } = useLikePost((updater) => {
  setSearchResults((prev) => ({
    ...prev,
    posts: updater(prev.posts)
  }));
});
  // Render post card
  const PostCard = ({ post }) => (
     <div key={post._id} className="bg-white max-w-5xl w-full border rounded-3xl border-gray-100 shadow flex flex-col shadow-gray-200 justify-start p-3">
        <div className="flex gap-10 justify-between border-b-2 border-gray-200">
          <div className="flex flex-col">
            <div className="gap-2 flex items-center hover:cursor-pointer" onClick={() => navigate(`/profile/${post.author._id}`)}>
                <img src={post.author.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex flex-col gap-0 mb-1.5">
                        <span className="text-md font-semibold text-gray-700 hover:underline">{post.author.username}</span>
                        <span className="text-xs text-gray-500">{timeAgo(post.createAt)}</span>
                    </div>
              </div>
            <div className="mb-3 mt-3 flex items-start gap-2">
              {post.category.map((category) => (
                <span key={category._id} onClick={() => navigate(`/category/${category.slug}`)} className="text-sm hover:cursor-pointer font-sans font-semibold bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-0.5 rounded-full">{category.name}</span>
              ))}
            </div>
            <div className=" flex flex-col">
              <div onClick={() => navigate(`/posts/${post._id}`)} className="gap-3 justify-start hover:cursor-pointer flex flex-col  pb-2">
                <span className="text-xl font-semibold text-gray-70">{post.title}</span>
                  <p className="text-gray-700 leading-relaxed">{post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content}</p>
              </div>
              <div className="mb-3  flex items-start gap-2">
                  {post.tags.map((tag) => (
                    <span onClick={() => navigate(`/tag/${tag._id}`)} key={tag._id} className="text-sm font-semibold bg-gray-100 hover:cursor-pointer text-gray-700 hover:bg-gray-200 px-2 py-0.5 rounded-full">#{tag.name}</span>
                  ))}
              </div>
            </div>
          </div>
          <img src={post.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username || "User")}&background=random`} alt="post" className="max-w-sm p-3  hidden lg:block w-full 2xl:h-100 mb-2 h-64 object-cover rounded-xl"/>
        </div>
                                
        <div className="flex justify-between items-center">
          <div className="flex ml-5 gap-3 justify-start text-center mt-4">
            <span onClick={() => likePost({ postId: post._id, token: currentUser.token })} className={`text-md hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-22 ${post.likes.includes(currentUser?._id) ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
              <AiOutlineLike className="inline w-5 h-5 items-center mb-1 text-lg"/> {post.likeCount} Likes
            </span>
            <span onClick={() => navigate(`/posts/${post._id}`)} className="ml-2 text-md items-center text-gray-500 hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-32">
              <FaRegComment className="w-4 mb-1 mr-1.5  inline h-4"/>{post.comments.length} Comments
            </span> 
          </div>
        </div>
      </div>
  );

  // Render user card
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
            <span className="font-medium text-gray-900">{userData.followers.length || 0}</span>
            <span className="ml-1">Follwer</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">{userData.followings.length || 0}</span>
            <span className="ml-1">Following</span>
          </div>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );

  // Render category card
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
          View post →
        </button>
      </div>
    </div>
  );

  // Render tag card
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
          View post →
        </button>
      </div>
    </div>
  );

  // Render section
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
              More {items.length - limit} results
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
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Tìm kiếm nội dung</h2>
            <p className="text-gray-500">Nhập từ khóa để tìm kiếm bài viết, người dùng, danh mục và thẻ</p>
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
                  title="Post"
                  items={searchResults.posts}
                  renderCard={(post) => <PostCard post={post} />}
                />
                <Section
                  title="User"
                  items={searchResults.users}
                  renderCard={(user) => <UserCard user={user} />}
                />
                <Section
                  title="Category"
                  items={searchResults.categories}
                  renderCard={(category) => <CategoryCard category={category} />}
                />
                <Section
                  title="Tag"
                  items={searchResults.tags}
                  renderCard={(tag) => <TagCard tag={tag} />}
                />
              </div>
            )}

            {activeFilter === "posts" && (
              <Section
                title="Post"
                items={searchResults.posts}
                renderCard={(post) => <PostCard post={post} />}
                showAll={true}
              />
            )}

            {activeFilter === "users" && (
              <Section
                title="User"
                items={searchResults.users}
                renderCard={(user) => <UserCard user={user} />}
                showAll={true}
              />
            )}

            {activeFilter === "categories" && (
              <Section
                title="Category"
                items={searchResults.categories}
                renderCard={(category) => <CategoryCard category={category} />}
                showAll={true}
              />
            )}

            {activeFilter === "tags" && (
              <Section
                title="Tag"
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
                  Không tìm thấy kết quả
                </h2>
                <p className="text-gray-500 mb-6">
                  Không có kết quả nào cho "{query}". Hãy thử với từ khóa khác.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Quay về trang chủ
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