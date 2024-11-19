import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Update this URL to match your backend's base URL
export const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/users/${userId}/change-password`,
            null, // No body needed as we're using query parameters
            {
                params: {
                    oldPassword,
                    newPassword,
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error.response?.data || error.message);
        throw error;
    }
};

export const changeUsername = async (userId, newUsername) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/users/${userId}/change-username`,
            null,
            {
                params: {
                    newUsername,
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing username:', error.response?.data || error.message);
        throw error;
    }
};

export const changeEmail = async (userId, newEmail) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/users/${userId}/change-email`,
            null,
            {
                params: {
                    newEmail,
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing email:', error.response?.data || error.message);
        throw error;
    }
};

export const changeFirstName = async (profileId, firstName) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/profiles/${profileId}/update-firstname`,
            null,
            {
                params: {
                    firstName,
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing first name:', error.response?.data || error.message);
        throw error;
    }
};

export const changeLastName = async (profileId, lastName) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/profiles/${profileId}/update-lastname`,
            null,
            {
                params: {
                    lastName,
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing last name:', error.response?.data || error.message);
        throw error;
    }
};

export const changeTag = async (profileId, tag) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/profiles/${profileId}/change-tag`,
            null,
            {
                params: {
                    tag,
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing last name:', error.response?.data || error.message);
        throw error;
    }
};




// Деактивация пользователя
export const deactivateUser = async (userId: number): Promise<void> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${userId}/deactivate`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            }
            );
        console.log("User deactivated:", response.data);
    } catch (error: any) {
        console.error("Error deactivating user:", error.response?.data || error.message);
        throw error;
    }
};

// Восстановление пользователя
export const restoreUser = async (userId: number): Promise<void> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${userId}/restore`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
        console.log("User restored:", response.data);
    } catch (error: any) {
        console.error("Error restoring user:", error.response?.data || error.message);
        throw error;
    }
};
