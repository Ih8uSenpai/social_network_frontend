import {PostData} from "../../utils/Types";
import axios from "../../../config/axiosConfig";

export async function countPostsPerPeriod  (profileId: number, fromDate, toDate, token: String): Promise<number> {
    const formData = new FormData();
    formData.append('profileId', profileId.toString());
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);

    try {
        const response = await axios.post('http://localhost:8080/api/statistics/postsPerPeriod', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error: statistics, fetching posts count failed', error);
        return;
    }

}

export async function countLikesPerPeriod  (profileId: number, fromDate, toDate, token: String): Promise<number> {
    const formData = new FormData();
    formData.append('profileId', profileId.toString());
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);

    try {
        const response = await axios.post('http://localhost:8080/api/statistics/likesPerPeriod', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error: statistics, fetching likes count failed', error);
        return;
    }

}

export async function countCommentsPerPeriod  (profileId: number, fromDate, toDate, token: String): Promise<number> {
    const formData = new FormData();
    formData.append('profileId', profileId.toString());
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);

    try {
        const response = await axios.post('http://localhost:8080/api/statistics/commentsPerPeriod', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error: statistics, fetching comments count failed', error);
        return;
    }

}

export async function countFollowersPerPeriod  (userId: number, fromDate, toDate, token: String): Promise<number> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);

    try {
        const response = await axios.post('http://localhost:8080/api/statistics/followersPerPeriod', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error: statistics, fetching followers count failed', error);
        return;
    }

}

export async function countFollowingPerPeriod  (userId: number, fromDate, toDate, token: String): Promise<number> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);

    try {
        const response = await axios.post('http://localhost:8080/api/statistics/followingPerPeriod', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error: statistics, fetching following count failed', error);
        return;
    }

}

export async function countVisitsPerPeriod  (userId: number, fromDate, toDate, token: String): Promise<number> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);

    try {
        const response = await axios.post('http://localhost:8080/api/statistics/visitsPerPeriod', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error: statistics, fetching visits count failed', error);
        return;
    }

}
