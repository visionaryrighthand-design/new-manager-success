import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ResizeMode, Video, type VideoProps } from 'expo-av';
import {
  estimateSectionTotalSeconds,
  feedCards,
  findSection,
  nextSection,
  type FeedCard,
  type QuizQuestion,
  type Section,
} from '@nms/content';
import { colors, radius, space, type } from '../../src/theme';
import { useProgress } from '../../src/progress-store';

/**
 * The lesson.
 *
 * A lesson is a video and then its quiz: the section script shot as one
 * continuous two-to-three minute piece, then the questions, then the next
 * lesson.
 *
 * Still a feed — full-screen cards, vertical paging, one thing on screen at a
 * time. That is the format, and it survives the content getting simpler.
 */

type Card = FeedCard;

/*
 * expo-av's Video is a class component typed against React 18. This workspace
 * resolves React 19 for the web app, npm hoists one copy of @types/react, and
 * the two Component signatures disagree about `refs`.
 *
 * It is a version skew in the type definitions, not an API mismatch: the
 * component itself is unchanged and works at runtime. Casting here rather than
 * pinning the whole tree to React 18, which would break the web app. Revisit
 * when the mobile app moves to expo-video, which is function-based.
 */
const VideoPlayer = Video as unknown as React.ComponentType<VideoProps & { ref?: unknown }>;

export default function SectionScreen() {
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();
  const section = sectionId ? findSection(sectionId) : undefined;

  if (!section) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>That section does not exist.</Text>
      </View>
    );
  }
  return <SectionFeed section={section} />;
}

function SectionFeed({ section }: { section: Section }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { progress, track, submitQuiz } = useProgress();

  const cards = useMemo(() => feedCards(section), [section]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const listRef = useRef<FlatList<Card>>(null);
  const quizSubmitted = useRef(false);

  // Opening a lesson is activity. The inactivity spec is explicit that it
  // counts, so it is recorded here rather than only on completion.
  useEffect(() => {
    track({ type: 'section-opened', sectionId: section.id });
  }, [section.id, track]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0];
    if (typeof first?.index === 'number') setIndex(first.index);
  }).current;

  const advance = useCallback(() => {
    if (index < cards.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }
  }, [index, cards.length]);

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
      track({ type: 'quiz-answered', sectionId: section.id, targetId: question.id, correct });
    },
    [answers, section.id, track],
  );

  // Score and complete once the learner reaches the summary card.
  useEffect(() => {
    const card = cards[index];
    if (card?.kind !== 'summary' || quizSubmitted.current) return;
    quizSubmitted.current = true;
    submitQuiz(
      section.id,
      section.quiz.map((q) => ({ questionId: q.id, optionId: answers[q.id] ?? '' })),
    );
    track({ type: 'section-completed', sectionId: section.id });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [index, cards, section, answers, submitQuiz, track]);

  const followUp = nextSection(section.id);
  const correctCount = section.quiz.filter(
    (q) => q.options.find((o) => o.id === answers[q.id])?.correct,
  ).length;

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
        renderItem={({ item, index: i }) => (
          <View
            style={[
              styles.page,
              { height, paddingTop: insets.top + 72, paddingBottom: insets.bottom + 96 },
            ]}
          >
            <CardView
              card={item}
              section={section}
              isActive={i === index}
              answers={answers}
              onChooseQuiz={onChooseQuiz}
              correctCount={correctCount}
              progressXp={progress.xp}
              onFinish={() => router.replace(followUp ? `/section/${followUp.id}` : '/')}
              finishLabel={followUp ? `Next section: ${followUp.number}` : 'Back to Module 1'}
            />
          </View>
        )}
      />

      {/* ---- Fixed chrome ------------------------------------------- */}
      <View
        style={[styles.topBar, { paddingTop: insets.top + space[2] }]}
        pointerEvents="box-none"
      >
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <View style={styles.segments}>
          {cards.map((card, i) => (
            <View
              key={card.key}
              style={[
                styles.segment,
                card.kind === 'video' && styles.segmentVideo,
                i < index && styles.segmentDone,
                i === index && styles.segmentNow,
              ]}
            />
          ))}
        </View>
        <Text style={styles.sectionTag}>{section.number}</Text>
      </View>

      {cards[index]?.kind !== 'summary' ? (
        <View
          style={[styles.bottomBar, { paddingBottom: insets.bottom + space[4] }]}
          pointerEvents="box-none"
        >
          <Pressable
            style={[styles.next, !canAdvance(cards[index], answers) && styles.nextDisabled]}
            disabled={!canAdvance(cards[index], answers)}
            onPress={advance}
          >
            <Text style={styles.nextText}>{nextLabel(cards[index])}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

/** The quiz gates; everything else is free to swipe past. */
function canAdvance(card: Card | undefined, answers: Record<string, string>): boolean {
  if (!card) return false;
  if (card.kind === 'quiz') return Boolean(answers[card.question.id]);
  return true;
}

function nextLabel(card: Card | undefined): string {
  if (card?.kind === 'video') return 'Take the quiz';
  if (card?.kind === 'quiz') return 'Next question';
  return 'Next';
}

// ---------------------------------------------------------------------------

interface CardViewProps {
  card: Card;
  section: Section;
  isActive: boolean;
  answers: Record<string, string>;
  onChooseQuiz: (question: QuizQuestion, optionId: string) => void;
  correctCount: number;
  progressXp: number;
  onFinish: () => void;
  finishLabel: string;
}

function CardView(props: CardViewProps) {
  const { card, section } = props;

  if (card.kind === 'sectionIntro') {
    return (
      <View style={styles.card}>
        <View style={styles.introRule} />
        <Text style={styles.introEyebrow}>
          SECTION {card.section.number} · {card.section.title.toUpperCase()}
        </Text>
        <Text style={styles.introHook}>{card.section.hook}</Text>
        <Text style={styles.introMeta}>
          {Math.max(1, Math.round(estimateSectionTotalSeconds(card.section) / 60))} min ·{' '}
          {card.section.quiz.length} questions
        </Text>
      </View>
    );
  }

  if (card.kind === 'video') {
    return <VideoCard section={card.section} isActive={props.isActive} />;
  }

  if (card.kind === 'quiz') {
    return (
      <QuizCard
        question={card.question}
        index={card.index}
        total={card.total}
        chosen={props.answers[card.question.id]}
        onChoose={(optionId) => props.onChooseQuiz(card.question, optionId)}
      />
    );
  }

  const total = section.quiz.length;
  const score = total === 0 ? 0 : Math.round((props.correctCount / total) * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.quizLabel}>SECTION {section.number} COMPLETE</Text>
      <Text style={styles.summaryScore}>
        {props.correctCount}
        <Text style={styles.summaryScoreTotal}>/{total}</Text>
      </Text>
      <Text style={styles.prompt}>
        {score >= 85 ? 'Locked in.' : 'Worth running back before you move on.'}
      </Text>
      <Text style={styles.body}>{section.keyIdea}</Text>
      <Text style={styles.xpLine}>{props.progressXp.toLocaleString()} XP total</Text>

      <Pressable style={styles.finish} onPress={props.onFinish}>
        <Text style={styles.finishText}>{props.finishLabel}</Text>
      </Pressable>
    </View>
  );
}

/**
 * The lesson video.
 *
 * Falls back to the script as a scrollable transcript until the film exists,
 * so a lesson with no footage is a lesson rather than an empty screen.
 */
function VideoCard({ section, isActive }: { section: Section; isActive: boolean }) {
  const ref = useRef<Video>(null);

  // Leaving the card stops the video. Two lessons talking at once is the
  // fastest way to make somebody close the app.
  useEffect(() => {
    if (isActive) return;
    void ref.current?.pauseAsync();
  }, [isActive]);

  const script = section.beats
    .flatMap((beat) => (beat.speech ? beat.speech.split('\n\n') : []))
    .map((para) => para.trim())
    .filter(Boolean);

  if (!section.videoUrl) {
    return (
      <View style={styles.card}>
        <Text style={styles.quizLabel}>SCRIPT · FILM NOT SHOT YET</Text>
        <Text style={styles.introHook}>{section.title}</Text>
        <ScrollView style={styles.transcript} contentContainerStyle={styles.transcriptInner}>
          {script.map((para, i) => (
            <Text key={i} style={styles.body}>
              {para}
            </Text>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <VideoPlayer
        ref={ref}
        style={styles.video}
        source={{ uri: section.videoUrl }}
        posterSource={section.posterUrl ? { uri: section.posterUrl } : undefined}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
      <Text style={styles.quizLabel}>SECTION {section.number}</Text>
      <Text style={styles.introHook}>{section.title}</Text>
    </View>
  );
}

function QuizCard({
  question,
  index,
  total,
  chosen,
  onChoose,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  chosen?: string;
  onChoose: (optionId: string) => void;
}) {
  const chosenOption = question.options.find((o) => o.id === chosen);

  return (
    <View style={styles.card}>
      <Text style={styles.quizLabel}>
        QUESTION {index + 1} OF {total}
      </Text>
      <Text style={styles.prompt}>{question.stem}</Text>

      {question.options.map((option, i) => {
        const isChosen = option.id === chosen;
        const revealed = Boolean(chosen);
        return (
          <Pressable
            key={option.id}
            style={[
              styles.option,
              isChosen && option.correct && styles.optionCorrect,
              isChosen && !option.correct && styles.optionIncorrect,
              revealed && !isChosen && option.correct && styles.optionRevealCorrect,
              revealed && !isChosen && !option.correct && styles.optionDimmed,
            ]}
            disabled={revealed}
            onPress={() => onChoose(option.id)}
          >
            <Text style={styles.optionKey}>{String.fromCharCode(65 + i)}</Text>
            <Text style={styles.optionText}>{option.text}</Text>
          </Pressable>
        );
      })}

      {chosenOption ? (
        <View
          style={[
            styles.response,
            chosenOption.correct ? styles.responseCorrect : styles.responseIncorrect,
          ]}
        >
          <Text style={styles.verdict}>
            {chosenOption.correct ? 'Locked in.' : 'Not yet. Worth another look.'}
          </Text>
          <Text style={styles.responseText}>{chosenOption.feedback}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  missing: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: { ...type.body, color: colors.fgMuted },

  page: { justifyContent: 'center', paddingHorizontal: space[5] },
  card: { gap: space[4] },

  // ---- Cold open ----------------------------------------------------------
  introRule: { width: 40, height: 2, borderRadius: 2, backgroundColor: colors.accent },
  introEyebrow: { ...type.label, color: colors.accentText },
  introHook: { ...type.h1, color: colors.fg },
  introMeta: { ...type.numeric, fontSize: 12, color: colors.fgSubtle },

  // ---- Video --------------------------------------------------------------
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  transcript: { maxHeight: 380 },
  transcriptInner: { gap: space[4] },

  // ---- Quiz ---------------------------------------------------------------
  quizLabel: { ...type.label, color: colors.accentText },
  prompt: { ...type.h2, color: colors.fg },
  body: { ...type.body, lineHeight: 27, color: colors.fgMuted },

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
  optionCorrect: { borderColor: colors.success },
  optionIncorrect: { borderColor: colors.danger },
  optionRevealCorrect: { borderColor: colors.success, opacity: 0.85 },
  optionDimmed: { opacity: 0.4 },
  optionKey: { ...type.numeric, color: colors.fgSubtle, fontSize: 12 },
  optionText: { ...type.caption, color: colors.fg, flex: 1, fontSize: 15, lineHeight: 21 },

  response: {
    padding: space[4],
    borderRadius: radius.md,
    borderLeftWidth: 3,
    backgroundColor: colors.surfaceRaised,
    gap: space[2],
  },
  responseCorrect: { borderLeftColor: colors.success },
  responseIncorrect: { borderLeftColor: colors.danger },
  verdict: { ...type.caption, color: colors.fg, fontWeight: '700' },
  responseText: { ...type.caption, color: colors.fgMuted },

  // ---- Summary ------------------------------------------------------------
  summaryScore: { ...type.moment, color: colors.bright },
  summaryScoreTotal: { ...type.h2, color: colors.fgSubtle },
  xpLine: { ...type.numeric, color: colors.fgSubtle, fontSize: 12 },
  finish: {
    marginTop: space[2],
    paddingVertical: space[4],
    borderRadius: radius.pill,
    backgroundColor: colors.bright,
    alignItems: 'center',
  },
  finishText: { ...type.bodyStrong, color: colors.onBright },

  // ---- Chrome -------------------------------------------------------------
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
  close: { padding: space[2] },
  closeText: { ...type.body, color: colors.fgMuted },
  segments: { flex: 1, flexDirection: 'row', gap: 3 },
  segment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.border },
  segmentVideo: { backgroundColor: colors.accent, opacity: 0.4 },
  segmentDone: { backgroundColor: colors.bright, opacity: 1 },
  segmentNow: { backgroundColor: colors.accent, opacity: 1 },
  sectionTag: { ...type.numeric, color: colors.fgSubtle, fontSize: 12 },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space[5],
  },
  next: {
    paddingVertical: space[4],
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  nextDisabled: { opacity: 0.35 },
  nextText: { ...type.bodyStrong, color: colors.onAccent },
});
