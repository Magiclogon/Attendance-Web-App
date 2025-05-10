import { getOnlyAuthHeaders, handleApiError, getAuthHeaders } from "../utils/apiUtils";
import { config } from "../utils/config";

const API_BASE_URL = config.API_BASE_URL;

// Get Employee SELF Information
async function getEmployeeInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/employeeSelf/details`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Error fetching employee info: " + error.message);
    }
}



// Get Employee SELF Schedule at date
async function getScheduleOfEmployee(date) {
    const formattedDate = new Date(date).toISOString().split('T')[0];

    try {
        const response = await fetch(`${API_BASE_URL}/employeeSelf/schedule?date=${formattedDate}`, {
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

// Get Employee SELF Attendance at date
async function getAttendanceOfEmployee(date) {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    try {
        const response = await fetch(`${API_BASE_URL}/employeeSelf/presence?date=${formattedDate}`, {
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
        throw new Error('Error fetching attendances: ' + error.message)
    }
}

// Register Face
async function registerFace(formdata) {
    try {
        const response = await fetch(`${API_BASE_URL}/employeeSelf/registerFace`, {
            method: "POST",
            headers: getOnlyAuthHeaders(),
            body: formdata,
        });

        if (!response.ok) {
            const error = await handleApiError(response);
            console.log("Error in registerFace:", error);
            throw error;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Error registering face: " + error.message);
    }
}



export default {
    getEmployeeInfo,
    registerFace,
    getAttendanceOfEmployee,
    getScheduleOfEmployee
};