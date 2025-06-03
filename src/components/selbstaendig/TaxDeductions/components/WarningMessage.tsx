import React from 'react';
import styles from './WarningMessage.module.css';
import type { WarningMessageProps } from '../../../../types/components/selbstaendig/taxDeductions/warningMessage';
import { WarningIcon } from '../../../ui/icons';

/**
 * Display a warning message
 * 
 * @param {string} message - The warning message to display
 */
const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
    return (
        <div className={styles.warning}>
            <WarningIcon />
            {message}
        </div>
    );
};

export default WarningMessage;