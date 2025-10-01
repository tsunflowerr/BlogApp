import React, { useCallback, useEffect, useState } from "react";
import { X, AlignLeft, Flag, Calendar, CheckCircle, Plus, Tag } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const DEFAULT_POST = {
    _id: null,
    title: "",
    content: "",
    category: [],
    tags: [],
    thumbnail: "",
}

const api_url = "http://localhost:4000"

const PostModal = ({ isOpen, onClose, postToEdit, onSave, user }) => {
    const [postData, setPostData] = useState(DEFAULT_POST)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const [availableCategories, setAvailableCategories] = useState([])
    const [availableTags, setAvailableTags] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
    const [showTagDropdown, setShowTagDropdown] = useState(false)
    const [tagInput, setTagInput] = useState("")
    const [categoryInput, setCategoryInput] = useState("")

    const getToken = useCallback(() => {
        if (user?.token) return user.token;
        return localStorage.getItem('token');
    }, [user])

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = ''
            return 
        }
        document.body.style.overflow = 'hidden'
        const fetchCategoriesAndTags = async () => {
            try {
                const token = getToken()
                if (!token) {
                    setError("No authentication token found")
                    return
                }

                const headers = {
                    'Authorization': `Bearer ${token}`
                }

                // Fetch categories
                const catRes = await fetch(`${api_url}/api/categories`, { 
                    method: 'GET',
                    headers 
                })
                
                if (catRes.ok) {
                    const data = await catRes.json()
                    setAvailableCategories(data.categories || data || [])
                }

                // Fetch tags
                const tagRes = await fetch(`${api_url}/api/tags`, { 
                    method: 'GET',
                    headers 
                })
                
                if (tagRes.ok) {
                    const data = await tagRes.json()
                    setAvailableTags(data.tags || data || [])
                }
            } catch (err) {
                console.error("Error fetching categories/tags:", err)
                setError("Failed to load categories and tags")
            }
        }
        
        fetchCategoriesAndTags()

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen, getToken])

    // Setup data khi edit post
    useEffect(() => {
        if (!isOpen) return
        
        if (postToEdit) {
            setPostData({
                _id: postToEdit._id,
                title: postToEdit.title || '',
                content: postToEdit.content || '',
                tags: postToEdit.tags || [], 
                category: postToEdit.category || [],
                thumbnail: postToEdit.thumbnail || '',
            })

            // Handle categories
            if (postToEdit.category && postToEdit.category.length > 0) {
                if (typeof postToEdit.category[0] === 'object' && postToEdit.category[0]._id) {
                    setSelectedCategories(postToEdit.category)
                } else {
                    const cats = availableCategories.filter(c => 
                        postToEdit.category.includes(c._id)
                    )
                    setSelectedCategories(cats)
                }
            }

            // Handle tags
            if (postToEdit.tags && postToEdit.tags.length > 0) {
                if (typeof postToEdit.tags[0] === 'object' && postToEdit.tags[0]._id) {
                    setSelectedTags(postToEdit.tags)
                } else {
                    const tags = availableTags.filter(t => 
                        postToEdit.tags.includes(t._id)
                    )
                    setSelectedTags(tags)
                }
            }
        } else {
            setPostData(DEFAULT_POST)
            setSelectedCategories([])
            setSelectedTags([])
        }
        setError(null)
    }, [isOpen, postToEdit, availableCategories, availableTags])

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setPostData(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleQuillChange = (value) => {
        setPostData({ ...postData, content: value });
    };

    const getHeaders = useCallback(() => {
        const token = getToken()
        if (!token) throw new Error('No authentication token found')
        return {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`,
        }
    }, [getToken])

    // Xử lý chọn category
    const handleSelectCategory = (category) => {
        if (!selectedCategories.find(c => c._id === category._id)) {
            setSelectedCategories(prev => [...prev, category])
        }
        setCategoryInput("")
        setShowCategoryDropdown(false)
    }

    // Xử lý xóa category
    const handleRemoveCategory = (categoryId) => {
        setSelectedCategories(prev => prev.filter(c => c._id !== categoryId))
    }

    // Xử lý chọn tag
    const handleSelectTag = (tag) => {
        if (!selectedTags.find(t => t._id === tag._id)) {
            setSelectedTags(prev => [...prev, tag])
        }
        setTagInput("")
        setShowTagDropdown(false)
    }

    // Xử lý xóa tag
    const handleRemoveTag = (tagId) => {
        setSelectedTags(prev => prev.filter(t => t._id !== tagId))
    }

    // Tạo tag mới
    const handleCreateTag = async () => {
        if (!tagInput.trim()) return

        try {
            const name = tagInput.trim();
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const res = await fetch(`${api_url}/api/tags`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ name, slug})
            })

            if (res.ok) {
                const data = await res.json()
                const newTag = data.tag || data
                setAvailableTags(prev => [...prev, newTag])
                handleSelectTag(newTag)
            } else {
                const errorData = await res.json()
                setError(errorData.message || "Failed to create tag")
            }
        } catch (err) {
            console.error("Error creating tag:", err)
            setError("Failed to create tag")
        }
    }

    const handleSubmit = async () => {
        if (!postData.title || !postData.content) {
            setError("Title and content are required")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const token = getToken()
            if (!token) {
                throw new Error("No authentication token found. Please login again.")
            }

            const isEdit = Boolean(postData?._id)
            const url = isEdit 
                ? `${api_url}/api/posts/${postData._id}` 
                : `${api_url}/api/posts`
            
            // Prepare data - ensure we're sending arrays of IDs
            const dataToSend = {
                title: postData.title,
                content: postData.content,
                category: selectedCategories.map(c => c._id),
                tags: selectedTags.map(t => t._id),
                thumbnail: postData.thumbnail || ""
            }

            const res = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            })
            
            const responseData = await res.json()
            
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Authentication failed. Please login again.")
                }
                throw new Error(responseData.message || responseData.error || "Failed to save post")
            }
            
            // Call onSave callback with the saved post
            const savedPost = responseData.posts || responseData.post || responseData
            if (onSave) {
                try {
                await Promise.resolve(onSave(savedPost));
                } catch (err) {
                console.warn("onSave callback error:", err);
                }
            }
            // Reset form and close modal
            setPostData(DEFAULT_POST)
            setSelectedCategories([])
            setSelectedTags([])
            onClose()
            
        } catch (err) {
            console.error("Submit error:", err)
            setError(err.message || "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    // Filter categories và tags theo input
    const filteredCategories = availableCategories.filter(cat =>
        cat.name?.toLowerCase().includes(categoryInput.toLowerCase()) &&
        !selectedCategories.find(sc => sc._id === cat._id)
    )

    const filteredTags = availableTags.filter(tag =>
        tag.name?.toLowerCase().includes(tagInput.toLowerCase()) &&
        !selectedTags.find(st => st._id === tag._id)
    )

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-purple-100 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg relative p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-sans font-bold text-gray-800">
                        {!postData._id ? "Create Post" : "Update Post"}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={(e)=>{e.preventDefault();handleSubmit()}} className="space-y-4" >
                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Title Input */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Post Title
                        </label>
                        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                            <input 
                                type="text" 
                                name="title" 
                                required 
                                value={postData.title} 
                                onChange={handleChange}
                                className="w-full focus:outline-none text-sm" 
                                placeholder="Enter post title"
                            />
                        </div>
                    </div>

                    {/* Content Textarea */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-2">
                            <AlignLeft className="w-5 h-5 text-blue-500" /> Content
                        </label>
                        <ReactQuill 
                            theme="snow" 
                            name="content" 
                            rows="5" 
                            onChange={handleQuillChange} 
                            value={postData.content}
                            className="w-full px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Add your content here"
                        />
                    </div>

                    {/* Categories Section */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-2">
                            <Flag className="w-5 h-5 text-green-500" /> Categories
                        </label>
                        
                        {/* Selected Categories */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedCategories.map(category => (
                                <span 
                                    key={category._id} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                    {category.name}
                                    <button type="button" onClick={() => handleRemoveCategory(category._id)} className="hover:bg-green-200 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative">
                            <input
                                type="text"
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                onFocus={() => setShowCategoryDropdown(true)}
                                placeholder="Search or select categories..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            
                            {showCategoryDropdown && filteredCategories.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredCategories.map(category => (
                                        <button
                                            key={category._id}
                                            type="button"
                                            onClick={() => handleSelectCategory(category)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-2">
                            <Tag className="w-5 h-5 text-purple-500" /> Tags
                        </label>
                        
                        {/* Selected Tags */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedTags.map(tag => (
                                <span 
                                    key={tag._id}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                >
                                    #{tag.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag._id)}
                                        className="hover:bg-purple-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Tag Dropdown */}
                        <div className="relative">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onFocus={() => setShowTagDropdown(true)}
                                    placeholder="Search or create tags..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                                {tagInput && !filteredTags.find(t => t.name === tagInput) && (
                                    <button
                                        type="button"
                                        onClick={handleCreateTag}
                                        className="px-4 py-2 bg-purple-500 hover:cursor-pointer text-white rounded-lg hover:bg-purple-600 text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Create
                                    </button>
                                )}
                            </div>
                            
                            {showTagDropdown && filteredTags.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredTags.map(tag => (
                                        <button
                                            key={tag._id}
                                            type="button"
                                            onClick={() => handleSelectTag(tag)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                        >
                                            #{tag.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thumbnail URL */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Thumbnail URL
                        </label>
                        <input 
                            type="text"
                            name="thumbnail"
                            value={postData.thumbnail}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter thumbnail URL (optional)"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !postData.title || !postData.content}
                            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    {postData._id ? 'Update' : 'Create'} Post
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Click outside to close dropdowns */}
                {(showCategoryDropdown || showTagDropdown) && (
                    <div 
                        className="fixed inset-0 z-0" 
                        onClick={() => {
                            setShowCategoryDropdown(false)
                            setShowTagDropdown(false)
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default PostModal