import { getAuthHeaders, handleApiError } from "../utils/apiUtils";
import {config} from '../utils/config'

const API_BASE_URL = config.API_BASE_URL

// Get employee attendance at date
async function getAttendanceOfEmployee(employeeId, date) {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    try {
        const response = await fetch(`${API_BASE_URL}/presence/employee/${employeeId}?date=${formattedDate}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok && response.status !== 204) {
            const error = await handleApiError(response);
            throw error;
        }

        if (response.status === 204) {
            return null;
        }
        const data = await response.json();
        return data;
    
    } catch (error) {
        throw new Error('Error fetching attendance stats: ' + error.message)
    }
}

// Get all employees attendance records service
async function getAttendanceRecords(date) {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    try {
        const response = await fetch(`${API_BASE_URL}/presence/employees?date=${formattedDate}`, {
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
        throw new Error('Error fetching attendance stats: ' + error.message)
    }
}

// Update employee attendance record at date
async function updateAttendanceStatus(employeeId, date, status) {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const presenceStatus = status.toUpperCase()
    try {
        const response = await fetch(`${API_BASE_URL}/presence/updatePresence/${employeeId}?date=${formattedDate}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ presenceStatus }),
        })

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        return data;
    
    } catch (error) {
        throw new Error('Error updating attendance record: ' + error.message)
    }
}

export default {
    getAttendanceRecords,
    updateAttendanceStatus,
    getAttendanceOfEmployee
}