'use client';

import { useMemo, useState } from 'react';
import {
  allowedContactRoles,
  categoryLabels,
  categorize,
  contactRoleLabels,
  selfContactRoleLabels,
  updateLevelSummary,
  validateEnrollment,
  type Contact,
  type ContactRole,
  type Enrollment,
  type RegistrationEntry,
  type UpdateLevel,
} from '@promoted/core';
import styles from './EnrollFlow.module.css';

/**
 * Registration, exactly as specified in the flowchart.
 *
 * The spec's key instruction — "'someone else / one person' and the
 * per-student loop inside 'group' use the identical contact-selection
 * component; build it once, reuse it in both places" — is honoured literally:
 * `<ContactPicker>` below is rendered by all three branches, and the branch
 * only decides which roles it offers and whose name is on the heading.
 *
 * State is deliberately one flat object rather than a step-indexed wizard, so
 * going back never loses what was already entered.
 */

type Step =
  | 'who'
  | 'one-or-group'
  | 'student-details'
  | 'roster'
  | 'contacts'
  | 'review'
  | 'done';

interface RosterEntry {
  id: string;
  name: string;
  email: string;
  contacts: Contact[];
}

let idSeq = 0;
const nextId = () => `id-${++idSeq}`;

export function EnrollFlow() {
  const [step, setStep] = useState<Step>('who');
  const [entry, setEntry] = useState<RegistrationEntry>('self');

  const [me, setMe] = useState({ name: '', email: '' });
  const [student, setStudent] = useState({ name: '', email: '' });
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [roster, setRoster] = useState<RosterEntry[]>([
    { id: nextId(), name: '', email: '', contacts: [] },
  ]);
  /** Index of the student currently being configured in the group loop. */
  const [rosterCursor, setRosterCursor] = useState(0);

  const [submitted, setSubmitted] = useState<{ count: number; category: string } | null>(null);

  const isGroup = entry === 'other-group';
  const effectiveStudent = isGroup ? roster[rosterCursor] ?? student : student;

  const enrollments = useMemo<Enrollment[]>(() => {
    const startedAt = new Date();
    if (isGroup) {
      const rosterId = 'roster-1';
      return roster.map((r) => ({
        id: `e-${r.id}`,
        entry,
        student: { name: r.name, email: r.email },
        contacts: r.contacts,
        registeredBy: me,
        rosterId,
        startedAt,
      }));
    }
    return [
      {
        id: 'e-1',
        entry,
        student,
        contacts,
        ...(entry === 'self' ? {} : { registeredBy: me }),
        startedAt,
      },
    ];
  }, [entry, isGroup, roster, student, contacts, me]);

  const problems = useMemo(
    () => enrollments.flatMap((e, i) => validateEnrollment(e).map((p) => ({ ...p, index: i }))),
    [enrollments],
  );

  function submit() {
    if (problems.length > 0) return;
    setSubmitted({
      count: enrollments.length,
      category: categoryLabels[categorize(enrollments[0]!)].title,
    });
    setStep('done');
  }

  // ---- Step: who is registering? ----------------------------------------
  if (step === 'who') {
    return (
      <Frame step={1} of={4} title="Who are you registering?">
        <div className={styles.choices}>
          <BigChoice
            title="Myself"
            body="You are the one taking the course."
            onClick={() => {
              setEntry('self');
              setStep('contacts');
            }}
          />
          <BigChoice
            title="Someone else"
            body="You are enrolling one person, or a group."
            onClick={() => {
              setEntry('other-individual');
              setStep('one-or-group');
            }}
          />
        </div>
        <p className={styles.hint}>
          Registering yourself with nobody following along is completely fine — that is the
          self-directed path, and nothing is shared with anyone.
        </p>
      </Frame>
    );
  }

  // ---- Step: one person or a group? -------------------------------------
  if (step === 'one-or-group') {
    return (
      <Frame step={2} of={4} title="One person, or a group?" onBack={() => setStep('who')}>
        <div className={styles.choices}>
          <BigChoice
            title="One person"
            body="A single new manager."
            onClick={() => {
              setEntry('other-individual');
              setStep('student-details');
            }}
          />
          <BigChoice
            title="A group"
            body="Several people at once. Each still gets their own contacts and levels."
            onClick={() => {
              setEntry('other-group');
              setStep('roster');
            }}
          />
        </div>
      </Frame>
    );
  }

  // ---- Step: student details (individual) --------------------------------
  if (step === 'student-details') {
    const ready = student.name.trim() && student.email.trim() && me.name.trim() && me.email.trim();
    return (
      <Frame
        step={3}
        of={4}
        title="Who is taking the course?"
        onBack={() => setStep('one-or-group')}
      >
        <Field label="Their name" value={student.name} onChange={(v) => setStudent((s) => ({ ...s, name: v }))} />
        <Field
          label="Their email"
          type="email"
          value={student.email}
          onChange={(v) => setStudent((s) => ({ ...s, email: v }))}
        />
        <hr className={styles.rule} />
        <p className={styles.subhead}>And you, so we know who enrolled them.</p>
        <Field label="Your name" value={me.name} onChange={(v) => setMe((m) => ({ ...m, name: v }))} />
        <Field
          label="Your email"
          type="email"
          value={me.email}
          onChange={(v) => setMe((m) => ({ ...m, email: v }))}
        />
        <button className="pr-btn" disabled={!ready} onClick={() => setStep('contacts')}>
          Continue
        </button>
      </Frame>
    );
  }

  // ---- Step: roster (group) ----------------------------------------------
  if (step === 'roster') {
    const filled = roster.filter((r) => r.name.trim() && r.email.trim());
    const ready = filled.length > 0 && me.name.trim() && me.email.trim();
    return (
      <Frame step={3} of={4} title="Who is in the group?" onBack={() => setStep('one-or-group')}>
        <p className={styles.subhead}>
          Add everyone now. You will set contacts and levels for each person one at a time.
        </p>

        <ul className={styles.roster}>
          {roster.map((r, i) => (
            <li key={r.id} className={styles.rosterRow}>
              <span className={styles.rosterNum}>{i + 1}</span>
              <Field
                label="Name"
                value={r.name}
                onChange={(v) =>
                  setRoster((list) => list.map((x) => (x.id === r.id ? { ...x, name: v } : x)))
                }
              />
              <Field
                label="Email"
                type="email"
                value={r.email}
                onChange={(v) =>
                  setRoster((list) => list.map((x) => (x.id === r.id ? { ...x, email: v } : x)))
                }
              />
              {roster.length > 1 ? (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => setRoster((list) => list.filter((x) => x.id !== r.id))}
                  aria-label={`Remove person ${i + 1}`}
                >
                  ×
                </button>
              ) : null}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="pr-btn pr-btn--ghost"
          onClick={() => setRoster((l) => [...l, { id: nextId(), name: '', email: '', contacts: [] }])}
        >
          Add another person
        </button>

        <hr className={styles.rule} />
        <p className={styles.subhead}>And you, so we know who enrolled them.</p>
        <Field label="Your name" value={me.name} onChange={(v) => setMe((m) => ({ ...m, name: v }))} />
        <Field
          label="Your email"
          type="email"
          value={me.email}
          onChange={(v) => setMe((m) => ({ ...m, email: v }))}
        />

        <button
          className="pr-btn"
          disabled={!ready}
          onClick={() => {
            setRoster(filled);
            setRosterCursor(0);
            setStep('contacts');
          }}
        >
          Continue with {filled.length} {filled.length === 1 ? 'person' : 'people'}
        </button>
      </Frame>
    );
  }

  // ---- Step: contacts (the shared component, all three branches) ---------
  if (step === 'contacts') {
    const forName = entry === 'self' ? null : effectiveStudent.name || 'this person';
    const current = isGroup ? roster[rosterCursor]!.contacts : contacts;
    const setCurrent = (next: Contact[]) => {
      if (isGroup) {
        setRoster((list) =>
          list.map((r, i) => (i === rosterCursor ? { ...r, contacts: next } : r)),
        );
      } else {
        setContacts(next);
      }
    };

    const onBack = () => {
      if (isGroup && rosterCursor > 0) setRosterCursor((c) => c - 1);
      else if (isGroup) setStep('roster');
      else if (entry === 'self') setStep('who');
      else setStep('student-details');
    };

    const onNext = () => {
      if (isGroup && rosterCursor < roster.length - 1) setRosterCursor((c) => c + 1);
      else setStep('review');
    };

    return (
      <Frame
        step={4}
        of={4}
        title={forName ? `Who should follow ${forName}’s progress?` : 'Who should follow your progress?'}
        onBack={onBack}
        badge={
          isGroup ? `Person ${rosterCursor + 1} of ${roster.length}` : undefined
        }
      >
        <ContactPicker
          entry={entry}
          contacts={current}
          onChange={setCurrent}
          subjectLabel={forName ? 'them' : 'you'}
        />
        <button className="pr-btn" onClick={onNext}>
          {isGroup && rosterCursor < roster.length - 1 ? 'Next person' : 'Review'}
        </button>
      </Frame>
    );
  }

  // ---- Step: review -------------------------------------------------------
  if (step === 'review') {
    const category = categorize(enrollments[0]!);
    return (
      <Frame
        step={4}
        of={4}
        title="Check this over"
        onBack={() => {
          if (isGroup) setRosterCursor(roster.length - 1);
          setStep('contacts');
        }}
      >
        <div className={styles.reviewBadge}>
          <strong>{categoryLabels[category].title}</strong>
          <span>{categoryLabels[category].description}</span>
        </div>

        <ul className={styles.review}>
          {enrollments.map((e) => (
            <li key={e.id}>
              <p className={styles.reviewName}>
                {e.student.name || <em>unnamed</em>}{' '}
                <span className={styles.reviewEmail}>{e.student.email}</span>
              </p>
              {e.contacts.length === 0 ? (
                <p className={styles.reviewNone}>No one is following their progress.</p>
              ) : (
                <ul className={styles.reviewContacts}>
                  {e.contacts.map((c) => (
                    <li key={c.id}>
                      <span className={styles.levelChip}>L{c.level}</span>
                      <span>
                        {c.name} · {c.email}
                      </span>
                      <span className={styles.reviewRole}>{contactRoleLabels[c.role]}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {problems.length > 0 ? (
          <div className={styles.problems} role="alert">
            <p>Fix these before continuing:</p>
            <ul>
              {problems.map((p, i) => (
                <li key={i}>
                  {enrollments.length > 1 ? `Person ${p.index + 1}: ` : ''}
                  {p.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className={styles.hint}>
          Everyone listed gets an inactivity alert if the learner goes quiet for 7 business days,
          whatever their level. That one is not optional — it is the safety net.
        </p>

        <button className="pr-btn pr-btn--volt" disabled={problems.length > 0} onClick={submit}>
          Complete registration
        </button>
      </Frame>
    );
  }

  // ---- Done ---------------------------------------------------------------
  return (
    <Frame step={4} of={4} title="Registration complete">
      <p className={styles.subhead}>
        {submitted?.count === 1
          ? 'One learner enrolled.'
          : `${submitted?.count} learners enrolled.`}{' '}
        Category: {submitted?.category}.
      </p>
      <p className={styles.hint}>
        This pilot build does not send email yet. The rules that decide who gets what, and when,
        are implemented and tested in <code>@promoted/core</code> — the transport is the part still
        to wire up. See <code>docs/product/MVP_SPEC.md</code>.
      </p>
      <a className="pr-btn pr-btn--volt" href="/learn/m1-r1">
        Start Rep 1.1
      </a>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// The shared contact-selection component. Built once, used by every branch.
// ---------------------------------------------------------------------------

function ContactPicker({
  entry,
  contacts,
  onChange,
  subjectLabel,
}: {
  entry: RegistrationEntry;
  contacts: Contact[];
  onChange: (next: Contact[]) => void;
  subjectLabel: string;
}) {
  const roles = allowedContactRoles(entry);
  const labels = (role: ContactRole) =>
    entry === 'self' && role !== 'registrant'
      ? selfContactRoleLabels[role as Exclude<ContactRole, 'registrant'>]
      : contactRoleLabels[role];

  const hasRole = (role: ContactRole) => contacts.some((c) => c.role === role);

  function toggle(role: ContactRole) {
    if (hasRole(role)) onChange(contacts.filter((c) => c.role !== role));
    else onChange([...contacts, { id: nextId(), name: '', email: '', role, level: 1 }]);
  }

  return (
    <>
      <div className={styles.roleGrid}>
        <button
          type="button"
          className={styles.roleBtn}
          data-selected={contacts.length === 0}
          onClick={() => onChange([])}
        >
          No one
        </button>
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            className={styles.roleBtn}
            data-selected={hasRole(role)}
            onClick={() => toggle(role)}
          >
            {labels(role)}
          </button>
        ))}
      </div>

      {contacts.length === 0 ? (
        <p className={styles.hint}>
          Nothing about {subjectLabel === 'you' ? 'your' : 'their'} progress will be shared with
          anyone. You can add someone later.
        </p>
      ) : null}

      {contacts.map((contact, i) => (
        <fieldset key={contact.id} className={styles.contactCard}>
          <legend>{labels(contact.role)}</legend>

          <Field
            label="Name"
            value={contact.name}
            onChange={(v) =>
              onChange(contacts.map((c, j) => (j === i ? { ...c, name: v } : c)))
            }
          />
          <Field
            label="Email"
            type="email"
            value={contact.email}
            onChange={(v) =>
              onChange(contacts.map((c, j) => (j === i ? { ...c, email: v } : c)))
            }
          />

          <p className={styles.levelLabel}>How much should they see?</p>
          <div className={styles.levelGrid}>
            {([1, 2, 3] as const).map((level) => (
              <button
                key={level}
                type="button"
                className={styles.levelBtn}
                data-selected={contact.level === level}
                onClick={() =>
                  onChange(
                    contacts.map((c, j) => (j === i ? { ...c, level: level as UpdateLevel } : c)),
                  )
                }
              >
                <span className={styles.levelBtnHead}>
                  Level {level} · {updateLevelSummary[level].name}
                </span>
                <span className={styles.levelBtnCadence}>{updateLevelSummary[level].cadence}</span>
                <span className={styles.levelBtnBody}>{updateLevelSummary[level].contents}</span>
              </button>
            ))}
          </div>
        </fieldset>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function Frame({
  step,
  of,
  title,
  badge,
  onBack,
  children,
}: {
  step: number;
  of: number;
  title: string;
  badge?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.frame}>
      <div className={styles.frameHead}>
        <span className="pr-eyebrow">
          Step {step} of {of}
        </span>
        {badge ? <span className={styles.badge}>{badge}</span> : null}
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.body}>{children}</div>
      {onBack ? (
        <button type="button" className={styles.backLink} onClick={onBack}>
          ← Back
        </button>
      ) : null}
    </div>
  );
}

function BigChoice({
  title,
  body,
  onClick,
}: {
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={styles.bigChoice} onClick={onClick}>
      <span className={styles.bigChoiceTitle}>{title}</span>
      <span className={styles.bigChoiceBody}>{body}</span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
