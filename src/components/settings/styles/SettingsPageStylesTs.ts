const styles = {
    listItem: {
        display: "flex",
        gap: "15px",
        alignItems: "center",
        padding: "10px 15px",
        border: "1px solid #333",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "var(--background-color1)",
        color:"var(--text-color)",
    },
    itemTitle: {
        fontSize: "16px",
        marginBottom: "5px",
        color: "var(--text-color)",
    },
    itemDescription: {
        fontSize: "14px",
        color: "#aaa",
    },
    input: {
        padding: "10px",
        border: "1px solid #555",
        borderRadius: "5px",
        backgroundColor: "#222",
        color: "#fff",
        fontSize: "14px",
    },
    link: {
        fontSize: "12px",
        color: "#1da1f2",
        textDecoration: "none",
    },
    item: {
        padding: "10px 0",
        fontSize: "14px",
        borderBottom: "1px solid #333",
    },
    profileHeader: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "20px",
    },
    profileImage: {
        borderRadius: "50%",
        height: "50px",
        width: "50px",
    },
    profileName: {
        fontSize: "16px",
        fontWeight: "bold",
        margin: 0,
    },
    profileUsername: {
        fontSize: "14px",
        color: "#aaa",
    },
    deactivateList: {
        fontSize: "14px",
        color: "var(--text-color4)",
        listStyle: "none",
        padding: 0,
        margin: "20px 0",
    },
    deactivateButton: {
        padding: "10px 20px",
        backgroundColor: "#f00",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    infoList: {
        listStyle: "none",
        padding: 0,
        color:"var(--text-color)",
    },
    errorText: {
        color: "red",
        fontSize: "12px",
        marginTop: "5px",
    },
    successText: {
        color: "green",
        fontSize: "12px",
        marginTop: "10px",
    },
    button: {
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#1da1f2",
        color: "#fff",
        cursor: "pointer",
        alignSelf: "flex-start",
    },
    infoItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 0",
        borderBottom: "1px solid #333",
        cursor: "pointer",
        color:"var(--text-color)"
    },
};

export default styles;
