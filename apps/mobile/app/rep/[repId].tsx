import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { estimateBeatSeconds, findRep, nextRep, splitListItem, splitMomentLines, type Beat, type Curveball, type CurveballVerdict, type QuizQuestion, type Rep } from '@nms/content';
import { colors, radius, space, type } from '../../src/theme';
import { useProgress } from '../../src/progress-store';

/**
 * The feed.
 *
 * A vertically paged FlatList — one full-screen card per beat, snapping like a
 * story. This is the TikTok half of the DNA and the reason the whole thing
 * exists: the locked scripts are already marked up with [AVATAR] / [BUILD LIST]
 * / [FULL SCREEN MOMENT] beats, which is a storyboard, so the feed renders that
 * storyboard directly rather than flattening it into a wall of text.
 *
 * Cards do not auto-advance. See the note in the web player: the goal is that a
 * specific idea lands, not time-on-app, and an idea that scrolls away on a
 * timer while a manager is thinking about their own team has failed.
 */

type Card =
  | { key: string; kind: 'beat'; beat: Beat }
  | { key: string; kind: 'curveball'; curveball: Curveball }
  | { key: string; kind: 'fieldNote' }
  | { key: string; kind: 'quiz'; question: QuizQuestion; index: number; total: number }
  | { key: string; kind: 'summary' };

export default function RepScreen() {
  const { repId } = useLocalSearchParams<{ repId: string }>();
  const rep = repId ? findRep(repId) : undefined;

  if (!rep) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>That Rep does not exist.</Text>
      </View>
    );
  }
  return <RepFeed rep={rep} />;
}

function RepFeed({ rep }: { rep: Rep }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { progress, track, submitQuiz } = useProgress();

  const cards = useMemo(() => buildCards(rep), [rep]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [fieldNote, setFieldNote] = useState('');
  const listRef = useRef<FlatList<Card>>(null);
  const quizSubmitted = useRef(false);

  // Opening a Rep is activity. The inactivity spec is explicit that it counts,
  // so it has to be recorded here rather than only on completion.
  useEffect(() => {
    track({ type: 'rep-opened', repId: rep.id });
  }, [rep.id, track]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0];
    if (typeof first?.index === 'number') setIndex(first.index);
  }).current;

  const advance = useCallback(() => {
    if (index < cards.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }
  }, [index, cards.length]);

  const onChooseCurveball = useCallback(
    (curveball: Curveball, choiceId: string) => {
      if (choices[curveball.id]) return;
      const verdict = curveball.choices.find((c) => c.id === choiceId)?.verdict;
      setChoices((c) => ({ ...c, [curveball.id]: choiceId }));
      void Haptics.notificationAsync(
        verdict === 'best'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning,
      );
      track({
        type: 'curveball-answered',
        repId: rep.id,
        targetId: curveball.id,
        ...(verdict ? { verdict } : {}),
      });
    },
    [choices, rep.id, track],
  );

  const onChooseQuiz = useCallback(
    (question: QuizQuestion, optionId: string) => {
      if (answers[question.id]) return;
      const correct = question.options.find((o) => o.id === optionId)?.correct ?? false;
      setAnswers((a) => ({ ...a, [question.id]: optionId }));
      void Haptics.notificationAsync(
        correct
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
      track({ type: 'quiz-answered', repId: rep.id, targetId: question.id, correct });
    },
    [answers, rep.id, track],
  );

  const saveFieldNote = useCallback(() => {
    if (!fieldNote.trim()) return;
    track({ type: 'field-note-saved', repId: rep.id, targetId: rep.fieldNote.id });
  }, [fieldNote, rep.id, rep.fieldNote.id, track]);

  // Score and complete once the learner reaches the summary card.
  useEffect(() => {
    const card = cards[index];
    if (card?.kind !== 'summary' || quizSubmitted.current) return;
    quizSubmitted.current = true;
    submitQuiz(
      rep.id,
      rep.quiz.map((q) => ({ questionId: q.id, optionId: answers[q.id] ?? '' })),
    );
    track({ type: 'rep-completed', repId: rep.id });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [index, cards, rep, answers, submitQuiz, track]);

  const followUp = nextRep(rep.id);

  return (
    <View style={styles.screen}>
      <FlatList
        ref={listRef}
        data={cards}
        keyExtractor={(card) => card.key}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={[styles.page, { height, paddingTop: insets.top + 72, paddingBottom: insets.bottom + 96 }]}>
            <CardView
              card={item}
              rep={rep}
              answers={answers}
              choices={choices}
              fieldNote={fieldNote}
              setFieldNote={setFieldNote}
              onBlurFieldNote={saveFieldNote}
              onChooseCurveball={onChooseCurveball}
              onChooseQuiz={onChooseQuiz}
              progressXp={progress.xp}
              onFinish={() => router.replace(followUp ? `/rep/${followUp.id}` : '/')}
              finishLabel={followUp ? `Next: Rep ${followUp.number}` : 'Back to Module 1'}
            />
          </View>
        )}
      />

      {/* ---- Fixed chrome ------------------------------------------- */}
      <View style={[styles.topBar, { paddingTop: insets.top + space[2] }]} pointerEvents="box-none">
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <View style={styles.segments}>
          {cards.map((card, i) => (
            <View
              key={card.key}
              style={[
                styles.segment,
                card.kind === 'curveball' && styles.segmentCurveball,
                i < index && styles.segmentDone,
                i === index && styles.segmentNow,
              ]}
            />
          ))}
        </View>
        <Text style={styles.repTag}>{rep.number}</Text>
      </View>

      {cards[index]?.kind !== 'summary' ? (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + space[4] }]} pointerEvents="box-none">
          <Pressable
            style={[styles.next, !canAdvance(cards[index], answers, choices) && styles.nextDisabled]}
            disabled={!canAdvance(cards[index], answers, choices)}
            onPress={advance}
          >
            <Text style={styles.nextText}>{nextLabel(cards[index])}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------

function buildCards(rep: Rep): Card[] {
  const cards: Card[] = [];
  for (const beat of rep.beats) {
    // A `hold` is a direction for the video edit. The feed already holds
    // indefinitely, because the learner controls the advance.
    if (beat.type !== 'hold') cards.push({ key: `b-${beat.id}`, kind: 'beat', beat });
    for (const curveball of rep.curveballs) {
      if (curveball.triggerAfterBeat === beat.id) {
        cards.push({ key: `c-${curveball.id}`, kind: 'curveball', curveball });
      }
    }
  }
  cards.push({ key: 'field-note', kind: 'fieldNote' });
  rep.quiz.forEach((question, i) =>
    cards.push({ key: `q-${question.id}`, kind: 'quiz', question, index: i, total: rep.quiz.length }),
  );
  cards.push({ key: 'summary', kind: 'summary' });
  return cards;
}

function canAdvance(
  card: Card | undefined,
  answers: Record<string, string>,
  choices: Record<string, string>,
): boolean {
  if (!card) return false;
  if (card.kind === 'quiz') return Boolean(answers[card.question.id]);
  if (card.kind === 'curveball') return Boolean(choices[card.curveball.id]);
  return true;
}

function nextLabel(card: Card | undefined): string {
  if (card?.kind === 'fieldNote') return 'Save and continue';
  if (card?.kind === 'quiz') return 'Next';
  if (card?.kind === 'curveball') return 'Continue';
  return 'Next';
}

const VERDICT_LABEL: Record<CurveballVerdict, string> = {
  best: 'Strongest call',
  workable: 'Workable',
  costly: 'This one costs you',
};

const VERDICT_COLOR: Record<CurveballVerdict, string> = {
  best: colors.success,
  workable: colors.warning,
  costly: colors.alert,
};

interface CardViewProps {
  card: Card;
  rep: Rep;
  answers: Record<string, string>;
  choices: Record<string, string>;
  fieldNote: string;
  setFieldNote: (v: string) => void;
  onBlurFieldNote: () => void;
  onChooseCurveball: (curveball: Curveball, choiceId: string) => void;
  onChooseQuiz: (question: QuizQuestion, optionId: string) => void;
  progressXp: number;
  onFinish: () => void;
  finishLabel: string;
}

function CardView(props: CardViewProps) {
  const { card, rep } = props;

  if (card.kind === 'beat') {
    const { beat } = card;

    if (beat.type === 'reading') {
      const paragraphs = beat.speech?.split('\n\n').filter(Boolean) ?? [];
      // The closing paragraph is the payoff; it is set apart rather than being
      // the fourth identical block of grey text. Mirrors the web player.
      const body = paragraphs.length > 1 ? paragraphs.slice(0, -1) : [];
      const kicker = paragraphs[paragraphs.length - 1];

      return (
        <View style={styles.card}>
          <View style={styles.readingRule} />
          {beat.text ? <Text style={styles.readingTitle}>{beat.text}</Text> : null}
          <Text style={styles.readingMeta}>{estimateBeatSeconds(beat)} SEC READ</Text>
          {body.map((para, i) => (
            <Text key={i} style={styles.readingBody}>
              {para}
            </Text>
          ))}
          {kicker ? <Text style={styles.readingKicker}>{kicker}</Text> : null}
        </View>
      );
    }

    if (beat.type === 'moment') {
      const lines = splitMomentLines(beat.text ?? '');
      return (
        <View style={styles.momentWrap}>
          <View style={styles.momentRule} />
          {lines.map((line, i) => (
            <Text
              key={i}
              // The last sentence is the one the learner is meant to keep.
              style={[
                styles.moment,
                i === lines.length - 1 ? styles.momentPunchline : styles.momentSetup,
              ]}
            >
              {line}
            </Text>
          ))}
        </View>
      );
    }

    if (beat.type === 'buildList') {
      return <BuildList items={beat.items ?? []} />;
    }

    return (
      <View style={styles.card}>
        {beat.type === 'overlay' && beat.text ? (
          <Text style={styles.overlay}>{beat.text}</Text>
        ) : null}
        {beat.speech?.split('\n\n').map((para, i) => (
          <Text key={i} style={styles.speech}>
            {para}
          </Text>
        ))}
      </View>
    );
  }

  if (card.kind === 'curveball') {
    const { curveball } = card;
    const chosenId = props.choices[curveball.id];
    const chosen = curveball.choices.find((c) => c.id === chosenId);

    return (
      <View style={styles.card}>
        <Text style={styles.curveballLabel}>CURVEBALL · {curveball.skill.toUpperCase()}</Text>
        <Text style={styles.scenario}>{curveball.scenario}</Text>
        <Text style={styles.prompt}>{curveball.prompt}</Text>

        {curveball.choices.map((choice, i) => {
          const isChosen = choice.id === chosenId;
          return (
            <Pressable
              key={choice.id}
              disabled={Boolean(chosenId)}
              onPress={() => props.onChooseCurveball(curveball, choice.id)}
              style={[
                styles.option,
                Boolean(chosenId) && !isChosen && styles.optionDimmed,
                isChosen && { borderColor: VERDICT_COLOR[choice.verdict] },
              ]}
            >
              <Text style={styles.optionKey}>{String.fromCharCode(65 + i)}</Text>
              <Text style={styles.optionText}>{choice.text}</Text>
            </Pressable>
          );
        })}

        {chosen ? (
          <View style={[styles.response, { borderLeftColor: VERDICT_COLOR[chosen.verdict] }]}>
            <Text style={styles.verdict}>{VERDICT_LABEL[chosen.verdict]}</Text>
            <Text style={styles.responseText}>{chosen.response}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  if (card.kind === 'fieldNote') {
    return (
      <View style={styles.card}>
        <Text style={styles.fieldNoteLabel}>
          FIELD NOTE · {rep.fieldNote.topic.toUpperCase()}
        </Text>
        <Text style={styles.prompt}>{rep.fieldNote.prompt}</Text>
        <TextInput
          style={styles.input}
          multiline
          value={props.fieldNote}
          onChangeText={props.setFieldNote}
          onBlur={props.onBlurFieldNote}
          placeholder={rep.fieldNote.placeholder}
          placeholderTextColor={colors.fgSubtle}
        />
        <Text style={styles.privacy}>
          If someone in your Corner is on Level 3, they get a question to ask you — never your
          actual words.
        </Text>
      </View>
    );
  }

  if (card.kind === 'quiz') {
    const { question } = card;
    const chosenId = props.answers[question.id];
    const chosen = question.options.find((o) => o.id === chosenId);

    return (
      <View style={styles.card}>
        <Text style={styles.quizLabel}>
          QUESTION {card.index + 1} OF {card.total} · FROM {question.source}
        </Text>
        <Text style={styles.prompt}>{question.stem}</Text>

        {question.options.map((option, i) => {
          const isChosen = option.id === chosenId;
          const revealed = Boolean(chosenId);
          const borderColor = !revealed
            ? colors.border
            : option.correct
              ? colors.success
              : isChosen
                ? colors.danger
                : colors.border;
          return (
            <Pressable
              key={option.id}
              disabled={revealed}
              onPress={() => props.onChooseQuiz(question, option.id)}
              style={[
                styles.option,
                { borderColor },
                revealed && !isChosen && !option.correct && styles.optionDimmed,
              ]}
            >
              <Text style={styles.optionKey}>{String.fromCharCode(65 + i)}</Text>
              <Text style={styles.optionText}>{option.text}</Text>
            </Pressable>
          );
        })}

        {chosen ? (
          <View
            style={[
              styles.response,
              { borderLeftColor: chosen.correct ? colors.success : colors.danger },
            ]}
          >
            <Text style={styles.verdict}>
              {chosen.correct ? 'Locked in.' : 'Not yet — worth another look.'}
            </Text>
            <Text style={styles.responseText}>{chosen.feedback}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  // Summary
  const correct = rep.quiz.filter(
    (q) => q.options.find((o) => o.id === props.answers[q.id])?.correct,
  ).length;

  return (
    <View style={styles.card}>
      <Text style={styles.quizLabel}>REP {rep.number} COMPLETE</Text>
      <Text style={styles.score}>
        {correct}
        <Text style={styles.scoreTotal}>/{rep.quiz.length}</Text>
      </Text>
      <Text style={styles.prompt}>{rep.keyIdea}</Text>
      <Text style={styles.xpLine}>{props.progressXp.toLocaleString()} XP total</Text>

      <Pressable style={styles.finish} onPress={props.onFinish}>
        <Text style={styles.finishText}>{props.finishLabel}</Text>
      </Pressable>
    </View>
  );
}

/**
 * The build-list card.
 *
 * The script direction is "items build on screen one by one", so they do —
 * each on its own panel, numbered, on a stagger. The colon-prefixed label the
 * scripts already use ("Myth #1:", "Level 2:") is pulled out and set as an
 * eyebrow; see splitListItem in @nms/content, which the web player shares so
 * the two cannot drift.
 */
function BuildList({ items }: { items: string[] }) {
  // Module 1's lists run from three items to seven. A feed page cannot scroll,
  // so past four the card tightens rather than running off the bottom.
  const dense = items.length >= 5;
  const [reduceMotion, setReduceMotion] = useState(false);
  // One driver per item, so they can be staggered rather than fading as a block.
  const anim = useRef(items.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((on) => {
      if (cancelled) return;
      if (on) {
        setReduceMotion(true);
        anim.forEach((v) => v.setValue(1));
        return;
      }
      Animated.stagger(
        160,
        anim.map((v) =>
          Animated.timing(v, {
            toValue: 1,
            duration: 320,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ),
      ).start();
    });
    return () => {
      cancelled = true;
    };
  }, [anim]);

  return (
    <View style={styles.card}>
      {items.map((item, i) => {
        const { label, body, quoted } = splitListItem(item);
        return (
          <Animated.View
            key={i}
            style={[
              styles.listItem,
              dense ? styles.listItemDense : null,
              {
                opacity: anim[i],
                transform: reduceMotion
                  ? []
                  : [{ translateY: anim[i].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
              },
            ]}
          >
            <View style={styles.listRule} />
            <Text style={styles.listOrdinal}>{String(i + 1).padStart(2, '0')}</Text>
            <View style={styles.listContent}>
              {label ? <Text style={styles.listLabel}>{label.toUpperCase()}</Text> : null}
              <Text
                style={[
                  styles.listText,
                  dense ? styles.listTextDense : null,
                  quoted ? styles.listTextQuoted : null,
                ]}
              >
                {/* The quote marks live here rather than in the string, so the
                    script text stays verbatim and they can take the accent. */}
                {quoted ? <Text style={styles.listQuoteMark}>{'“'}</Text> : null}
                {body}
                {quoted ? <Text style={styles.listQuoteMark}>{'”'}</Text> : null}
              </Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  missing: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  missingText: { ...type.body, color: colors.fgMuted },

  page: { justifyContent: 'center', paddingHorizontal: space[5] },
  card: { gap: space[4] },

  speech: { ...type.body, color: colors.fg, opacity: 0.9 },
  overlay: {
    ...type.h2,
    color: colors.bright,
    borderLeftWidth: 3,
    borderLeftColor: colors.bright,
    paddingLeft: space[4],
  },

  readingRule: { width: 40, height: 2, borderRadius: 2, backgroundColor: colors.accent },
  readingTitle: { ...type.h1, color: colors.fg },
  readingMeta: { ...type.label, color: colors.fgSubtle },
  readingBody: { ...type.body, lineHeight: 27, color: colors.fgMuted },
  readingKicker: {
    ...type.h3,
    color: colors.fg,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    paddingLeft: space[4],
    marginTop: space[1],
  },

  momentWrap: { alignItems: 'center', justifyContent: 'center', gap: space[4] },
  momentRule: {
    width: 56,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginBottom: space[2],
  },
  moment: { ...type.moment, color: colors.fg, textAlign: 'center' },
  /* Contrast rather than size: two type sizes in one thought reads as a mistake. */
  momentSetup: { color: colors.fgMuted },
  momentPunchline: { color: colors.fg },

  listItem: {
    position: 'relative',
    flexDirection: 'row',
    gap: space[4],
    alignItems: 'flex-start',
    paddingVertical: space[4],
    paddingRight: space[5],
    paddingLeft: space[5],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    overflow: 'hidden',
  },
  listRule: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: colors.accent },
  listOrdinal: { ...type.numeric, fontSize: 12, lineHeight: 16, color: colors.accent },
  listContent: { flex: 1, gap: space[2] },
  listLabel: { ...type.label, color: colors.bright },
  listText: { ...type.item, fontSize: 17, lineHeight: 24, fontWeight: '600', color: colors.fg },
  listItemDense: { paddingVertical: space[3] },
  listTextDense: { fontSize: 15, lineHeight: 21 },
  listTextQuoted: { fontStyle: 'italic' },
  listQuoteMark: { color: colors.accent, fontStyle: 'normal', fontWeight: '800' },

  curveballLabel: { ...type.label, color: colors.alert },
  quizLabel: { ...type.label, color: colors.accent },
  fieldNoteLabel: { ...type.label, color: colors.bright },

  scenario: { ...type.item, color: colors.fgMuted },
  prompt: { ...type.h2, color: colors.fg },

  option: {
    flexDirection: 'row',
    gap: space[3],
    alignItems: 'flex-start',
    padding: space[4],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionDimmed: { opacity: 0.4 },
  optionKey: { ...type.numeric, color: colors.fgSubtle, fontSize: 12 },
  optionText: { ...type.caption, color: colors.fg, flex: 1, fontSize: 15, lineHeight: 21 },

  response: {
    padding: space[4],
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderLeftWidth: 3,
    gap: space[2],
  },
  verdict: { ...type.caption, color: colors.fg, fontWeight: '700' },
  responseText: { ...type.caption, color: colors.fgMuted },

  input: {
    minHeight: 130,
    padding: space[4],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.fg,
    ...type.body,
    textAlignVertical: 'top',
  },
  privacy: { ...type.caption, color: colors.fgSubtle, fontSize: 13 },

  score: { ...type.moment, color: colors.bright, fontSize: 56, lineHeight: 60 },
  scoreTotal: { ...type.h2, color: colors.fgSubtle },
  xpLine: { ...type.numeric, color: colors.fgMuted },

  finish: {
    marginTop: space[4],
    paddingVertical: space[4],
    paddingHorizontal: space[6],
    borderRadius: radius.pill,
    backgroundColor: colors.bright,
    alignItems: 'center',
  },
  finishText: { ...type.bodyStrong, color: colors.onBright },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[5],
    paddingBottom: space[3],
  },
  close: { padding: space[1] },
  closeText: { color: colors.fgMuted, fontSize: 18 },
  repTag: { ...type.numeric, color: colors.fgSubtle, fontSize: 12 },

  segments: { flex: 1, flexDirection: 'row', gap: 3 },
  segment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.border },
  segmentCurveball: { backgroundColor: colors.alert, opacity: 0.35 },
  segmentDone: { backgroundColor: colors.bright, opacity: 1 },
  segmentNow: { backgroundColor: colors.accent, opacity: 1 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: space[5],
    alignItems: 'flex-end',
  },
  next: {
    paddingVertical: space[4],
    paddingHorizontal: space[7],
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  nextDisabled: { opacity: 0.35 },
  nextText: { ...type.bodyStrong, color: colors.onAccent },
});
