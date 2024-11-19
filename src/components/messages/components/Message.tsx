import React, {useRef, useState} from "react";
import {ChatMessage, ProfileData} from "../../utils/Types";
import {useNavigate} from "react-router-dom";
import {useIntersectionObserver} from "../../news/hooks/useIntersectionObserver";
import {defaultProfileIcon} from "../../utils/Constants";
import {formatDate} from "../../utils/formatDate";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const Message: React.FC<{
    profileData: ProfileData,
    myProfilePicture: string,
    messageObject: ChatMessage,
    currentUserId: string,
    onMessageSelect: (messageId: number) => void,
    selectedMessages: number[]
    setSelectedMessages;
    setEditMessage;
    editMessage;
}> = ({
          profileData,
          myProfilePicture,
          messageObject,
          currentUserId,
          onMessageSelect,
          selectedMessages,
          setEditMessage,
          setSelectedMessages,
          editMessage
      }) => {
    const messageRef = useRef(null);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const isSelected = selectedMessages.includes(messageObject.messageId);

    const markMessageAsViewed = async () => {
        if (!currentUserId) {
            console.error('Пользователь не идентифицирован');
            return;
        }
        if (messageObject.sender.userId == Number(currentUserId))
            return;

        await fetch(`http://localhost:8080/api/chats/mark-viewed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(messageObject.messageId)
        });
    };

    const handleEditMessage = () => {
        setEditMessage(messageObject);
    };

    useIntersectionObserver(messageRef, markMessageAsViewed, {threshold: 0.1});


    const handleClick = () => {
        onMessageSelect(messageObject.messageId);
    };


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                flexWrap: "nowrap",
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '',
                cursor: "pointer",
                paddingTop: messageObject.single ? "5px" : 0,
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={messageObject.viewed == false ? "unviewed-message" : ""}
            ref={messageRef}
        >
            {messageObject.single && profileData !== null && myProfilePicture != null ? (
                messageObject.sender.userId.toString() === currentUserId ? (
                    <img
                        src={myProfilePicture || defaultProfileIcon}
                        alt={messageObject.sender.username}
                        className="messages-user-icon"
                        style={{
                            height: "50px",
                            width: "50px",
                            marginRight: "10px",
                            marginLeft: "25px",
                            alignSelf: "flex-start",
                            justifySelf: "flex-start",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate('/profile/' + currentUserId)}
                    />
                ) : (
                    <img
                        src={profileData.profilePictureUrl || defaultProfileIcon}
                        alt={profileData.user.username}
                        className="messages-user-icon"
                        style={{
                            height: "50px",
                            width: "50px",
                            marginRight: "10px",
                            marginLeft: "25px",
                            alignSelf: "center",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate('/profile/' + profileData.user.userId)}
                    />
                )
            ) : null}

            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "80%",
                position: 'relative',
                paddingTop: 2,
                paddingBottom: 2
            }} ref={messageRef}>
                {messageObject.single && (
                    <div>
                        <strong>{messageObject.sender.username} </strong>
                        <small style={{
                            marginLeft: "3px",
                            fontSize: "0.8em",
                            color: "var(--text-color2)",
                            marginBottom: "2px"
                        }}>{formatDate(messageObject.sentAt)}</small>
                    </div>
                )}
                <span style={{
                    width: "90%",
                    wordWrap: "break-word",
                    borderRadius: '10px',
                    padding: 5,
                }} className={!messageObject.single ? 'message-margin-left' : ''}>
                    {messageObject.content}
                </span>

                {messageObject.sender.userId === Number(currentUserId) && isHovered && (
                    <EditIcon
                        onClick={handleEditMessage}
                        className={'change-color-on-hover'}
                        style={{
                            position: "absolute",
                            top: 0,
                            right: messageObject.single ? 20 : -60,
                            fontSize: 18,
                            cursor: "pointer"
                        }}
                    />
                )}

                {isHovered && (
                    <ReplyIcon fontSize={'small'}
                               className={'change-color-on-hover'}
                               style={{
                                   position: "absolute",
                                   top: 0,
                                   right: messageObject.single ? -10 : -90,
                                   fontSize: 18,
                                   cursor: "pointer"
                               }}
                    />
                )}

                {(isHovered || isSelected) && (
                    <CheckCircleIcon
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            fontSize: 18,
                            margin: "auto",
                            left: messageObject.single ? -80 : 5,
                            color: isSelected ? "" : '#aaa'
                        }}
                    />
                )}
            </div>
        </div>
    );
};