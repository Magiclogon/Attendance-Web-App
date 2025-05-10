import { config } from "../utils/config";
import { getAuthHeaders, handleApiError } from "../utils/apiUtils";

const API_BASE_URL = config.API_BASE_URL

async function login(userObject) {

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userObject),
        })

        if (!response.ok) {
            const {message, success} = await response.json()
            throw new Error(message || "Login failed")
        }

        const data = await response.json()
        localStorage.setItem("token", data.token)
        localStorage.setItem("role", data.role)
        return {
            token: data.token,
            role: data.role,
            hasRegisteredFace: data.hasRegisteredFace,
        }

    } catch (error) {
        throw error
    }
}

// Registering function service
async function register(userObject) {

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userObject)
        })

        if(!response.status !== 201) {
            const { message, success } = await response.json()
            return { message, success }
        }

        const data = await response.json()
        return data

    } catch (error) {
        throw error
    }
}

// Changing user details
async function changeUserDetails(userObject) {
    try {
        const response = await fetch(`${API_BASE_URL}/changeCreds/changeUserDetails`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(userObject)
        })

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        localStorage.setItem("token", data.token)
        return data;
    } catch (error) {
        throw new Error('Error changing manager details: ' + error.message)
    }
}

// Changing password
async function changePassword(passwordObject) {
    try {
        const response = await fetch(`${API_BASE_URL}/changeCreds/changePassword`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(passwordObject)
        })

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const feedback = await response.json();
        return feedback;
    } catch (error) {
        throw new Error('Error changing password: ' + error.message)
    }
}   

export default {
    login,
    register,
    changeUserDetails,
    changePassword
}