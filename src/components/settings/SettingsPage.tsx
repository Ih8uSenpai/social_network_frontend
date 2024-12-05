import React, {useState} from "react";
import {useProfile} from "../profile/hooks/useProfile";
import {defaultProfileIcon} from "../utils/Constants";
import {
    changeEmail,
    changeFirstName,
    changeLastName,
    changePassword,
    changeTag,
    changeUsername, deactivateUser
} from "./service/SettingsService";
import  "./styles/SettingsPageStyles.css";
import styles from "./styles/SettingsPageStylesTs";
import ThemeSwitcher from "./ThemeSwitcher";
import "../themes/theme.css"

export const SettingsPage: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<string>("Your account");
    const [subPage, setSubPage] = useState<string | null>(null); // Manage sub-pages
    const currentUserId = localStorage.getItem('currentUserId');
    const token = localStorage.getItem('authToken');
    const {profile, fetchProfile} = useProfile(currentUserId, currentUserId, token, false);
    const tabs = [
        {id: "Your account", label: "Your account"},
        {id: "Preferences", label: "Preferences"},
    ];
    // State for handling input values and messages
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [newValue, setNewValue] = useState<string>('');

    // Handlers for API calls
    const handlePasswordChange = async () => {
        setError(null); // Clear previous errors
        setSuccess(null); // Clear previous success messages

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await changePassword(currentUserId, oldPassword, newPassword);
            setSuccess(response); // Set success message from the response
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            if (error.response?.status === 400) {
                setError("The password you entered was incorrect.");
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    const handleSave = async () => {
        setError(null);
        setSuccess(null);

        try {
            if (subPage === "Change username") {
                const response = await changeUsername(currentUserId, newValue);
                setSuccess("Username successfully updated.");
            } else if (subPage === "Change email") {
                const response = await changeEmail(currentUserId, newValue);
                setSuccess("Email successfully updated.");
            } else if (subPage === "Change first name") {
                const response = await changeFirstName(profile.profileId, newValue);
                setSuccess("First name successfully updated.");
            } else if (subPage === "Change last name") {
                const response = await changeLastName(profile.profileId, newValue);
                setSuccess("Last name successfully updated.");
            } else if (subPage === "Change tag") {
                const response = await changeTag(profile.profileId, newValue);
                setSuccess("Tag successfully updated.");
            }
            fetchProfile(); // Refresh profile data
            setError("");
            setSuccess("")
            setSubPage(null); // Navigate back to "Your Account" page
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
        }
    };

    const handleDeactivate = async () => {

        setMessage(null);
        try {
            await deactivateUser(Number(currentUserId));
            setMessage("User successfully deactivated!");
        } catch (error) {
            setMessage("Failed to deactivate user.");
        }
    };

    const content = {
        "Your account": subPage === "Account information" ? (
            <div style={{padding: "20px"}}>
                <h1 style={{fontSize: "20px", fontWeight: "bold", marginBottom: "10px", color:"var(--text-color)"}}>
                    Account Information
                </h1>
                <ul style={styles.infoList}>
                    <li
                        className={"info-item"}
                        onClick={() => {
                            setSubPage("Change username");
                            setNewValue(profile.user.username || "");
                        }}
                    >
                        <strong>Username</strong>
                        <span>{profile.user.username}</span>
                    </li>
                    <li
                        className={"info-item"}
                        onClick={() => {
                            setSubPage("Change email");
                            setNewValue(profile.user.email || "");
                        }}
                    >
                        <strong>Email</strong>
                        <span>{profile.user.email}</span>
                    </li>
                    <li
                        className={"info-item"}
                        onClick={() => {
                            setSubPage("Change tag");
                            setNewValue(profile.tag || "");
                        }}
                    >
                        <strong>Tag</strong>
                        <span>@{profile.tag}</span>
                    </li>
                    <li
                        className={"info-item"}
                        onClick={() => {
                            setSubPage("Change first name");
                            setNewValue(profile.firstName || "");
                        }}
                    >
                        <strong>First Name</strong>
                        <span>{profile.firstName}</span>
                    </li>
                    <li
                        className={"info-item"}
                        onClick={() => {
                            setSubPage("Change last name");
                            setNewValue(profile.lastName || "");
                        }}
                    >
                        <strong>Last Name</strong>
                        <span>{profile.lastName}</span>
                    </li>
                </ul>
            </div>
        ) : (subPage === "Change username" || subPage === "Change email"
            || subPage === "Change first name" || subPage === "Change last name"
            || subPage === "Change tag") ? (
            <div style={{padding: "20px"}}>
                <h1 style={{fontSize: "20px", fontWeight: "bold", marginBottom: "10px", color:"var(--text-color)"}}>
                    {subPage}
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    style={{display: "flex", flexDirection: "column", gap: "15px"}}
                >
                    <input
                        type="text"
                        placeholder={subPage}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className={"input"}
                    />
                    {error && <span className={"error-text"}>{error}</span>}
                    {success && <span className={"success-text"}>{success}</span>}
                    <button type="submit" className={"button"}>
                        Save
                    </button>
                </form>
            </div>
        ) : subPage === "Change your password" ? (
            <div style={{padding: "20px"}}>
                <h1 style={{fontSize: "20px", fontWeight: "bold", marginBottom: "10px", color:"var(--text-color)"}}>
                    Change your password
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handlePasswordChange();
                    }}
                    style={{display: "flex", flexDirection: "column", gap: "15px"}}
                >
                    <div>
                        <input
                            type="password"
                            placeholder="Current password"
                            className={"input"}
                            style={{
                                borderColor: error === "The password you entered was incorrect." ? "red" : "#555",
                            }}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        {error === "The password you entered was incorrect." && (
                            <span className={"error-text"}>{error}</span>
                        )}
                    </div>
                    <a href="#" className={"link"}>
                        Forgot password?
                    </a>
                    <div>
                        <input
                            type="password"
                            placeholder="New password"
                            className={"input"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            className={"input"}
                            style={{
                                borderColor: error === "Passwords do not match." ? "red" : "#555",
                            }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {error === "Passwords do not match." && (
                            <span className={"error-text"}>{error}</span>
                        )}
                    </div>
                    <button className={"button"} type="submit">
                        Save
                    </button>
                    {success && <span className={"success-text"}>{success}</span>}
                </form>
            </div>
        ) : subPage === "Deactivate account" ? (
                <div style={{padding: "20px"}}>
                    <h1 style={{fontSize: "20px", fontWeight: "bold", marginBottom: "10px", color:"var(--text-color)"}}>
                        Deactivate account
                    </h1>
                    <div style={{marginBottom: "20px"}}>
                        <div className={"profile-header"}>
                            <img
                                src={`${process.env.REACT_APP_STATIC_URL}/` + (profile.profilePictureUrl || defaultProfileIcon)}
                                alt="Profile"
                                className={"profile-image"}
                            />
                            <div>
                                <h2 className={"profile-name"}>{profile.firstName + " " + profile.lastName}</h2>
                                <p className={"profile-username"}>@{profile.tag}</p>
                            </div>
                        </div>
                    </div>
                    <h2 style={{fontSize: "16px", fontWeight: "bold", marginBottom: "10px", color:"var(--text-color)"}}>
                        This will deactivate your account
                    </h2>
                    <p style={{fontSize: "14px", marginBottom: "20px", color: "var(--text-color4)"}}>
                        You’re about to start the process of deactivating your account. Your display
                        name, @username, and public profile will no longer be viewable.
                    </p>
                    <h3 style={{fontSize: "16px", fontWeight: "bold", marginBottom: "10px", color:"var(--text-color)"}}>
                        What else you should know
                    </h3>
                    <ul style={styles.deactivateList}>
                        <li>
                            You can restore your account if it was accidentally or wrongfully deactivated
                            for up to 30 days after deactivation.
                        </li>
                        <li>
                            If you just want to change your @username, you don’t need to deactivate your
                            account — edit it in your <a href="#" style={styles.link}>settings</a>.
                        </li>
                        <li>
                            To use your current @username or email address with a different account,{" "}
                            <a href="#" style={styles.link}>change them</a> before you deactivate this
                            account.
                        </li>
                    </ul>
                    <button style={styles.deactivateButton} onClick={handleDeactivate}>Deactivate</button>
                </div>
            )
            : (
                <div style={{padding: "20px"}}>
                    <h1 style={{fontSize: "20px", fontWeight: "bold", marginBottom: "10px", color:"var(--text-color)"}}>
                        Your Account
                    </h1>
                    <p style={{fontSize: "14px", marginBottom: "20px", color: "var(--text-color2)"}}>
                        Manage your account settings.
                    </p>
                    <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                        <div
                            style={styles.listItem}
                            onClick={() => setSubPage("Account information")}
                        >
                            <span>📄</span>
                            <div>
                                <h3 style={styles.itemTitle}>Account information</h3>
                                <p style={styles.itemDescription}>
                                    See your account information like your phone number and email
                                    address.
                                </p>
                            </div>
                        </div>
                        <div
                            style={styles.listItem}
                            onClick={() => setSubPage("Change your password")}
                        >
                            <span>🔑</span>
                            <div>
                                <h3 style={styles.itemTitle}>Change your password</h3>
                                <p style={styles.itemDescription}>Change your password at any time.</p>
                            </div>
                        </div>
                        <div style={styles.listItem} onClick={() => setSubPage("Deactivate account")}>
                            <span>❌️</span>
                            <div>
                                <h3 style={styles.itemTitle}>Deactivate your account</h3>
                                <p style={styles.itemDescription}>
                                    Find out how you can deactivate your account.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            Preferences: (
                <div style={{ padding: "20px" }}>
                    <h1
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            marginBottom: "10px",
                            color: "var(--text-color)",
                        }}
                    >
                        Preferences
                    </h1>
                    <p
                        style={{
                            fontSize: "14px",
                            marginBottom: "20px",
                            color: "var(--text-color2)",
                        }}
                    >
                        Customize your experience, including language, display, and accessibility
                        settings.
                    </p>

                    {/* Добавим переключатель темы */}
                    <div>
                        <h2
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginBottom: "10px",
                                color: "var(--text-color)",
                            }}
                        >
                            Theme Settings
                        </h2>
                        <ThemeSwitcher />
                    </div>
                </div>
            ),
    };

    return (
        <div style={{display: "flex", height: "100vh", backgroundColor: "transparent"}}>
            {/* Left Sidebar */}
            <div
                style={{
                    flex: "1",
                    borderRight: "1px solid #333",
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                    color:"var(--text-color)"
                }}
            >
                <h3 style={{marginBottom: "20px"}}>Settings</h3>
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => {
                            setSelectedTab(tab.id);
                            setSubPage(null); // Reset sub-page when switching tabs
                        }}
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            backgroundColor: selectedTab === tab.id ? "var(--background-color2)" : "transparent",
                            color: selectedTab === tab.id ? "#1da1f2" : "var(--text-color)",
                            marginBottom: "10px",
                        }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Right Content */}
            <div style={{flex: "3", padding: "20px", overflowY: "auto"}}>{content[selectedTab]}</div>
        </div>
    );
};

export default SettingsPage;
