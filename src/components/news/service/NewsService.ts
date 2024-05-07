import {PostData} from "../../messages/Types";

export async function fetchNewsFeed(userId: number, token: string): Promise<PostData[]> {

    try {

        const response = await fetch(`http://localhost:8080/api/posts/feed?userId=${userId}`, {
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