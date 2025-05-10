import { getAuthHeaders, handleApiError } from '../utils/apiUtils';
import {config} from '../utils/config'

const API_BASE_URL = config.API_BASE_URL

// Get Company and Manager Information
async function getCompanyAndManagerInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/manager/managerAndEntrepriseDetails`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching company and manager info: ' + error.message);
    }
}

// Update Company Information
async function updateCompanyInfo(companyObject) {
    try {
        const response = await fetch(`${API_BASE_URL}/manager/updateEntreprise`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(companyObject),
        });

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error('Error updating company info: ' + error.message);
    }
}

// Update Manager Settings
async function updateManagerSettings(managerObject) {
    try {
        const response = await fetch(`${API_BASE_URL}/manager/updateSettings`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(managerObject),
        });

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error('Error updating manager settings: ' + error.message);
    }
}

export default {
    getCompanyAndManagerInfo,
    updateCompanyInfo,
    updateManagerSettings,
}