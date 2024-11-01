
import {TrackIcon} from "./TrackIcon";
import Button from "@mui/material/Button";
import CloseIcon from '@mui/icons-material/Close';
import {ListItem, ListItemText} from "@mui/material";
import {Track} from "./TrackList";
import React from "react";

export class TrackView extends React.Component<{ activeTrackId: any, track: Track, onClick: () => void, profilePage: boolean, onClick1: () => Promise<void> }> {
    render() {
        return <ListItem

            alignItems="flex-start"
            sx={{width: "100%"}}
            className={this.props.activeTrackId === this.props.track.id ? "active" : ""}
            onClick={this.props.onClick}>
            <TrackIcon track={this.props.track}/>
            <ListItemText
                primary={this.props.track.title}
                secondary={this.props.track.artist}
                sx={{color: "text.primary", flexGrow: 1}}
            />
            {!this.props.profilePage &&
                <Button onClick={this.props.onClick1}
                        sx={{background: "transparent"}}><CloseIcon/></Button>}
        </ListItem>;
    }
}