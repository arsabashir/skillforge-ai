import type { MasteryNode } from "@/lib/mastery";

const statusLabel = { not_assessed: "Not assessed", learning: "Learning", struggling: "Needs repair", mastered: "Mastered" };

export function MasteryMap({ nodes }: { nodes: MasteryNode[] }) {
  return (
    <section className="mastery-map" aria-label="Concept mastery map">
      <div className="mastery-heading"><div><p className="eyebrow">Adaptive engine</p><h2>Your mastery map</h2></div><p>Each quiz changes the status of the concepts it tests. SkillForge recommends repair before moving on.</p></div>
      <div className="mastery-legend">{Object.entries(statusLabel).map(([status, label]) => <span key={status}><i className={`mastery-dot ${status}`} />{label}</span>)}</div>
      <ol className="mastery-nodes">
        {nodes.map((node, index) => <li key={node.id} className={`mastery-node ${node.status}`}>
          <span className="mastery-step">{index + 1}</span><div><strong>{node.concept}</strong><small>{statusLabel[node.status]}{node.evidenceCount > 0 ? ` · ${node.evidenceCount} quiz signal${node.evidenceCount > 1 ? "s" : ""}` : ""}</small></div>
        </li>)}
      </ol>
    </section>
  );
}
