import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, FileText } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineLike } from "react-icons/ai";
const url ="http://localhost:4000";
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const Analytics = () => {
const [timeFilter, setTimeFilter] = useState('all'); // 'all', '24h', '7d', '30d'
const [postData, setPostData] = React.useState([]);
const [loading, setLoading] = React.useState(false);
const navigate = useNavigate();

useEffect(() => {
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if(!token) throw new Error("No token found");
            const {data} = await axios.get(`${url}/api/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPostData(data.posts);
        }
        catch(err) {
            console.error("Error fetching posts",err);
            toast.error("Error fetching posts");
        }
        finally{
            setLoading(false);
        }
    }
    fetchPosts();
},[]);

    const filteredData = useMemo(() => {
        if (timeFilter === 'all') return postData;
        
        const now = new Date();
        const filterDate = new Date();
        
        if (timeFilter === '24h') {
            filterDate.setHours(now.getHours() - 24);
        } else if (timeFilter === '7d') {
            filterDate.setDate(now.getDate() - 7);
        } else if (timeFilter === '30d') {
            filterDate.setDate(now.getDate() - 30);
        }
        
        return postData.filter(post => new Date(post.createAt) >= filterDate);
    }, [postData, timeFilter]);

    // Tính toán dữ liệu cho kỳ trước để so sánh tăng trưởng
    const previousPeriodData = useMemo(() => {
        if (timeFilter === 'all') return [];
        
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();
        
        if (timeFilter === '24h') {
            startDate.setHours(now.getHours() - 48);
            endDate.setHours(now.getHours() - 24);
        } else if (timeFilter === '7d') {
            startDate.setDate(now.getDate() - 14);
            endDate.setDate(now.getDate() - 7);
        } else if (timeFilter === '30d') {
            startDate.setDate(now.getDate() - 60);
            endDate.setDate(now.getDate() - 30);
        }
        
        return postData.filter(post => {
            const postDate = new Date(post.createAt);
            return postDate >= startDate && postDate < endDate;
        });
    }, [postData, timeFilter]);

    // Thống kê tổng quan
    const stats = useMemo(() => {
        const totalPosts = filteredData.length;
        const totalLikes = filteredData.reduce((acc, post) => acc + (post.likeCount || 0), 0);
        const totalViews = filteredData.reduce((acc, post) => acc + (post.view || 0), 0);
        const totalComments = filteredData.reduce((acc, post) => acc + (post.comments?.length || 0), 0);

        // Tính cho kỳ trước
        const prevTotalPosts = previousPeriodData.length;
        const prevTotalLikes = previousPeriodData.reduce((acc, post) => acc + (post.likeCount || 0), 0);
        const prevTotalViews = previousPeriodData.reduce((acc, post) => acc + (post.view || 0), 0);
        const prevTotalComments = previousPeriodData.reduce((acc, post) => acc + (post.comments?.length || 0), 0);

        // Tính phần trăm tăng trưởng
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous * 100).toFixed(1);
        };

        return {
            totalPosts,
            totalLikes,
            totalViews,
            totalComments,
            postsGrowth: calculateGrowth(totalPosts, prevTotalPosts),
            likesGrowth: calculateGrowth(totalLikes, prevTotalLikes),
            viewsGrowth: calculateGrowth(totalViews, prevTotalViews),
            commentsGrowth: calculateGrowth(totalComments, prevTotalComments),
        };
    }, [filteredData, previousPeriodData]);

    // Dữ liệu cho biểu đồ tròn Category
    const categoryData = useMemo(() => {
        const categoryCount = {};
        filteredData.forEach(post => {
            if (post.category && Array.isArray(post.category)) {
                post.category.forEach(cat => {
                    const catName = cat.name || cat;
                    categoryCount[catName] = (categoryCount[catName] || 0) + 1;
                });
            }
        });
        return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
    }, [filteredData]);

    // Dữ liệu cho biểu đồ tròn Tags
    const tagData = useMemo(() => {
        const tagCount = {};
        filteredData.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => {
                    const tagName = tag.name || tag;
                    tagCount[tagName] = (tagCount[tagName] || 0) + 1;
                });
            }
        });
        return Object.entries(tagCount).map(([name, value]) => ({ name, value })).slice(0, 8);
    }, [filteredData]);

    // Top 5 bài viết nhiều like nhất
    const topPosts = useMemo(() => {
        return [...filteredData]
            .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
            .slice(0, 5);
    }, [filteredData]);

    // Dữ liệu biểu đồ số bài viết theo ngày
    const postsByDate = useMemo(() => {
        const dateCount = {};
        filteredData.forEach(post => {
            const date = new Date(post.createAt).toLocaleDateString('vi-VN');
            dateCount[date] = (dateCount[date] || 0) + 1;
        });
        
        return Object.entries(dateCount)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => {
                const dateA = a.date.split('/').reverse().join('-');
                const dateB = b.date.split('/').reverse().join('-');
                return new Date(dateA) - new Date(dateB);
            })
            .slice(-30); // Lấy 30 ngày gần nhất
    }, [filteredData]);

    const StatCard = ({ icon: Icon, title, value, growth, color }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">{title}</p>
                        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
                    </div>
                </div>
                {growth !== null && timeFilter !== 'all' && (
                    <div className={`flex items-center space-x-1 ${parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(growth) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm font-semibold">{Math.abs(growth)}%</span>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">Data Analytics</h1>
                    
                    {/* Bộ lọc thời gian */}
                    <div className="flex gap-2">
                        {[
                            { value: 'all', label: 'All' },
                            { value: '24h', label: '24 Hours' },
                            { value: '7d', label: '7 Days' },
                            { value: '30d', label: '30 Days' }
                        ].map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setTimeFilter(filter.value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    timeFilter === filter.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Thống kê tổng quan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={FileText}
                        title="Total Posts"
                        value={stats.totalPosts}
                        growth={stats.postsGrowth}
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={Eye}
                        title="Total Views"
                        value={stats.totalViews}
                        growth={stats.viewsGrowth}
                        color="bg-green-500"
                    />
                    <StatCard
                        icon={Heart}
                        title="Total Likes"
                        value={stats.totalLikes}
                        growth={stats.likesGrowth}
                        color="bg-red-500"
                    />
                    <StatCard
                        icon={MessageCircle}
                        title="Total Comments"
                        value={stats.totalComments}
                        growth={stats.commentsGrowth}
                        color="bg-purple-500"
                    />
                </div>

                {/* Biểu đồ tròn */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Biểu đồ Category */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Breakdown by Category</h2>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-gray-500 py-12">No data available</p>
                        )}
                    </div>

                    {/* Biểu đồ Tags */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Breakdown by Tags</h2>
                        {tagData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={tagData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {tagData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-gray-500 py-12">No data available</p>
                        )}
                    </div>
                </div>

                {/* Biểu đồ số bài viết theo ngày */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Posts per Day</h2>
                    {postsByDate.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={postsByDate}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Số bài viết" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-12">No data available</p>
                    )}
                </div>

                {/* Top 5 bài viết nhiều like nhất */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Top 5 Most Liked Posts</h2>
                    {topPosts.length > 0 ? (
                        <div className="space-y-4">
                            {topPosts.map((post, index) => (
                                <div key={post._id} onClick={() => navigate(`/posts/${post._id}`)} className="flex hover:cursor-pointer items-center space-x-4 p-4 border border-white bg-gray-100  rounded-xl transition-colors">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    {post.thumbnail && (
                                        <img src={post.thumbnail} alt={post.title} className="w-16 h-16 object-cover rounded" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate">{post.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(post.createAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center space-x-1">
                                            <AiOutlineLike className="w-4 h-4 text-red-500" />
                                            <span className="font-semibold">{post.likeCount || 0}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-4 h-4 text-blue-500" />
                                            <span>{post.view || 0}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <MessageCircle className="w-4 h-4 text-green-500" />
                                            <span>{post.comments?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-12">No posts available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;