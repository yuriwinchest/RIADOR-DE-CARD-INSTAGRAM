import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SEO from '../components/common/SEO';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={styles.page}>
      <SEO
        title="Política de Privacidade - CardCreator"
        description="Leia nossa Política de Privacidade para entender como coletamos, usamos e protegemos suas informações quando você usa o CardCreator."
        keywords="política de privacidade, privacidade, termos de uso, LGPD, GDPR"
        ogUrl="https://cardcreator.app/politica-de-privacidade"
      />
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Política de Privacidade</h1>
          <p className={styles.lastUpdate}>Última atualização: {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introdução</h2>
            <p className={styles.text}>
              O CardCreator ("nós", "nosso" ou "aplicativo") está comprometido em proteger sua privacidade. 
              Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações quando você utiliza nosso serviço.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Informações que Coletamos</h2>
            <h3 className={styles.subtitle}>2.1. Informações Fornecidas por Você</h3>
            <p className={styles.text}>
              Quando você usa nosso aplicativo, podemos coletar:
            </p>
            <ul className={styles.list}>
              <li>Imagens que você faz upload para criar seus cards</li>
              <li>Textos que você insere nos cards</li>
              <li>Preferências de design e personalização</li>
            </ul>

            <h3 className={styles.subtitle}>2.2. Informações Coletadas Automaticamente</h3>
            <p className={styles.text}>
              Coletamos automaticamente certas informações quando você visita nosso site:
            </p>
            <ul className={styles.list}>
              <li>Endereço de IP</li>
              <li>Tipo de navegador e sistema operacional</li>
              <li>Páginas visitadas e tempo de permanência</li>
              <li>Referrer (site de origem)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Uso de Cookies e Tecnologias Similares</h2>
            <p className={styles.text}>
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site e exibir anúncios personalizados.
            </p>
            <p className={styles.text}>
              Utilizamos o Google AdSense para exibir anúncios. O Google pode usar cookies para personalizar anúncios com base nas suas visitas anteriores ao nosso site e outros sites.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Google AdSense e Consentimento</h2>
            <p className={styles.text}>
              Nosso site utiliza o Google AdSense para exibir anúncios. Para usuários na Área Econômica Europeia (EEA), Reino Unido e Suíça, 
              solicitamos seu consentimento antes de exibir anúncios personalizados, conforme exigido pela legislação de proteção de dados.
            </p>
            <p className={styles.text}>
              Você pode gerenciar suas preferências de cookies a qualquer momento através das configurações do seu navegador ou através 
              da mensagem de consentimento apresentada quando você visita nosso site.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Como Usamos Suas Informações</h2>
            <p className={styles.text}>
              Utilizamos as informações coletadas para:
            </p>
            <ul className={styles.list}>
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Processar e exibir seus cards conforme solicitado</li>
              <li>Analisar o uso do aplicativo para melhorias</li>
              <li>Exibir anúncios relevantes através do Google AdSense</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Compartilhamento de Informações</h2>
            <p className={styles.text}>
              Não vendemos suas informações pessoais. Podemos compartilhar informações com:
            </p>
            <ul className={styles.list}>
              <li><strong>Google AdSense:</strong> Para exibição de anúncios personalizados</li>
              <li><strong>Provedores de serviços:</strong> Para operação e manutenção do site</li>
              <li><strong>Autoridades legais:</strong> Quando exigido por lei</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Segurança dos Dados</h2>
            <p className={styles.text}>
              Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações contra 
              acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Seus Direitos</h2>
            <p className={styles.text}>
              Dependendo da sua localização, você pode ter os seguintes direitos:
            </p>
            <ul className={styles.list}>
              <li>Acesso às suas informações pessoais</li>
              <li>Correção de informações inexatas</li>
              <li>Exclusão de suas informações</li>
              <li>Oposição ao processamento de seus dados</li>
              <li>Portabilidade de dados</li>
              <li>Retirada de consentimento (quando aplicável)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Retenção de Dados</h2>
            <p className={styles.text}>
              Retemos suas informações apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, 
              a menos que um período de retenção mais longo seja exigido ou permitido por lei.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Alterações nesta Política</h2>
            <p className={styles.text}>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações 
              significativas publicando a nova política nesta página e atualizando a data de "Última atualização".
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Contato</h2>
            <p className={styles.text}>
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através do email: 
              <a href="mailto:contato@cardcreator.app" className={styles.link}> contato@cardcreator.app</a>
            </p>
          </section>

          <div className={styles.backLink}>
            <Link to="/" className={styles.backButton}>← Voltar para o início</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

