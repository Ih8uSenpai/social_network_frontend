import React, {useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import {ProfileData} from "../../utils/Types";
import {fetchPhotos, fetchProfiles} from "../../profile/service/ProfileService";
import {defaultProfileIcon} from "../../utils/Constants";
import {handleMessage} from "../../profile/service/ChatService";
import {useNavigate} from "react-router-dom";
import {useChatExistence} from "../../profile/hooks/useChatExistence";

const InboxWelcomeComponent: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [profiles, setProfiles] = useState<ProfileData[]>([]);
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('currentUserId');
    const token = localStorage.getItem('authToken');
    const [userId, setUserId] = useState(null);
    const {isExisting, chatId} = useChatExistence(userId, token);

    const handleSearch = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        fetchProfiles(search).then((fetchedProfiles) => {
            setProfiles(fetchedProfiles);
        });
    };


    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "transparent",
                color: "#fff",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <h1 style={{fontSize: "28px", fontWeight: "bold", marginBottom: "10px"}}>
                Welcome to your inbox!
            </h1>
            <p style={{fontSize: "16px", marginBottom: "30px", lineHeight: "1.5"}}>
                Drop a line, share posts and more with private conversations between you
                and others.
            </p>
            <button
                onClick={handleOpenDialog}
                style={{
                    padding: "12px 24px",
                    backgroundColor: "#007bff",
                    border: "none",
                    borderRadius: "5px",
                    color: "#fff",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Write a message
            </button>

            {/* Диалоговое окно */}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                PaperProps={{
                    style: {
                        backgroundColor: "#000", // Чёрный фон
                        borderRadius: "10px",
                        color: "#fff",
                        width: "400px",
                        maxWidth: "400px",
                        margin: "0 auto",
                    },
                }}
            >
                <DialogTitle
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #333",
                        marginBottom: "10px",
                        padding: "10px 16px",
                        fontSize: "18px",
                        fontWeight: "bold",
                    }}
                >
                    New message
                    <IconButton onClick={handleCloseDialog} style={{color: "#fff"}}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{padding: "0 16px 16px"}}>
                    {/* Поле поиска */}
                    <form onSubmit={handleSearch} style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#222",
                        borderRadius: "5px",
                        padding: "8px 12px",
                        marginBottom: "16px",
                    }}>
                        <SearchIcon style={{color: "#888", marginRight: "8px"}}/>
                        <TextField
                            placeholder="Search people"
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                style: {
                                    color: "#fff",
                                },
                            }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            fullWidth
                        />
                    </form>

                    {/* Список */}
                    <List style={{padding: "0", color: "#fff"}}>
                        {profiles.map(profile => (
                            <div>
                                <ListItem key={profile?.profileId} className={"hover-list-item"}
                                          onClick={() => {
                                              setUserId(String(profile?.user.userId));
                                              handleMessage(profile, isExisting, token, currentUserId, String(profile?.user.userId), chatId, navigate)
                                          }}
                                          style={{display: 'flex', alignItems: 'center', marginBottom: '0px'}}>
                                    <img
                                        src={profile?.profilePictureUrl || defaultProfileIcon} // Указать URL изображения по умолчанию
                                        alt={profile?.user.username}
                                        className="follower-entry-icon"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            marginRight: '10px',
                                            cursor: "pointer"
                                        }}
                                    />
                                    <p
                                        style={{
                                            fontSize: '1.2em',
                                            color: "white",
                                            textDecoration: "none",
                                            alignSelf: "flex-start",
                                            marginLeft: '10px',
                                            cursor: "pointer"
                                        }}
                                    >
                                        {profile?.firstName} {profile?.lastName}
                                    </p>
                                </ListItem>
                            </div>
                        ))}
                        <ListItem
                            button
                            style={{
                                padding: "12px 16px",
                                borderBottom: "1px solid #333",
                            }}
                        >
                        </ListItem>
                    </List>

                    {/* Кнопка Next */}
                    <Button
                        variant="contained"
                        style={{
                            marginTop: "16px",
                            backgroundColor: "#1da1f2",
                            color: "#fff",
                            width: "100%",
                            borderRadius: "5px",
                            fontSize: "14px",
                            textTransform: "none",
                        }}
                    >
                        Next
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InboxWelcomeComponent;
