import { C, GOLD_GRADIENT, tint } from '../theme/tokens';
import { Awaiting, Chip, Mono, Panel, Points, PROSE, Section, SHELL } from '../components/ui';
import { PROFILE } from '../data/profile';
import { WORK } from '../data/work';
import { CERTIFICATES, EXAMS, HONORS } from '../data/credentials';
import { EDUCATION } from '../data/education';
import { EXPERIENCE } from '../data/experience';
import { SKILLS } from '../data/skills';

function Hero() {
  return (
    <header style={{ paddingTop: 'clamp(56px, 10vw, 104px)' }}>
      <div style={SHELL}>
        <div
          style={{
            display: 'flex',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 380px', minWidth: 0 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: `1px solid ${tint(C.gold, 0.3)}`,
                background: tint(C.gold, 0.07),
                borderRadius: 999,
                padding: '6px 12px',
                marginBottom: 22,
              }}
            >
              <span
                aria-hidden="true"
                style={{ width: 6, height: 6, borderRadius: 999, background: C.gold }}
              />
              <Mono color={C.gold} size={11}>
                {PROFILE.available}
              </Mono>
            </div>

            <h1
              style={{
                font: `700 clamp(38px, 6.4vw, 60px)/1.05 ${C.sans}`,
                color: C.text,
                margin: '0 0 18px',
                letterSpacing: '-0.02em',
              }}
            >
              {PROFILE.name}
            </h1>

            <p
              style={{
                ...PROSE,
                font: `500 clamp(19px, 2.4vw, 23px)/1.45 ${C.sans}`,
                color: C.text,
                margin: '0 0 16px',
                textWrap: 'balance',
              }}
            >
              {PROFILE.headline}
            </p>

            <p style={{ ...PROSE, font: `400 17px/1.65 ${C.sans}`, color: C.muted, margin: '0 0 28px' }}>
              {PROFILE.summary}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={`mailto:${PROFILE.email}`}
                style={{
                  font: `600 15px/1 ${C.sans}`,
                  color: C.goldText,
                  background: GOLD_GRADIENT,
                  borderRadius: 8,
                  padding: '13px 20px',
                  textDecoration: 'none',
                }}
              >
                Get in touch
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  font: `500 15px/1 ${C.sans}`,
                  color: C.text,
                  border: `1px solid ${C.line2}`,
                  borderRadius: 8,
                  padding: '13px 20px',
                  textDecoration: 'none',
                }}
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Headshot. Square rather than round — it sits with the panels
              rather than against them, and the terminal has no circles. */}
          <div style={{ flex: '0 0 auto' }}>
            <div
              style={{
                width: 'clamp(140px, 22vw, 196px)',
                aspectRatio: '1 / 1',
                borderRadius: 12,
                border: `1px solid ${C.line2}`,
                background: C.panel,
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                padding: 16,
              }}
            >
              <Mono size={10} color={C.faint} style={{ letterSpacing: '0.1em' }}>
                Headshot
                <br />
                to come
              </Mono>
            </div>
          </div>
        </div>

        <p
          style={{
            font: `400 14px/1.6 ${C.sans}`,
            color: C.faint,
            margin: '36px 0 0',
            paddingTop: 20,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          {PROFILE.location} · {PROFILE.entity}
        </p>
      </div>
    </header>
  );
}

function Work() {
  return (
    <Section
      id="work"
      label="Selected work"
      title="What I have built"
      intro="Systems that are running, not prototypes."
    >
      <div style={{ display: 'grid', gap: 20 }}>
        {WORK.map((p) => (
          <Panel key={p.slug}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
                alignItems: 'baseline',
                marginBottom: 12,
              }}
            >
              <h3 style={{ font: `700 22px/1.25 ${C.sans}`, color: C.text, margin: 0 }}>{p.name}</h3>
              <Mono>{p.period}</Mono>
            </div>

            <p style={{ font: `500 14px/1.5 ${C.sans}`, color: C.gold, margin: '0 0 14px' }}>
              {p.role}
            </p>

            <p style={{ ...PROSE, font: `400 16px/1.65 ${C.sans}`, color: C.muted, margin: '0 0 20px' }}>
              {p.summary}
            </p>

            {p.pending ? (
              <Awaiting>{p.pending}</Awaiting>
            ) : (
              <>
                <Points items={p.points} />

                {p.stack.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 22 }}>
                    {p.stack.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                )}

                {p.link && (
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.line}` }}>
                    <a
                      href={p.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        font: `600 15px/1 ${C.sans}`,
                        color: C.gold,
                        textDecoration: 'none',
                        borderBottom: `1px solid ${tint(C.gold, 0.4)}`,
                        paddingBottom: 2,
                      }}
                    >
                      {p.link.label} →
                    </a>
                    {p.link.note && (
                      <p style={{ font: `400 14px/1.55 ${C.sans}`, color: C.faint, margin: '12px 0 0' }}>
                        {p.link.note}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </Panel>
        ))}
      </div>
    </Section>
  );
}

function Credentials() {
  return (
    <Section
      id="credentials"
      label="Credentials"
      title="Certificates and examinations"
      intro="Every certificate in one place, so a single link reaches all of them."
    >
      {CERTIFICATES.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gap: 14,
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          }}
        >
          {CERTIFICATES.map((c) => (
            <Panel key={c.name} style={{ padding: 20 }}>
              <Mono size={11}>{c.issuer}</Mono>
              <h3 style={{ font: `600 17px/1.35 ${C.sans}`, color: C.text, margin: '10px 0 8px' }}>
                {c.name}
              </h3>
              <p style={{ font: `400 14px/1 ${C.sans}`, color: C.faint, margin: 0 }}>{c.date}</p>
              {c.href && (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    font: `500 14px/1 ${C.sans}`,
                    color: C.gold,
                    textDecoration: 'none',
                    display: 'inline-block',
                    marginTop: 14,
                  }}
                >
                  Verify →
                </a>
              )}
            </Panel>
          ))}
        </div>
      ) : (
        <Awaiting>Course certificates are being added here.</Awaiting>
      )}

      <div style={{ marginTop: 28, display: 'grid', gap: 14 }}>
        {EXAMS.map((e) => (
          <Panel key={e.name} style={{ padding: 20 }}>
            <div
              style={{
                display: 'flex',
                gap: 14,
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                alignItems: 'baseline',
              }}
            >
              <div>
                <h3 style={{ font: `600 17px/1.35 ${C.sans}`, color: C.text, margin: '0 0 6px' }}>
                  {e.name}
                </h3>
                <p style={{ font: `400 14px/1.5 ${C.sans}`, color: C.muted, margin: 0 }}>{e.body}</p>
              </div>
              <Mono color={C.gold}>{e.status}</Mono>
            </div>
          </Panel>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <Mono>Honours</Mono>
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {HONORS.map((h) => (
            <div
              key={h.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
                font: `400 16px/1.5 ${C.sans}`,
                color: C.muted,
                paddingBottom: 10,
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <span style={{ color: C.text }}>{h.name}</span>
              <Mono>{h.date}</Mono>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Education() {
  return (
    <Section id="education" label="Education" title="Where I studied">
      <div style={{ display: 'grid', gap: 14 }}>
        {EDUCATION.map((s) => (
          <Panel key={s.school} style={{ padding: 22 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
                alignItems: 'baseline',
              }}
            >
              <h3 style={{ font: `600 18px/1.3 ${C.sans}`, color: C.text, margin: 0 }}>{s.school}</h3>
              <Mono>{s.period}</Mono>
            </div>
            <p style={{ font: `400 16px/1.5 ${C.sans}`, color: C.muted, margin: '10px 0 0' }}>
              {s.credential}
            </p>
            {s.detail && (
              <p style={{ font: `400 14px/1.5 ${C.sans}`, color: C.faint, margin: '6px 0 0' }}>
                {s.detail}
                {s.place ? ` · ${s.place}` : ''}
              </p>
            )}
          </Panel>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" label="Experience" title="Where I have worked">
      <div style={{ display: 'grid', gap: 34 }}>
        {EXPERIENCE.map((r, i) => (
          <div
            key={`${r.org}-${r.period}`}
            style={{ paddingLeft: 22, borderLeft: `1px solid ${C.line2}`, position: 'relative' }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: -4,
                top: 6,
                width: 7,
                height: 7,
                borderRadius: 999,
                background: i === 0 ? C.gold : C.line2,
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
                alignItems: 'baseline',
              }}
            >
              <h3 style={{ font: `600 18px/1.3 ${C.sans}`, color: C.text, margin: 0 }}>
                {r.title} <span style={{ color: C.muted, fontWeight: 400 }}>· {r.org}</span>
              </h3>
              <Mono>{r.period}</Mono>
            </div>
            {r.place && (
              <p style={{ font: `400 13px/1.5 ${C.sans}`, color: C.faint, margin: '6px 0 0' }}>
                {r.place}
              </p>
            )}
            <div style={{ marginTop: 14 }}>
              <Points items={r.points} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" label="Capabilities" title="What I work with">
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {SKILLS.map((g) => (
          <Panel key={g.title} style={{ padding: 22 }}>
            <h3 style={{ font: `600 17px/1.3 ${C.sans}`, color: C.text, margin: '0 0 6px' }}>
              {g.title}
            </h3>
            {g.note && (
              <p style={{ font: `400 14px/1.5 ${C.sans}`, color: C.faint, margin: '0 0 14px' }}>
                {g.note}
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: g.note ? 0 : 14 }}>
              {g.items.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" label="Contact" title="Get in touch">
      <Panel style={{ display: 'grid', gap: 18 }}>
        <p style={{ ...PROSE, font: `400 17px/1.65 ${C.sans}`, color: C.muted, margin: 0 }}>
          Available for AI contract work — evaluation, applied build work, and anything where
          judging the output takes real domain knowledge.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={`mailto:${PROFILE.email}`}
            style={{
              font: `600 15px/1 ${C.sans}`,
              color: C.goldText,
              background: GOLD_GRADIENT,
              borderRadius: 8,
              padding: '13px 20px',
              textDecoration: 'none',
            }}
          >
            {PROFILE.email}
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              font: `500 15px/1 ${C.sans}`,
              color: C.text,
              border: `1px solid ${C.line2}`,
              borderRadius: 8,
              padding: '13px 20px',
              textDecoration: 'none',
            }}
          >
            LinkedIn
          </a>
        </div>
      </Panel>
    </Section>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: 'clamp(56px, 9vw, 96px)', borderTop: `1px solid ${C.line}` }}>
      <div
        style={{
          ...SHELL,
          padding: '26px clamp(20px, 5vw, 48px) 44px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Mono size={11}>{PROFILE.entity}</Mono>
        <Mono size={11}>andrewramey.com</Mono>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Credentials />
      <Education />
      <Experience />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
