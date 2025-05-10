import { getAuthHeaders, handleApiError } from '../utils/apiUtils';
import {config} from '../utils/config'

const API_BASE_URL = config.API_BASE_URL

async function getScheduleOfEmployee(employeeId, date) {
    const formattedDate = new Date(date).toISOString().split('T')[0];

    try {
        const response = await fetch(`${API_BASE_URL}/schedule/showSchedule/${employeeId}?date=${formattedDate}`, {
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
    }
    catch (error) {
        throw new Error('Error fetching schedule: ' + error.message)
    }
}


async function getScheduleOfAllEmployees(date) {
    const formattedDate = new Date(date).toISOString().split('T')[0];

    try {
        const response = await fetch(`${API_BASE_URL}/schedule/showAllSchedules?date=${formattedDate}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }
        
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error('Error fetching schedule: ' + error.message)
    }
}

async function addScheduleToEmployees(scheduleObject) {
    try {
        const response = await fetch(`${API_BASE_URL}/schedule/addSchedule`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(scheduleObject),
    })

    if (response.status !== 201) {
        const error = await handleApiError(response);
        throw error;
    }

    const feedback = await response.json();
    return feedback;
    }
    catch (error) {
        throw new Error('Error adding schedule: ' + error.message)
    }
}

export default {
    getScheduleOfAllEmployees,
    addScheduleToEmployees,
    getScheduleOfEmployee
}