const API_URL = 'http://localhost:5000/api';

/**
 * Helper function to send POST requests to the backend API.
 */
export async function post(path, data, auth = false) {
    console.log('🚀 Making API call to:', `${API_URL}${path}`);
    console.log('📤 Sending data:', data);
    
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (auth) {
        const token = localStorage.getItem('token');
        if (token) headers.Authorization = `Bearer ${token}`;
    }
    
    try {
        const res = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        
        console.log('📥 Response status:', res.status);
        console.log('📥 Response ok:', res.ok);
        
        const responseData = await res.json();
        console.log('📥 Response data:', responseData);
        
        // If response is not ok, throw an error with the message
        if (!res.ok) {
            throw new Error(responseData.message || `HTTP error! status: ${res.status}`);
        }
        
        return responseData;
    } catch (error) {
        console.error('❌ API Error:', error);
        
        // Handle network errors specifically
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
        }
        
        throw error;
    }
}

/**
 * Helper function to send GET requests to the backend API.
 */
export async function get(path, auth = false) {
    console.log('🚀 Making GET request to:', `${API_URL}${path}`);
    
    const headers = {};
    
    if (auth) {
        const token = localStorage.getItem('token');
        if (token) headers.Authorization = `Bearer ${token}`;
    }
    
    try {
        const res = await fetch(`${API_URL}${path}`, {
            method: 'GET',
            headers,
        });
        
        console.log('📥 GET Response status:', res.status);
        
        const responseData = await res.json();
        console.log('📥 GET Response data:', responseData);
        
        if (!res.ok) {
            throw new Error(responseData.message || `HTTP error! status: ${res.status}`);
        }
        
        return responseData;
    } catch (error) {
        console.error('❌ GET API Error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
        }
        
        throw error;
    }
}

// Export API_URL for direct use if needed
export { API_URL };
