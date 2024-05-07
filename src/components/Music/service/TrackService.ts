import {ChatType} from "../../messages/Types";
import {Track} from "../TrackList";

export async function createPlaylist(name: string, description:string, token: string): Promise<string[]> {

    try {

        const response = await fetch(`http://localhost:8080/api/playlists`, {
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

        const response = await fetch(`http://localhost:8080/api/playlists/${playlistId}/tracks`, {
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

        const response = await fetch(`http://localhost:8080/api/playlists/${playlistId}`, {
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