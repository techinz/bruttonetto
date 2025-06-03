import React from 'react';
import styles from './BackButton.module.css';
import { useTranslation } from 'react-i18next';
import type { BackButtonProps } from '../../../types/components/ui/common/backButton';
import { ShortArrow } from '../icons';


const BackButton: React.FC<BackButtonProps> = ({
    onClick,
    label = 'Zurück'
}) => {
    const { t } = useTranslation();
    return (
        <button
            type="button"
            onClick={onClick}
            className={styles.backButton}
            aria-label={t(label)}
        >
            <ShortArrow />
        </button>
    );
};

export default BackButton;