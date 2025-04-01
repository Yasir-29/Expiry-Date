const API_BASE_URL = 'http://localhost:5000/api';

export const fetchReminders = async () => {
    const response = await fetch(`${API_BASE_URL}/reminders`);
    if (!response.ok) {
        throw new Error('Failed to fetch reminders');
    }
    return response.json();
};

export const createReminder = async (reminderData) => {
    const response = await fetch(`${API_BASE_URL}/reminders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminderData),
    });
    if (!response.ok) {
        throw new Error('Failed to create reminder');
    }
    return response.json();
};

export const updateReminder = async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) {
        throw new Error('Failed to update reminder');
    }
    return response.json();
};

export const deleteReminder = async (id) => {
    const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete reminder');
    }
    return response.json();
};

export const fetchUpcomingReminders = async () => {
    const response = await fetch(`${API_BASE_URL}/reminders/upcoming`);
    if (!response.ok) {
        throw new Error('Failed to fetch upcoming reminders');
    }
    return response.json();
};

export const fetchProductByBarcode = async (barcode) => {
    const response = await fetch(`${API_BASE_URL}/reminders/barcode/${barcode}`);
    if (response.status === 404) {
        return { exists: false, product: null };
    }
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    return response.json();
}; 