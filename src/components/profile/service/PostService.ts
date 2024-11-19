import {PostData} from "../../utils/Types";
import axios from "../../../config/axiosConfig";

export async function fetchPosts(profileId: number, token: string): Promise<PostData[]> {

    try {

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profiles/${profileId}/posts`, {
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
        posts.map(post => {
            post.postTracks.map(track => {
                track.url = `${process.env.REACT_APP_BACK_BASE_URL}/` + track.url;
                if (track.icon_url)
                    track.icon_url = `${process.env.REACT_APP_BACK_BASE_URL}/` + track.icon_url;
            });
        });
        return posts;
    } catch (error) {
        console.error('fetchPosts error:', error);
        throw error;
    }
}

export async function fetchLikedPosts(token: string): Promise<PostData[]> {
    try {
        const response = await axios.get<PostData[]>(`${process.env.REACT_APP_API_BASE_URL}/posts/liked`, {
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
        const response = await axios.get<PostData[]>(`${process.env.REACT_APP_API_BASE_URL}/posts/recommendations`, {
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