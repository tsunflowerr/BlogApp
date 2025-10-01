import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FollowListModal = ({ isOpen, onClose, users, title, currentUserId }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    const handleUserClick = (userId) => {
        onClose();
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center backdrop-blur-sm justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-4">
                    {users && users.length > 0 ? (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserClick(user._id)}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                                >
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`}
                                        alt={user.username}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{user.username}</p>
                                        {user.bio && (
                                            <p className="text-sm text-gray-500 truncate">{user.bio}</p>
                                        )}
                                    </div>
                                    {user._id === currentUserId && (
                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                                            You
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-lg font-medium">No {title.toLowerCase()} yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;