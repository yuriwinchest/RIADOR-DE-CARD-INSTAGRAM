import React from 'react';
import { Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.nav}`}>
                <div className={styles.logo}>
                    <Layout className={styles.logoIcon} size={28} />
                    <span>CardCreator</span>
                </div>

                <nav>
                    <ul className={styles.menu}>
                        <li><a href="#inicio" className={styles.menuItem}>Início</a></li>
                        <li><a href="#modelos" className={styles.menuItem}>Modelos</a></li>
                        <li><a href="#precos" className={styles.menuItem}>Preços</a></li>
                    </ul>
                </nav>

                <div className={styles.actions}>
                    <a href="#login" className={styles.loginBtn}>Login</a>
                    <Link to="/editor" className={styles.ctaBtn}>Começar Agora</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
