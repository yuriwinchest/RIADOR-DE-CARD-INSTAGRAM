import React from 'react';
import styles from './Stats.module.css';

const Stats: React.FC = () => {
    const stats = [
        { value: '10k+', label: 'Cards Criados' },
        { value: '2.5k', label: 'Usuários Ativos' },
        { value: '4.9/5', label: 'Avaliação Média' },
        { value: '100+', label: 'Modelos Prontos' },
    ];

    return (
        <section className={styles.statsSection}>
            <div className={`container ${styles.grid}`}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statItem}>
                        <span className={styles.value}>{stat.value}</span>
                        <span className={styles.label}>{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
