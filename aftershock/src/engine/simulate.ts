import type { HypotheticalEvent, SimulationResult, SystemGraph } from "../types/simulation";

const EPSILON = 0.01;

/**
 * Runs a deterministic, read-only propagation simulation.
 * The strongest impact reaching a node is retained across all paths.
 */
export function simulate(graph: SystemGraph, event: HypotheticalEvent): SimulationResult {
  if (!graph.nodes.some((node) => node.id === event.sourceNodeId)) {
    throw new Error(`Unknown event source node: ${event.sourceNodeId}`);
  }
  if (event.initialImpact < 0 || event.initialImpact > 100) {
    throw new Error("initialImpact must be between 0 and 100.");
  }
  if (event.decay < 0 || event.decay > 1) {
    throw new Error("decay must be between 0 and 1.");
  }

  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      throw new Error(`Dependency references an unknown node: ${edge.from} -> ${edge.to}`);
    }
    if (edge.sensitivity < 0 || edge.sensitivity > 1) {
      throw new Error("Edge sensitivity must be between 0 and 1.");
    }
  }

  const outgoing = new Map<string, typeof graph.edges>();
  for (const edge of graph.edges) {
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), edge]);
  }

  const impacts: SimulationResult["impacts"] = {
    [event.sourceNodeId]: {
      nodeId: event.sourceNodeId,
      score: event.initialImpact,
      predecessorId: null,
      depth: 0
    }
  };
  const queue = [event.sourceNodeId];
  const trace = [`${event.sourceNodeId} receives initial impact ${event.initialImpact.toFixed(0)}.`];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const current = impacts[currentId];

    for (const edge of outgoing.get(currentId) ?? []) {
      const candidate = current.score * edge.sensitivity * event.decay;
      const previous = impacts[edge.to];

      if (candidate <= EPSILON || (previous && candidate <= previous.score + EPSILON)) {
        continue;
      }

      impacts[edge.to] = {
        nodeId: edge.to,
        score: Math.min(100, candidate),
        predecessorId: currentId,
        depth: current.depth + 1
      };
      trace.push(`${currentId} → ${edge.to}: ${candidate.toFixed(1)} impact.`);
      queue.push(edge.to);
    }
  }

  const affectedNodeIds = Object.keys(impacts).filter((id) => id !== event.sourceNodeId);
  const totalImpact = Object.values(impacts).reduce((sum, item) => sum + item.score, 0);
  const maxDepth = Math.max(0, ...Object.values(impacts).map((item) => item.depth));

  return { event, impacts, affectedNodeIds, trace, totalImpact, maxDepth };
}
