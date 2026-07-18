"use client";

import { useState } from "react";
import type { MasteryNode } from "@/lib/mastery";

export function RepairChallenge({ concept, onComplete }: { concept: MasteryNode; onComplete: () => void }) {
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="repair-challenge" aria-label={`Repair challenge for ${concept.concept}`}>
      <p className="eyebrow">Recommended repair</p>
      <h3>Prove the idea in your own words</h3>
      <p>You have missed evidence connected to <strong>{concept.concept}</strong>. Explain what it means, when you would use it, and one common mistake to avoid.</p>
      {!submitted ? <><textarea value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Write your explanation here..." minLength={30} /><button type="button" disabled={response.trim().length < 30} onClick={() => { setSubmitted(true); onComplete(); }}>Submit explanation</button></> : <p className="repair-success">Great. This concept is now marked as learning. Take the module quiz again to demonstrate mastery.</p>}
    </section>
  );
}
