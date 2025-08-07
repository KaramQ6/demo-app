import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Calendar, Eye, Shield, ShieldOff, MoreVertical } from 'lucide-react';
import { getAdminUsers } from '../../api/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await getAdminUsers();
            setUsers(response.users);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'suspended':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getLevelColor = (level) => {
        switch (level.toLowerCase()) {
            case 'explorer':
                return 'bg-blue-100 text-blue-800';
            case 'expert':
                return 'bg-purple-100 text-purple-800';
            case 'adventurer':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleUserAction = async (userId, action) => {
        try {
            console.log(`${action} user:`, userId);

            // Update user status locally (in real app, this would call API)
            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, status: action === 'suspend' ? 'suspended' : action === 'activate' ? 'active' : user.status }
                    : user
            ));

            setShowActionMenu(null);
        } catch (error) {
            console.error(`Failed to ${action} user:`, error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                    <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total: {users.length} users
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Shield className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-gray-500" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                            <div className="text-sm text-gray-900">{formatDate(user.joinDate)}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm text-gray-900">{user.tripsCount} trips</div>
                                            <div className="text-sm text-gray-500">${user.totalSpent} spent</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                                            {user.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                                            {user.status === 'active' ? <Shield className="w-3 h-3 mr-1" /> : <ShieldOff className="w-3 h-3 mr-1" />}
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowDetails(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Action Menu */}
                                        {showActionMenu === user.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleUserAction(user.id, 'view')}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        View Profile
                                                    </button>
                                                    {user.status === 'active' ? (
                                                        <button
                                                            onClick={() => handleUserAction(user.id, 'suspend')}
                                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                        >
                                                            Suspend User
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUserAction(user.id, 'activate')}
                                                            className="block px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-left"
                                                        >
                                                            Activate User
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleUserAction(user.id, 'reset_password')}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        Reset Password
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No users found matching your criteria.
                </div>
            )}

            {/* User Details Modal */}
            {showDetails && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">User Details</h3>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* User Profile */}
                                <div className="flex items-center space-x-4">
                                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="w-8 h-8 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h4>
                                        <p className="text-gray-600">{selectedUser.email}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedUser.status)}`}>
                                            {selectedUser.status === 'active' ? <Shield className="w-3 h-3 mr-1" /> : <ShieldOff className="w-3 h-3 mr-1" />}
                                            {selectedUser.status}
                                        </span>
                                    </div>
                                </div>

                                {/* User Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{selectedUser.tripsCount}</div>
                                        <div className="text-sm text-gray-600">Total Trips</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">${selectedUser.totalSpent}</div>
                                        <div className="text-sm text-gray-600">Total Spent</div>
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div className="space-y-4">
                                    <h5 className="text-lg font-semibold text-gray-800">Account Information</h5>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">User ID</label>
                                            <div className="text-gray-900 font-mono">{selectedUser.id}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Level</label>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(selectedUser.level)}`}>
                                                {selectedUser.level}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Registration Date</label>
                                        <div className="text-gray-900">{formatDate(selectedUser.joinDate)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        // Handle edit user action
                                        console.log('Edit user:', selectedUser.id);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close action menu */}
            {showActionMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowActionMenu(null)}
                />
            )}
        </div>
    );
};

export default ManageUsers;
