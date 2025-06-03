import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RestoreButton.module.css';
import type { RestoreButtonProps } from '../../../types/components/ui/common/restoreButton';
import { AddCircleIcon } from '../icons';


const RestoreButton: React.FC<RestoreButtonProps> = ({
    onClick,
    label,
    icon = <AddCircleIcon />,
    className = '',
}) => {
    const { t } = useTranslation();

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${styles.restoreButton} ${className}`}
            aria-label={t('Wiederherstellen: {{label}}', { label })}
        >
            {icon}
            {label}
        </button>
    );
};

export default RestoreButton;