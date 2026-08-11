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
import { Audio } from 'expo-av';
import {
  estimateBeatSeconds,
  feedCards,
  findRep,
  nextRep,
  fieldNotePrompt,
  splitListItem,
  splitMomentLines,
  type Beat,
  type Curveball,
  type CurveballVerdict,
  type FeedCard,
  type GutCheck,
  type QuizQuestion,
  type Rep,
} from '@nms/content';
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

type Card = FeedCard;

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

  const cards = useMemo(() => feedCards(rep), [rep]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [fieldNote, setFieldNote] = useState('');
  // Audio stays off until the learner starts a card themselves, then follows
  // them down the feed. Same contract as the web player.
  const [soundOn, setSoundOn] = useState(false);
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

  // A Gut Check is not scored and nothing depends on the answer, so it shares
  // the Curveball's choice map and records no progress event. It exists to
  // break up a run of reading, not to assess anything.
  const onChooseGutCheck = useCallback(
    (gutCheck: GutCheck, choiceId: string) => {
      setChoices((c) => (c[gutCheck.id] ? c : { ...c, [gutCheck.id]: choiceId }));
      void Haptics.selectionAsync();
    },
    [],
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
        renderItem={({ item, index: i }) => (
          <View style={[styles.page, { height, paddingTop: insets.top + 72, paddingBottom: insets.bottom + 96 }]}>
            <CardView
              card={item}
              rep={rep}
              isActive={i === index}
              soundOn={soundOn}
              onSoundOn={() => setSoundOn(true)}
              answers={answers}
              choices={choices}
              fieldNote={fieldNote}
              setFieldNote={setFieldNote}
              onBlurFieldNote={saveFieldNote}
              onChooseCurveball={onChooseCurveball}
              onChooseGutCheck={onChooseGutCheck}
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
                card.kind === 'gutCheck' && styles.segmentGutCheck,
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

function canAdvance(
  card: Card | undefined,
  answers: Record<string, string>,
  choices: Record<string, string>,
): boolean {
  if (!card) return false;
  if (card.kind === 'quiz') return Boolean(answers[card.question.id]);
  if (card.kind === 'curveball') return Boolean(choices[card.curveball.id]);
  if (card.kind === 'gutCheck') return Boolean(choices[card.gutCheck.id]);
  return true;
}

function nextLabel(card: Card | undefined): string {
  if (card?.kind === 'fieldNote') return 'Save and continue';
  if (card?.kind === 'quiz') return 'Next';
  if (card?.kind === 'curveball' || card?.kind === 'gutCheck') return 'Continue';
  return 'Next';
}


/**
 * A Gut Check.
 *
 * Deliberately small: one line, a few options, one line back. If it wore a
 * Curveball's weight the learner would brace for one every time it appeared,
 * and the point is to interrupt a run of reading without costing anything.
 *
 * No verdict colours — there is no wrong answer to a question about the
 * learner's own experience.
 */
function GutCheckCard({
  gutCheck,
  chosen,
  onChoose,
}: {
  gutCheck: GutCheck;
  chosen?: string;
  onChoose: (choiceId: string) => void;
}) {
  const chosenChoice = gutCheck.choices.find((c) => c.id === chosen);

  return (
    <View style={styles.card}>
      <Text style={styles.gutCheckLabel}>GUT CHECK</Text>
      <Text style={styles.gutCheckPrompt}>{gutCheck.prompt}</Text>

      {gutCheck.choices.map((choice) => {
        const isChosen = choice.id === chosen;
        return (
          <Pressable
            key={choice.id}
            style={[
              styles.option,
              styles.gutCheckOption,
              isChosen && styles.gutCheckOptionChosen,
              Boolean(chosen) && !isChosen && styles.optionDimmed,
            ]}
            disabled={Boolean(chosen)}
            onPress={() => onChoose(choice.id)}
          >
            <Text style={styles.optionText}>{choice.text}</Text>
          </Pressable>
        );
      })}

      {chosenChoice ? <Text style={styles.gutCheckReaction}>{chosenChoice.reaction}</Text> : null}
    </View>
  );
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
  onChooseGutCheck: (gutCheck: GutCheck, choiceId: string) => void;
  onChooseQuiz: (question: QuizQuestion, optionId: string) => void;
  progressXp: number;
  onFinish: () => void;
  finishLabel: string;
  isActive: boolean;
  soundOn: boolean;
  onSoundOn: () => void;
}

function CardView(props: CardViewProps) {
  const { card, rep } = props;

  if (card.kind === 'beat') {
    const { beat } = card;

    if (beat.type === 'reading' || beat.type === 'overlay' || beat.type === 'avatar') {
      return (
        <ProseCard
          beat={beat}
          isActive={props.isActive}
          soundOn={props.soundOn}
          onSoundOn={props.onSoundOn}
        />
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
      return (
        <View style={styles.card}>
          <BuildList items={beat.items ?? []} />
          <Voiceover beat={beat} isActive={props.isActive} soundOn={props.soundOn} onSoundOn={props.onSoundOn} />
        </View>
      );
    }

    return (
      <View style={styles.card}>
        {beat.speech?.split('\n\n').map((para, i) => (
          <Text key={i} style={styles.speech}>
            {para}
          </Text>
        ))}
      </View>
    );
  }

  if (card.kind === 'gutCheck') {
    return (
      <GutCheckCard
        gutCheck={card.gutCheck}
        chosen={props.choices[card.gutCheck.id]}
        onChoose={(choiceId) => props.onChooseGutCheck(card.gutCheck, choiceId)}
      />
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
    // The Curveball answer comes back here. See fieldNotePrompt in @nms/content.
    const { prompt, placeholder, followedUp } = fieldNotePrompt(rep, props.choices);
    return (
      <View style={styles.card}>
        <Text style={styles.fieldNoteLabel}>
          FIELD NOTE · {followedUp ? 'YOUR CALL, REVISITED' : rep.fieldNote.topic.toUpperCase()}
        </Text>
        <Text style={styles.prompt}>{prompt}</Text>
        <TextInput
          style={styles.input}
          multiline
          value={props.fieldNote}
          onChangeText={props.setFieldNote}
          onBlur={props.onBlurFieldNote}
          placeholder={placeholder}
          placeholderTextColor={colors.fgSubtle}
        />
        <Text style={styles.privacy}>
          If someone in your Corner is on Level 3, they get a question to ask you, never your
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
 * Voiceover for one beat.
 *
 * Renders nothing when the beat has no audio, which is every beat until a
 * recording is wired in — the card is the product and this rides on top.
 *
 * The visible card's audio plays automatically, but only after the learner has
 * pressed play once. Unlike the web, native could autoplay from the first
 * card; it does not, because a lesson that starts talking the moment it opens
 * is the behaviour people mute an app for.
 */
function Voiceover({ beat, isActive, soundOn, onSoundOn }: BeatCardProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pct, setPct] = useState(0);
  const [remaining, setRemaining] = useState(estimateBeatSeconds(beat));

  const url = beat.audioUrl;

  // Load on mount, unload on unmount. The feed keeps a handful of pages alive
  // at a time, so leaving sounds loaded would stack them up over a Rep.
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    void (async () => {
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: false });
      if (cancelled) {
        void sound.unloadAsync();
        return;
      }
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setPlaying(status.isPlaying);
        const total = status.durationMillis ?? 0;
        if (total > 0) {
          setPct((status.positionMillis / total) * 100);
          setRemaining(Math.max(0, Math.round((total - status.positionMillis) / 1000)));
        }
        if (status.didJustFinish) setPlaying(false);
      });
    })();
    return () => {
      cancelled = true;
      void soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;
    if (isActive && soundOn) void sound.playAsync();
    else if (isActive) void sound.pauseAsync();
    else void sound.stopAsync();
  }, [isActive, soundOn]);

  if (!url) return null;

  const toggle = () => {
    const sound = soundRef.current;
    if (!sound) return;
    if (playing) {
      void sound.pauseAsync();
    } else {
      onSoundOn();
      void sound.playAsync();
    }
  };

  return (
    <View style={styles.voiceover}>
      <Pressable style={styles.voiceoverBtn} onPress={toggle} hitSlop={8}>
        <Text style={styles.voiceoverIcon}>{playing ? '❙❙' : '▶'}</Text>
      </Pressable>
      <View style={styles.voiceoverTrack}>
        <View style={[styles.voiceoverFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.voiceoverTime}>
        {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
      </Text>
    </View>
  );
}

interface BeatCardProps {
  beat: Beat;
  isActive: boolean;
  soundOn: boolean;
  onSoundOn: () => void;
}

/**
 * Every card that is mostly words: `avatar`, `overlay`, `reading`.
 *
 * They differ in production, not in reading — one has a voiceover, one has a
 * title over the top of it, one is silent by design — so they share a shape:
 *
 *   anchor   the title where the beat has one, otherwise the opening paragraph
 *   body     the middle
 *   kicker   the closing paragraph, set apart at full contrast
 *
 * That structure is not imposed on the copy; the scripts are already written
 * that way. Mirrors ProseCard in the web player.
 */
function ProseCard({ beat, isActive, soundOn, onSoundOn }: BeatCardProps) {
  const paragraphs = (beat.speech ?? '').split('\n\n').map((p) => p.trim()).filter(Boolean);
  const title = beat.text;
  const lede = title ? undefined : paragraphs[0];
  const rest = title ? paragraphs : paragraphs.slice(1);
  const kicker = rest.length > 0 ? rest[rest.length - 1] : undefined;
  const body = rest.slice(0, -1);

  return (
    <View style={styles.card}>
      <View style={styles.readingRule} />
      {title ? <Text style={styles.readingTitle}>{title}</Text> : null}
      {lede ? <Text style={styles.readingLede}>{lede}</Text> : null}
      {beat.type === 'reading' && !beat.audioUrl ? (
        <Text style={styles.readingMeta}>{estimateBeatSeconds(beat)} SEC READ</Text>
      ) : null}
      <Voiceover beat={beat} isActive={isActive} soundOn={soundOn} onSoundOn={onSoundOn} />
      {body.map((para, i) => (
        <Text key={i} style={styles.readingBody}>
          {para}
        </Text>
      ))}
      {kicker ? <Text style={styles.readingKicker}>{kicker}</Text> : null}
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
    <View style={styles.buildList}>
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
  readingLede: { ...type.h2, color: colors.fg },
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
  listOrdinal: { ...type.numeric, fontSize: 12, lineHeight: 16, color: colors.accentText },
  listContent: { flex: 1, gap: space[2] },
  listLabel: { ...type.label, color: colors.bright },
  listText: { ...type.item, fontSize: 17, lineHeight: 24, fontWeight: '600', color: colors.fg },
  buildList: { gap: space[3] },
  listItemDense: { paddingVertical: space[3] },
  listTextDense: { fontSize: 15, lineHeight: 21 },
  listTextQuoted: { fontStyle: 'italic' },
  listQuoteMark: { color: colors.accentText, fontStyle: 'normal', fontWeight: '800' },

  voiceover: { flexDirection: 'row', alignItems: 'center', gap: space[3], marginVertical: space[2] },
  voiceoverBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  voiceoverIcon: { color: colors.onAccent, fontSize: 11 },
  voiceoverTrack: { flex: 1, height: 2, borderRadius: 2, backgroundColor: colors.border, overflow: 'hidden' },
  voiceoverFill: { height: '100%', backgroundColor: colors.accent },
  voiceoverTime: { ...type.numeric, fontSize: 11, color: colors.fgSubtle },

  curveballLabel: { ...type.label, color: colors.alert },
  quizLabel: { ...type.label, color: colors.accentText },
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

  gutCheckLabel: { ...type.label, color: colors.bright },
  gutCheckPrompt: { ...type.h3, color: colors.fg, fontWeight: '700' },
  gutCheckOption: { borderRadius: radius.pill, paddingVertical: space[3] },
  /* No verdict colour: there is no wrong answer to a question about your own
     experience, and grading one would be a lie. */
  gutCheckOptionChosen: { borderColor: colors.bright },
  gutCheckReaction: {
    ...type.item,
    color: colors.fgMuted,
    borderLeftWidth: 2,
    borderLeftColor: colors.bright,
    paddingLeft: space[4],
  },
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
  segmentGutCheck: { backgroundColor: colors.bright, opacity: 0.35 },
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
