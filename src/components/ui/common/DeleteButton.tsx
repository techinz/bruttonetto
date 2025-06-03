import React from 'react';
import styles from './DeleteButton.module.css';
import { useTranslation } from 'react-i18next';
import type { DeleteButtonProps } from '../../../types/components/ui/common/deleteButton';
import { CloseIcon } from '../icons';


const DeleteButton: React.FC<DeleteButtonProps> = ({
    onClick,
    size = 'medium',
    label = 'Löschen',
}) => {
    const { t } = useTranslation();

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${styles.deleteButton} ${styles[size]}`}
            aria-label={t(label)}
        >
            <CloseIcon width={size === 'small' ? 12 : size === 'medium' ? 16 : 20} height={size === 'small' ? 12 : size === 'medium' ? 16 : 20} />
        </button>
    );
};

export default DeleteButton;