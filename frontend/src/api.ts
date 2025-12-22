import type { WordData } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchWord(length: number): Promise<WordData> {
    const response = await fetch(`${API_BASE_URL}/word?length=${length}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch word');
    }

    return response.json();
}
