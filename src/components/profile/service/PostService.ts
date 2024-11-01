import {PostData} from "../../utils/Types";
import axios from "axios";

export async function fetchPosts(profileId: number, token: string): Promise<PostData[]> {

    try {

        const response = await fetch(`http://localhost:8080/api/profiles/${profileId}/posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching posts: ${response.statusText}`);
        }

        const posts: PostData[] = await response.json();
        return posts;
    } catch (error) {
        console.error('fetchPosts error:', error);
        throw error;
    }
}

export async function fetchLikedPosts(token: string): Promise<PostData[]> {
    try {
        const response = await axios.get<PostData[]>('http://localhost:8080/api/posts/liked', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data; // axios автоматически преобразует JSON в объект
    } catch (error) {
        console.error('fetchLikedPosts error:', error);
        throw error;
    }
}

export async function fetchRecommendedPosts(token: string): Promise<PostData[]> {
    try {
        const response = await axios.get<PostData[]>('http://localhost:8080/api/posts/recommendations', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data; // axios автоматически преобразует JSON в объект
    } catch (error) {
        console.error('fetchRecommendedPosts error:', error);
        throw error;
    }
}