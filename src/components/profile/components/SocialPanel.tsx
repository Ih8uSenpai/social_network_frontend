import React from 'react';
import styles from '../styles/SocialPanel.module.css'; // Importing CSS module

interface SocialPanelProps {
    followers: number;
    following: number;
}

const SocialPanel: React.FC<SocialPanelProps> = ({ followers, following }) => {
    return (
        <div className={styles.socialPanel}>
            <div className={styles.socialItem}>
                <div className={styles.socialCount}>{followers}</div>
                <div className={styles.socialLabel}>Followers</div>
            </div>
            <div className={styles.socialItem}>
                <div className={styles.socialCount}>{following}</div>
                <div className={styles.socialLabel}>Following</div>
            </div>
        </div>
    );
};

export default SocialPanel;
