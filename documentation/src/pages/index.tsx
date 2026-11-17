import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const highlights = [
  ['Planificación semanal', 'Organiza tareas y hábitos de domingo a sábado, con progreso diario visible.'],
  ['Recompensas medibles', 'Convierte semanas completas de hábitos en minutos disponibles para tus premios.'],
  ['Metas visuales', 'Mantén hasta nueve metas con estado, descripción e imagen almacenada localmente.'],
];

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <p className={styles.eyebrow}>DOCUMENTACIÓN OFICIAL</p>
        <Heading as="h1">Organized Week</Heading>
        <p className={styles.heroSubtitle}>
          Una guía clara para planificar tu semana, seguir hábitos y cuidar tus metas desde el navegador.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">Comenzar a leer</Link>
          <Link className="button button--secondary button--lg" to="/docs/instalacion">Instalar localmente</Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Organized Week Docs" description="Documentación oficial de Organized Week">
      <HomepageHeader />
      <main className={styles.main}>
        <section className="container">
          <div className={styles.intro}>
            <p className={styles.eyebrow}>TODO EN UN SOLO LUGAR</p>
            <Heading as="h2">Tu semana, con contexto</Heading>
            <p>
              Organized Week funciona completamente en el navegador. Esta documentación describe
              únicamente las funciones implementadas y cómo conservar tus datos locales.
            </p>
          </div>
          <div className={styles.cards}>
            {highlights.map(([title, description]) => (
              <article className={styles.card} key={title}>
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <div className={styles.callout}>
            <div>
              <Heading as="h2">¿Listo para empezar?</Heading>
              <p>Consulta la introducción para conocer el flujo de la aplicación y sus límites reales.</p>
            </div>
            <Link className="button button--primary" to="/docs/intro">Ver la guía</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
