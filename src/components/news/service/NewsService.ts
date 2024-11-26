import {PostData} from "../../utils/Types";
import axios from "../../../config/axiosConfig";

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

export const markPostAsViewed = async (post: PostData, viewType: string) => {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) {
        console.error('Пользователь не идентифицирован');
        return;
    }

    try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/posts/mark-viewed`, {
            postId: post.id,
            userId: userId,
            viewType: viewType
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        console.log(`Post marked as viewed with type: ${viewType}`);
    } catch (error) {
        console.error('Error marking post as viewed:', error);
    }
};