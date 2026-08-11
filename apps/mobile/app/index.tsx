import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { module01, estimateRepTotalSeconds } from '@nms/content';
import { moduleCompletionPercent, nextRepFor } from '@nms/core';
import { brand } from '@nms/brand';
import { colors, radius, space, type } from '../src/theme';
import { useProgress } from '../src/progress-store';
import { Mark } from '../src/components/Mark';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { progress, ready } = useProgress();

  const repIds = module01.reps.map((r) => r.id);
  const percent = moduleCompletionPercent(progress, repIds);
  const upNextId = nextRepFor(progress) ?? module01.reps[0]!.id;
  const upNext = module01.reps.find((r) => r.id === upNextId)!;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + space[5],
        paddingBottom: insets.bottom + space[10],
        paddingHorizontal: space[5],
      }}
    >
      <View style={styles.header}>
        <Mark size={30} />
        <View style={styles.wordmark}>
          <Text style={styles.wordmarkLine1}>{brand.wordmark.line1}</Text>
          <Text style={styles.wordmarkLine2}>{brand.wordmark.line2}</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>
            {progress.streak.current} day{progress.streak.current === 1 ? '' : 's'}
          </Text>
        </View>
      </View>

      <Text style={styles.xp}>{progress.xp.toLocaleString()} XP</Text>
      <Text style={styles.moduleLabel}>
        Module {module01.number} · {percent}% complete
      </Text>

      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${percent}%` }]} />
      </View>

      {progress.streak.atRisk ? (
        <View style={styles.riskBanner}>
          <Text style={styles.riskText}>
            Your {progress.streak.current}-day streak runs out tonight. One Rep keeps it.
          </Text>
        </View>
      ) : null}

      {/* Up next — the single most important control on this screen. */}
      <Link href={`/rep/${upNext.id}`} asChild>
        <Pressable style={styles.upNext}>
          <Text style={styles.upNextLabel}>
            {percent === 0 ? 'START HERE' : percent === 100 ? 'RUN IT BACK' : 'UP NEXT'}
          </Text>
          <Text style={styles.upNextNumber}>Rep {upNext.number}</Text>
          <Text style={styles.upNextTitle}>{upNext.title}</Text>
          <Text style={styles.upNextHook}>{upNext.hook}</Text>
          <View style={styles.upNextMeta}>
            <Text style={styles.upNextMetaText}>
              {Math.round(estimateRepTotalSeconds(upNext) / 60)} min
            </Text>
            <Text style={styles.upNextMetaText}>
              {upNext.curveballs.length} Curveball{upNext.curveballs.length === 1 ? '' : 's'}
            </Text>
          </View>
        </Pressable>
      </Link>

      <Text style={styles.sectionHeading}>{module01.title}</Text>
      <Text style={styles.sectionSub}>{module01.subtitle}</Text>

      {module01.reps.map((rep) => {
        const done = Boolean(progress.reps[rep.id]?.completedAt);
        const score = progress.reps[rep.id]?.bestScore;
        return (
          <Link key={rep.id} href={`/rep/${rep.id}`} asChild>
            <Pressable style={[styles.repRow, done && styles.repRowDone]}>
              <View style={[styles.repDot, done && styles.repDotDone]}>
                <Text style={[styles.repDotText, done && styles.repDotTextDone]}>
                  {done ? '✓' : rep.number.split('.')[1]}
                </Text>
              </View>
              <View style={styles.repBody}>
                <Text style={styles.repTitle}>{rep.title}</Text>
                <Text style={styles.repHook} numberOfLines={2}>
                  {rep.hook}
                </Text>
              </View>
              {score != null ? <Text style={styles.repScore}>{score}%</Text> : null}
            </Pressable>
          </Link>
        );
      })}

      <Text style={styles.footnote}>
        {ready
          ? 'Progress is stored on this device. Nothing is uploaded in the pilot build.'
          : 'Loading your progress…'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },

  header: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  wordmark: { flex: 1 },
  wordmarkLine1: { ...type.h3, color: colors.fg, fontWeight: '800', letterSpacing: 0 },
  // Tracked out so the two lines optically align to the same width, as in the lockup.
  wordmarkLine2: { ...type.caption, color: colors.accentText, fontWeight: '800', letterSpacing: 4.4 },
  streakPill: {
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakText: { ...type.caption, color: colors.alert, fontWeight: '700' },

  xp: { ...type.moment, color: colors.bright, marginTop: space[7] },
  moduleLabel: { ...type.caption, color: colors.fgMuted, marginTop: space[1] },

  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    marginTop: space[3],
    overflow: 'hidden',
  },
  trackFill: { height: '100%', backgroundColor: colors.bright, borderRadius: radius.pill },

  riskBanner: {
    marginTop: space[5],
    padding: space[4],
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.alert,
  },
  riskText: { ...type.caption, color: colors.fgMuted },

  upNext: {
    marginTop: space[7],
    padding: space[6],
    borderRadius: radius.xl,
    backgroundColor: colors.accent,
  },
  upNextLabel: { ...type.label, color: 'rgba(255,255,255,0.72)' },
  upNextNumber: { ...type.caption, color: 'rgba(255,255,255,0.72)', marginTop: space[3] },
  upNextTitle: { ...type.h2, color: colors.onAccent, marginTop: space[1] },
  upNextHook: { ...type.item, color: 'rgba(255,255,255,0.86)', marginTop: space[3] },
  upNextMeta: { flexDirection: 'row', gap: space[4], marginTop: space[5] },
  upNextMetaText: { ...type.caption, color: 'rgba(255,255,255,0.72)' },

  sectionHeading: { ...type.h2, color: colors.fg, marginTop: space[9] },
  sectionSub: { ...type.caption, color: colors.fgSubtle, marginBottom: space[5] },

  repRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    paddingVertical: space[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  repRowDone: { opacity: 0.62 },

  repDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  repDotDone: { backgroundColor: colors.bright, borderColor: colors.bright },
  repDotText: { ...type.numeric, color: colors.fgMuted },
  repDotTextDone: { color: colors.onBright, fontWeight: '700' },

  repBody: { flex: 1, gap: 2 },
  repTitle: { ...type.bodyStrong, color: colors.fg },
  repHook: { ...type.caption, color: colors.fgMuted },
  repScore: { ...type.numeric, color: colors.bright },

  footnote: { ...type.caption, color: colors.fgSubtle, marginTop: space[8] },
});
