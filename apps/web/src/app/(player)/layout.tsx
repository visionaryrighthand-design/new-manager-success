/**
 * Player surface: no header, no footer, no exits except the ones the player
 * puts there itself. The feed is the whole viewport.
 */
export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return <main id="main">{children}</main>;
}
