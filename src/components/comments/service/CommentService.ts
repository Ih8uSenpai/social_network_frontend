import {PostComment} from "../CommentInput";

export async function fetchComments(postId: number, token: string): Promise<PostComment[]> {

    try {

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching comments: ${response.statusText}`);
        }

        const comments: PostComment[] = await response.json();
        return comments;
    } catch (error) {
        console.error('fetchComments error:', error);
        throw error;
    }
}