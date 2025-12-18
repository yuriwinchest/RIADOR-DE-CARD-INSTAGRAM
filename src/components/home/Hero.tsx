import React from 'react';
import { PlayCircle, PlusCircle, CheckCircle2, Instagram, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
    return (
        <section className={styles.heroSection}>
            <div className={`container ${styles.heroContent}`}>
                <div className={styles.textContent}>
                    <div className={styles.badge}>
                        <span className={styles.badgeNew}>NOVO</span>
                        Integração com WhatsApp Business
                    </div>

                    <h1 className={styles.title}>
                        Crie Cards Incríveis para <br />
                        <span className="gradient-text">Instagram</span> e <span className="gradient-text" style={{ '--accent': '#25D366' } as React.CSSProperties}>WhatsApp</span>
                    </h1>

                    <p className={styles.subtitle}>
                        Transforme suas fotos e textos em designs profissionais em segundos.
                        Visualize instantaneamente como ficará nos Stories e Status.
                    </p>

                    <div className={styles.actions}>
                        <Link to="/editor" className={styles.primaryBtn}>
                            <PlusCircle size={20} />
                            Criar meu primeiro card
                        </Link>            <button className={styles.secondaryBtn}>
                            <PlayCircle size={20} />
                            Ver demonstração
                        </button>
                    </div>

                    <div className={styles.benefits}>
                        <div className={styles.benefitItem}>
                            <CheckCircle2 size={16} className={styles.checkIcon} />
                            Não requer cartão de crédito
                        </div>
                        <div className={styles.benefitItem}>
                            <CheckCircle2 size={16} className={styles.checkIcon} />
                            Exportação gratuita
                        </div>
                    </div>
                </div>

                {/* 3D Visuals Area */}
                <div className={styles.visuals}>
                    {/* Card Mockup 2 (Back) */}
                    <div className={`${styles.cardMockup} ${styles.mockupSecondary}`}>
                        <div className={styles.mockupHeader}>
                            <div className={styles.mockupAvatar} style={{ background: '#ec4899' }}></div>
                            <div className={styles.mockupUser}>
                                <span className={styles.mockupName}>Loja de Roupas</span>
                                <span className={styles.mockupTime}>Há 2 horas</span>
                            </div>
                        </div>
                        <div className={styles.mockupBody}>
                            <div className={styles.instaBadge}>
                                <Instagram color="white" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Card Mockup 1 (Front) */}
                    <div className={`${styles.cardMockup} ${styles.mockupPrimary}`}>
                        <div className={styles.mockupHeader}>
                            <div className={styles.mockupAvatar}></div>
                            <div className={styles.mockupUser}>
                                <span className={styles.mockupName}>Promoção Relâmpago</span>
                                <span className={styles.mockupTime}>Agora</span>
                            </div>
                        </div>
                        <div className={styles.mockupBody} style={{ background: '#2e2450' }}>
                            {/* Content simulation */}
                            <div style={{ padding: '20px', color: 'white', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Oferta Especial</h3>
                                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Garanta 50% de desconto hoje!</p>
                            </div>
                        </div>

                        <div className={styles.whatsappBadge}>
                            <MessageCircle color="white" size={24} fill="white" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
