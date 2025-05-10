import { getAuthHeaders, handleApiError } from "../utils/apiUtils";
import { config } from "../utils/config";

const API_BASE_URL = config.API_BASE_URL

// Get all employees service
async function getAllEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/manager/employees`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if(!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error('Error fetching employees: ' + error.message)
    }
}

// Get all employees DETAILED service
async function getAllEmployeesWithDetails() {
    try {
        const response = await fetch(`${API_BASE_URL}/manager/detailedEmployees`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if(!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error('Error fetching employees: ' + error.message)
    }
}

// Add employee service
async function addEmployee(employee) {
    try {
        const response = await fetch(`${API_BASE_URL}/manager/addEmployee`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(employee),
        })

        if(response.status !== 201) {
            const error = await handleApiError(response);
            console.log("ENTERED ERROR")
            throw error;
        }

        const feedback = await response.json();
        return feedback;

    } catch (error) {
        throw new Error('Error adding employee: ' + error.message)
    }
}

// Delete employee service
async function deleteEmployee(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/manager/deleteEmployee/${employeeId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if(!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const feedback = await response.json();
        return feedback;

    } catch (error) {
        throw new Error('Error deleting employee: ' + error.message)
    }
}

// Edit employee service
async function editEmployee(employeeId, employee) {
    try {
        const response = await fetch(`${API_BASE_URL}/manager/updateEmployee/${employeeId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(employee),
        })

        if(!response.ok) {
            const error = await handleApiError(response);
            throw error;
        }

        const feedback = await response.json();
        return feedback;
    } catch (error) {
        throw new Error('Error editing employee: ' + error.message)
    }
}

export default {
    getAllEmployees,
    getAllEmployeesWithDetails,
    addEmployee,
    deleteEmployee,
    editEmployee
}