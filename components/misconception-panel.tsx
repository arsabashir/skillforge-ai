import type { MisconceptionFingerprint } from "@/lib/misconceptions";

export function MisconceptionPanel({ fingerprints }: { fingerprints: MisconceptionFingerprint[] }) {
  if (fingerprints.length === 0) return null;
  return <section className="misconception-panel"><p className="eyebrow">Misconception fingerprint</p><h2>Prioritised repair signals</h2><p>These are not just wrong answers: they are concepts answered with high confidence, so SkillForge prioritises them for repair.</p><ul>{fingerprints.map((item) => <li key={`${item.moduleId}-${item.concept}`}><strong>{item.concept}</strong><span>{item.message}</span></li>)}</ul></section>;
}
