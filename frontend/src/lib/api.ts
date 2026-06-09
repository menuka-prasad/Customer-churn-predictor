import { CustomerData, PredictionResponse } from "@/types/customer";

// If NEXT_PUBLIC_API_URL is set, use it. Otherwise, assume we are on HF Spaces and use /api.
// During local dev (if not explicitly set), this might fail unless backend proxy is set up or NEXT_PUBLIC_API_URL is set in .env
// We can check if we are in development and default to localhost:8000/api
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '/api');

export async function predictCustomerChurn(data: CustomerData): Promise<PredictionResponse> {
    const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Api Error: ${response.status} - ${await response.text()}`);
    
    }

    return response.json();
}

export async function getExplanation(data: CustomerData): Promise<any> {
    const response = await fetch(`${API_URL}/explain`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Api Error: ${response.status} - ${await response.text()}`);
    }

    return response.json();
}