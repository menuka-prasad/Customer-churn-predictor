import { CustomerData, PredictionResponse } from "@/types/customer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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