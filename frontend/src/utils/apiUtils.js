export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
};

export const getOnlyAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const getKioskAuthHeaders = () => {
    const token = localStorage.getItem('kioskToken');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
}

export const getOnlyKioskAuthHeaders = () => {
    const token = localStorage.getItem('kioskToken');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
}

/**
 * Handles API errors consistently across all requests
 * @param {Response} response - The fetch Response object
 * @returns {Promise<Error>} A custom error with status and message
 */
export const handleApiError = async (response) => {
    let errorMessage;

    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Error: ${response.status}`;
    } catch (e) {
        errorMessage = `Request failed with status: ${response.status}`;
    }

    const error = new Error(errorMessage);
    error.status = response.status;

    // Handle specific error codes
    if (response.status === 403) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('auth:logout'));
        window.location.href = '/login'; // Redirect to login page
    }

    return error;
};

export const handleApiKioskError = async (response) => {
    let errorMessage;

    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Error: ${response.status}`;
    } catch (e) {
        errorMessage = `Request failed with status: ${response.status}`;
    }

    const error = new Error(errorMessage);
    error.status = response.status;

    // Handle specific error codes
    if (response.status === 403) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/camera';
    }

    return error;
};

export default {
    getAuthHeaders,
    handleApiError,
};