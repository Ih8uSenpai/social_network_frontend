import {PostData} from "../../utils/Types";

export async function fetchNewsFeed(userId: number, token: string): Promise<PostData[]> {

    try {

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/feed?userId=${userId}`, {
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