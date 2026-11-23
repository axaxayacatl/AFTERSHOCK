import type { SimulationResult, SystemGraph } from "../types/simulation";

interface Props {
  graph: SystemGraph;
  result: SimulationResult | null;
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}

export function NetworkGraph({ graph, result, selectedNodeId, onSelectNode }: Props) {
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const impacted = result?.impacts ?? {};

  return (
    <svg className="network-svg" viewBox="0 0 1060 440" role="img" aria-label="Interactive system dependency graph">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#55545d" />
        </marker>
        <marker id="arrow-hot" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#ff303b" />
        </marker>
      </defs>
      {graph.edges.map((edge) => {
        const from = nodes.get(edge.from)!;
        const to = nodes.get(edge.to)!;
        const hot = Boolean(impacted[edge.from] || impacted[edge.to]);
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line
              x1={from.x + 58} y1={from.y + 18}
              x2={to.x + 58} y2={to.y + 18}
              className={hot ? "edge edge-hot" : "edge"}
              markerEnd={hot ? "url(#arrow-hot)" : "url(#arrow)"}
            />
            {edge.label && (
              <text x={(from.x + to.x) / 2 + 58} y={(from.y + to.y) / 2 + 12} className="edge-label">
                {edge.label}
              </text>
            )}
          </g>
        );
      })}
      {graph.nodes.map((node) => {
        const impact = impacted[node.id]?.score ?? 0;
        const isSelected = selectedNodeId === node.id;
        const status = impact >= 65 ? "critical" : impact > 0 ? "affected" : "normal";
        return (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            className={`graph-node ${status} ${isSelected ? "selected" : ""}`}
            onClick={() => onSelectNode(node.id)}
            role="button"
            tabIndex={0}
            aria-label={`${node.label}, impact ${impact.toFixed(0)}`}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onSelectNode(node.id);
            }}
          >
            <rect width="116" height="42" rx="5" />
            <circle cx="12" cy="13" r="3" />
            <text x="22" y="17">{node.label}</text>
            <text x="10" y="32" className="node-meta">
              {impact > 0 ? `IMPACT ${impact.toFixed(0)} / 100` : node.kind.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
