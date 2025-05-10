import { getKioskAuthHeaders, getOnlyKioskAuthHeaders, handleApiKioskError } from '../utils/apiUtils.js';
import { config } from '../utils/config.js';

const API_BASE_URL = config.API_BASE_URL;

// Authenticate kiosk
async function authenticateKiosk(codeObject) {
    try {
        const response = await fetch(`${API_BASE_URL}/kiosk/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(codeObject),
        });

        if (!response.ok) {
            throw await handleApiKioskError(response);
        }

        const data = await response.json();
        localStorage.setItem('kioskToken', data.token);
        return data;

    } catch (error) {
        throw error;
    }
}

// Setup the mark attendance page
async function setupMarkAttendancePage() {
    try {
        const response = await fetch(`${API_BASE_URL}/kiosk/setup`, {
            method: 'GET',
            headers: getKioskAuthHeaders(),
        });

        if (!response.ok) {
            throw await handleApiKioskError(response);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
}

// Mark the attendance with face
async function markAttendanceFace(formdata) {
    try {
        const response = await fetch(`${API_BASE_URL}/kiosk/verifyFace`, {
            method: "POST",
            headers: getOnlyKioskAuthHeaders(),
            body: formdata,
        });

        if (!response.ok) {
            const error = await handleApiKioskError(response);
            console.log("Error in Verifying Face:", error);
            throw error;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Error verifying face: " + error.message);
    }
}

export default {
    authenticateKiosk,
    setupMarkAttendancePage,
    markAttendanceFace,
}
