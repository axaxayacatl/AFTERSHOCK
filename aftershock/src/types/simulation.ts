export type NodeKind = "service" | "database" | "team" | "process";

export interface SystemNode {
  id: string;
  label: string;
  kind: NodeKind;
  description: string;
  x: number;
  y: number;
  criticality: number;
}

export interface DependencyEdge {
  from: string;
  to: string;
  sensitivity: number;
  label?: string;
}

export interface SystemGraph {
  id: string;
  name: string;
  nodes: SystemNode[];
  edges: DependencyEdge[];
}

export type EventKind = "outage" | "delay" | "degradation";

export interface HypotheticalEvent {
  id: string;
  title: string;
  kind: EventKind;
  sourceNodeId: string;
  initialImpact: number;
  decay: number;
  description: string;
}

export interface ImpactRecord {
  nodeId: string;
  score: number;
  predecessorId: string | null;
  depth: number;
}

export interface SimulationResult {
  event: HypotheticalEvent;
  impacts: Record<string, ImpactRecord>;
  affectedNodeIds: string[];
  trace: string[];
  totalImpact: number;
  maxDepth: number;
}
