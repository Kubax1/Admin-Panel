import api from '../../api/axios.js';

export const getUsers = async () => {
    try {
        const response = await api.get('/api/users');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/api/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

export const addUser = async (user) => {
    try {
        const response = await api.post('/api/users', user);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error.response?.data ?? error.message);
    }
}

export const updateUser = async (id, user) => {
    try {
        const response = await api.put(`/api/users/${id}`, user);
        return response.data;   
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

export const countUsers = async () => {
    try {
        const response = await api.get('/api/users');
        return response.data.length;
    } catch (error) {
        console.error('Error counting users:', error);
    }
}

export const countUsersByMonth = async () => {
    try {
        const response = await api.get('/api/users/dashboard');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error counting users by month:', error);
    }
}

export const login = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error.response?.data ?? error.message);
    }
}

export const logout = async () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
