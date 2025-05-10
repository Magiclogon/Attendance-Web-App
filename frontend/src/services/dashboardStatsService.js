import { getAuthHeaders, handleApiError } from "../utils/apiUtils";
import { config } from "../utils/config";

const API_BASE_URL = config.API_BASE_URL

// Get manager dashboard
async function getDashboardTopStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/manager/dashboard/getDashboardTopStats`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error('Error fetching dashboard top stats: ' + error.message)
    }
}

// Get employee dashboard
async function getEmployeeDashboardInformation() {
    try {
        const response = await fetch(`${API_BASE_URL}/employeeSelf/getDashboard`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error('Error fetching employee dashboard information: ' + error.message)
    }
}

export default {
    getDashboardTopStats,
    getEmployeeDashboardInformation
}