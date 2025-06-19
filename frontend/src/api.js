// helper 
const API_URL = 'http://localhost:5000/api';

export async function post(path, data, auth = false){
    const headers = {
        'Content-Type': 'application/json',
    };

    if(auth){
        const token = localStorage.getItem('token');
        if(token)  headers.Authorization = `Bearer ${token}`;
    }


    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    return res.json();
}
