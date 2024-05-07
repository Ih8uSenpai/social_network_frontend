export const logout = async (token: String) => {
    try {
        const response = await fetch('http://localhost:8080/api/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(""),
        });

        if (!response.ok) {
            throw new Error('Failed to logout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};