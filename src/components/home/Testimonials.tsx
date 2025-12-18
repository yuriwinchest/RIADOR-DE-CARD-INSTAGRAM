import React from 'react';
import { Star } from 'lucide-react';
import styles from './Testimonials.module.css';

const Testimonials: React.FC = () => {
    const reviews = [
        {
            name: 'Ana Silva',
            time: 'Há 2 dias',
            text: 'Ferramenta fantástica! Salvou muito tempo na criação dos posts da minha loja.',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
        },
        {
            name: 'Marcos Oliveira',
            time: 'Há 1 semana',
            text: 'Simples e direto ao ponto. Exatamente o que eu precisava para o WhatsApp.',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150'
        },
        {
            name: 'Julia Santos',
            time: 'Há 3 semanas',
            text: 'Ótimos modelos, mas gostaria de mais opções de fontes. De resto, perfeito.',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
        }
    ];

    return (
        <section className={styles.section} id="avaliacoes">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>O que nossos usuários dizem</h2>
                </div>

                <div className={styles.grid}>
                    {reviews.map((review, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.userInfo}>
                                <img src={review.avatar} alt={review.name} className={styles.avatar} />
                                <div className={styles.meta}>
                                    <span className={styles.name}>{review.name}</span>
                                    <span className={styles.time}>{review.time}</span>
                                </div>
                            </div>

                            <div className={styles.stars}>
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" strokeWidth={0} />)}
                            </div>

                            <p className={styles.text}>"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
