import {ChatType} from "../../utils/Types";
import {Track} from "../components/TrackList";

export async function createPlaylist(name: string, description:string, token: string): Promise<string[]> {

    try {

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description
            }),
        });


        return await response.json();
    } catch (error) {
        console.error('createPlaylist error:', error);
        throw error;
    }
}


export async function addTrack(playlistId:number, track:Track, token: string): Promise<string[]> {

    try {

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(track),
        });


        return await response.json();
    } catch (error) {
        console.error('addTrack error:', error);
        throw error;
    }
}


export async function deleteTrack(playlistId:number, track:Track, token: string): Promise<string[]> {

    try {

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/playlists/${playlistId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(track),
        });


        return await response.json();
    } catch (error) {
        console.error('deleteTrack error:', error);
        throw error;
    }
}