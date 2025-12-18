import React from 'react';
import { CloudUpload, Type, Download } from 'lucide-react';
import styles from './HowItWorks.module.css';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: <CloudUpload size={28} />,
            title: 'Upload de Imagem',
            desc: 'Carregue sua foto favorita ou escolha do nosso banco de imagens gratuito com milhões de opções.'
        },
        {
            icon: <Type size={28} />,
            title: 'Texto Personalizado',
            desc: 'Adicione sua mensagem, escolha fontes modernas e cores que combinam perfeitamente com sua marca.'
        },
        {
            icon: <Download size={28} />,
            title: 'Exportação Instantânea',
            desc: 'Baixe em alta qualidade nos formatos ideais para Stories, Feed ou Status do WhatsApp num clique.'
        }
    ];

    return (
        <section className={styles.section} id="como-funciona">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Como funciona</h2>
                    <p className={styles.subtitle}>
                        Três passos simples para levar sua comunicação visual para o próximo nível sem precisar de um designer.
                    </p>
                </div>

                <div className={styles.grid}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconBox}>{step.icon}</div>
                            <h3 className={styles.cardTitle}>{step.title}</h3>
                            <p className={styles.cardDesc}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
