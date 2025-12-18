import React from 'react';
import { Layout, Save, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './EditorHeader.module.css';

const EditorHeader: React.FC = () => {
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>
                <Layout size={20} />
                <span>Criador de Cards</span>
            </Link>

            <div className={styles.actions}>
                <button className={styles.saveBtn}>
                    <Save size={16} />
                    Salvar Rascunho
                </button>
                <button className={styles.downloadBtn}>
                    <Download size={16} />
                    Baixar PNG
                </button>
            </div>
        </header>
    );
};

export default EditorHeader;
