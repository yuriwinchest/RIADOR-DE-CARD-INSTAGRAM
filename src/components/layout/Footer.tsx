import React from 'react';
import { Layout, Instagram, Twitter } from 'lucide-react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.logo}>
                        <Layout size={24} />
                        <span>CardCreator</span>
                    </div>

                    <div className={styles.links}>
                        <a href="#" className={styles.link}>Sobre</a>
                        <a href="#" className={styles.link}>Blog</a>
                        <a href="#" className={styles.link}>Termos</a>
                        <a href="#" className={styles.link}>Privacidade</a>
                        <a href="#" className={styles.link}>Contato</a>
                    </div>

                    <div className={styles.socials}>
                        <Instagram size={20} className={styles.socialIcon} />
                        <Twitter size={20} className={styles.socialIcon} />
                    </div>
                </div>

                <div className={styles.copyright}>
                    © 2024 CardCreator. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
