import { useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowDownRight, GitBranch, Play, RotateCcw, Shield, Zap } from "lucide-react";
import { NetworkGraph } from "./components/NetworkGraph";
import { demoSystem, initialEvent } from "./data/demoSystem";
import { simulate } from "./engine/simulate";
import type { EventKind, HypotheticalEvent } from "./types/simulation";

function App() {
  const [sourceNodeId, setSourceNodeId] = useState(initialEvent.sourceNodeId);
  const [eventKind, setEventKind] = useState<EventKind>(initialEvent.kind);
  const [initialImpact, setInitialImpact] = useState(initialEvent.initialImpact);
  const [decay, setDecay] = useState(initialEvent.decay);
  const [result, setResult] = useState(() => simulate(demoSystem, initialEvent));
  const [selectedNodeId, setSelectedNodeId] = useState(initialEvent.sourceNodeId);
  const [hasRun, setHasRun] = useState(true);

  const selectedNode = demoSystem.nodes.find((node) => node.id === selectedNodeId)!;
  const rankedImpacts = useMemo(
    () => result ? Object.values(result.impacts).sort((a, b) => b.score - a.score) : [],
    [result]
  );

  function runSimulation() {
    const event: HypotheticalEvent = {
      id: `scenario-${Date.now()}`,
      title: `${eventKind.toUpperCase()} at ${demoSystem.nodes.find((node) => node.id === sourceNodeId)?.label}`,
      kind: eventKind,
      sourceNodeId,
      initialImpact,
      decay,
      description: "User-defined hypothetical event."
    };
    setResult(simulate(demoSystem, event));
    setSelectedNodeId(sourceNodeId);
    setHasRun(true);
  }

  function resetSimulation() {
    setSourceNodeId(initialEvent.sourceNodeId);
    setEventKind(initialEvent.kind);
    setInitialImpact(initialEvent.initialImpact);
    setDecay(initialEvent.decay);
    setResult(simulate(demoSystem, initialEvent));
    setSelectedNodeId(initialEvent.sourceNodeId);
    setHasRun(true);
  }

  const sourceLabel = demoSystem.nodes.find((node) => node.id === result.event.sourceNodeId)?.label ?? "UNKNOWN";

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="AFTERSHOCK home">
          <span className="brand-mark"><Activity size={19} /></span>
          <span>AFTERSHOCK<span className="brand-slash"> //</span></span>
        </a>
        <div className="topbar-center"><span className="live-dot" /> LOCAL SIMULATION ENVIRONMENT</div>
        <div className="topbar-right"><span className="version">ENGINE 0.1.0</span><span className="avatar">AS</span></div>
      </header>

      <section className="intro">
        <div>
          <div className="eyebrow">COUNTERFACTUAL SYSTEMS SIMULATION <span> / 001</span></div>
          <h1>Explore the consequences<br /><em>before they happen.</em></h1>
          <p className="intro-copy">Introduce a hypothetical event. Trace its propagation. Inspect the systems it could affect.</p>
        </div>
        <div className="intro-stamp"><span>AFTERSHOCK</span><strong>SIMULATION<br />LABORATORY</strong><small>READ-ONLY / SANDBOX</small></div>
      </section>

      <section className="metrics-grid" aria-label="Simulation metrics">
        <Metric icon={<GitBranch size={16} />} label="SYSTEM COMPONENTS" value={String(demoSystem.nodes.length).padStart(2, "0")} detail="CONNECTED NODES" />
        <Metric icon={<Zap size={16} />} label="DEPENDENCY LINKS" value={String(demoSystem.edges.length).padStart(2, "0")} detail="DIRECTED EDGES" />
        <Metric icon={<AlertTriangle size={16} />} label="AFFECTED COMPONENTS" value={String(result.affectedNodeIds.length).padStart(2, "0")} detail="DOWNSTREAM EXPOSURE" danger />
        <Metric icon={<Activity size={16} />} label="AGGREGATE IMPACT" value={result.totalImpact.toFixed(1)} detail="RELATIVE SCORE / 100" />
      </section>

      <div className="workspace">
        <aside className="control-panel panel">
          <div className="panel-heading"><div><span className="section-index">01 / SCENARIO</span><h2>Event configuration</h2></div><span className="panel-icon"><Zap size={16} /></span></div>
          <p className="panel-description">Define a hypothetical disruption and observe how it propagates through the reference system.</p>

          <label className="field-label" htmlFor="event-kind">EVENT TYPE</label>
          <select id="event-kind" value={eventKind} onChange={(e) => setEventKind(e.target.value as EventKind)}>
            <option value="outage">Service outage</option>
            <option value="degradation">Performance degradation</option>
            <option value="delay">Process delay</option>
          </select>

          <label className="field-label" htmlFor="source-node">ORIGIN COMPONENT</label>
          <select id="source-node" value={sourceNodeId} onChange={(e) => setSourceNodeId(e.target.value)}>
            {demoSystem.nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
          </select>

          <div className="range-heading"><label className="field-label" htmlFor="impact">INITIAL IMPACT</label><output>{initialImpact}<small> / 100</small></output></div>
          <input id="impact" type="range" min="10" max="100" step="5" value={initialImpact} onChange={(e) => setInitialImpact(Number(e.target.value))} />

          <div className="range-heading"><label className="field-label" htmlFor="decay">PROPAGATION DECAY</label><output>{Math.round(decay * 100)}<small>%</small></output></div>
          <input id="decay" type="range" min="20" max="100" step="4" value={Math.round(decay * 100)} onChange={(e) => setDecay(Number(e.target.value) / 100)} />
          <p className="helper-text">Lower decay reduces impact as it moves across each dependency.</p>

          <button className="primary-button" onClick={runSimulation}><Play size={15} fill="currentColor" /> RUN SIMULATION</button>
          <button className="secondary-button" onClick={resetSimulation}><RotateCcw size={14} /> RESET TO BASELINE SCENARIO</button>

          <div className="sandbox-note"><Shield size={15} /><span><strong>ISOLATED SANDBOX</strong><br />No connected systems are modified.</span></div>
        </aside>

        <section className="main-column">
          <div className="panel graph-panel">
            <div className="panel-heading graph-heading">
              <div><span className="section-index">02 / SYSTEM TOPOLOGY</span><h2>Dependency network</h2></div>
              <div className="graph-legend"><span><i className="legend-normal" /> NORMAL</span><span><i className="legend-affected" /> AFFECTED</span><span><i className="legend-critical" /> HIGH IMPACT</span></div>
            </div>
            <div className="graph-wrap">
              <NetworkGraph graph={demoSystem} result={result} selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} />
            </div>
            <div className="graph-footer"><span>REFERENCE TOPOLOGY / COMMERCE PLATFORM</span><span>SELECT A NODE TO INSPECT</span></div>
          </div>

          <div className="lower-grid">
            <section className="panel impact-panel">
              <div className="panel-heading"><div><span className="section-index">03 / EXPOSURE</span><h2>Impact distribution</h2></div><ArrowDownRight size={17} className="muted-icon" /></div>
              <div className="impact-list">
                {rankedImpacts.slice(0, 6).map((impact) => {
                  const node = demoSystem.nodes.find((item) => item.id === impact.nodeId)!;
                  return <button className={`impact-row ${selectedNodeId === node.id ? "active" : ""}`} key={node.id} onClick={() => setSelectedNodeId(node.id)}>
                    <span className="impact-name">{node.label}</span><span className="impact-track"><i style={{ width: `${impact.score}%` }} /></span><strong>{impact.score.toFixed(0)}</strong>
                  </button>;
                })}
              </div>
              <p className="footnote">Scores represent modeled exposure, not probability of failure.</p>
            </section>

            <section className="panel detail-panel">
              <div className="panel-heading"><div><span className="section-index">04 / COMPONENT INSPECTOR</span><h2>Selected node</h2></div><span className="node-type">{selectedNode.kind}</span></div>
              <h3>{selectedNode.label}</h3>
              <p className="detail-description">{selectedNode.description}</p>
              <div className="detail-stats">
                <div><small>CRITICALITY</small><strong>{Math.round(selectedNode.criticality * 100)}%</strong></div>
                <div><small>SIMULATED IMPACT</small><strong className={result.impacts[selectedNode.id] ? "red-text" : ""}>{(result.impacts[selectedNode.id]?.score ?? 0).toFixed(1)}</strong></div>
                <div><small>PROPAGATION DEPTH</small><strong>{result.impacts[selectedNode.id]?.depth ?? "—"}</strong></div>
              </div>
            </section>
          </div>

          <section className="panel trace-panel">
            <div className="panel-heading"><div><span className="section-index">05 / EVENT TRACE</span><h2>Propagation sequence</h2></div><span className="trace-count">{result.trace.length} EVENTS</span></div>
            <div className="trace-summary"><span className="trace-pulse" /> <strong>{result.event.title}</strong><span>ORIGIN: {sourceLabel}</span></div>
            <ol className="trace-list">
              {result.trace.slice(0, 7).map((line, index) => <li key={`${line}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span>{line}</li>)}
            </ol>
            {result.trace.length > 7 && <p className="footnote">Showing first 7 propagation steps of {result.trace.length}.</p>}
          </section>
        </section>
      </div>

      <footer className="footer"><span>AFTERSHOCK <b> / </b> COUNTERFACTUAL SYSTEMS SIMULATION</span><span>DETERMINISTIC MODEL <b>·</b> LOCAL DATA <b>·</b> {hasRun ? "SCENARIO READY" : "AWAITING SIMULATION"}</span></footer>
    </main>
  );
}

function Metric({ icon, label, value, detail, danger = false }: { icon: React.ReactNode; label: string; value: string; detail: string; danger?: boolean }) {
  return <div className="metric-card"><div className="metric-top">{icon}<span>{label}</span></div><strong className={danger ? "metric-danger" : ""}>{value}</strong><small>{detail}</small></div>;
}

export default App;
