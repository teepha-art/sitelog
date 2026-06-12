import styles from './ProblemSection.module.css';

const cards = [
  {
    title: 'Issues reported too late',
    desc: 'By the time you hear about a delay, it\u2019s already cost you money. SiteLog gets issues to you instantly.',
    gradient: 'linear-gradient(135deg, var(--color-primary-container), var(--color-primary))',
  },
  {
    title: 'Material requests lost',
    desc: 'Stop scrolling through chat history to figure out what materials your team needs and when.',
    gradient: 'linear-gradient(135deg, var(--color-secondary-container), var(--color-secondary))',
  },
  {
    title: 'No permanent record',
    desc: 'Keep a structured, searchable history of every report, issue, and request for compliance and disputes.',
    gradient: 'linear-gradient(135deg, var(--color-tertiary-container), var(--color-tertiary))',
  },
];

export function ProblemSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.sectionTitle}>
            Built to stop <span className={styles.sectionTitleHighlight}>the chaos</span>
          </h2>
        </div>

        <div className={styles.carousel}>
          {cards.map((card, index) => (
            <div key={index} className={styles.card} style={{ flex: 1 }}>
              <div className={styles.cardImage} style={{ background: card.gradient }} />
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
