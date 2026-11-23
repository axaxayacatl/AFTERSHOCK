import { describe, expect, it } from "vitest";
import { simulate } from "./simulate";
import type { HypotheticalEvent, SystemGraph } from "../types/simulation";

const graph: SystemGraph = {
  id: "test",
  name: "Test graph",
  nodes: [
    { id: "a", label: "A", kind: "service", description: "", x: 0, y: 0, criticality: 1 },
    { id: "b", label: "B", kind: "service", description: "", x: 1, y: 0, criticality: 1 },
    { id: "c", label: "C", kind: "service", description: "", x: 2, y: 0, criticality: 1 }
  ],
  edges: [
    { from: "a", to: "b", sensitivity: 0.5 },
    { from: "b", to: "c", sensitivity: 0.5 }
  ]
};

const event: HypotheticalEvent = {
  id: "e", title: "Test event", kind: "outage",
  sourceNodeId: "a", initialImpact: 100, decay: 1, description: ""
};

describe("simulate", () => {
  it("propagates impact through directed dependencies", () => {
    const result = simulate(graph, event);
    expect(result.impacts.b.score).toBe(50);
    expect(result.impacts.c.score).toBe(25);
    expect(result.affectedNodeIds).toEqual(["b", "c"]);
  });

  it("does not mutate the source graph", () => {
    const before = structuredClone(graph);
    simulate(graph, event);
    expect(graph).toEqual(before);
  });

  it("does not propagate against edge direction", () => {
    const result = simulate(graph, { ...event, sourceNodeId: "c" });
    expect(result.affectedNodeIds).toEqual([]);
  });

  it("rejects unknown source nodes", () => {
    expect(() => simulate(graph, { ...event, sourceNodeId: "missing" })).toThrow(/Unknown event source/);
  });

  it("handles cycles without unbounded traversal", () => {
    const cyclic = { ...graph, edges: [...graph.edges, { from: "c", to: "a", sensitivity: 0.5 }] };
    const result = simulate(cyclic, event);
    expect(result.impacts.a.score).toBe(100);
    expect(result.maxDepth).toBe(2);
  });
});
