/**
 * Registration model — a direct encoding of the flowchart in
 * "Registration & Progress Communications" / "Onboarding Workflow —
 * Developer Reference".
 *
 * The single most important line in that spec:
 *
 *   "'someone else / one person' and the per-student loop inside 'group' use
 *    the identical contact-selection component — only the entry point differs.
 *    Build it once, reuse it in both places."
 *
 * So `ContactSelection` below is one type used in all three branches, and
 * `Enrollment` is one shape regardless of how registration started. The entry
 * point is recorded as data, not expressed as three different structures.
 */
export {};
//# sourceMappingURL=types.js.map