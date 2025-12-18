import React from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './CTASection.module.css';

const CTASection: React.FC = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Pronto para criar designs incríveis?</h2>
                    <p className={styles.subtitle}>
                        Junte-se a milhares de empreendedores que estão transformando suas redes sociais hoje mesmo.
                    </p>
                    <button className={styles.btn}>
                        Começar Gratuitamente
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
