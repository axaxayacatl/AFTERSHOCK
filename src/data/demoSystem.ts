import type { HypotheticalEvent, SystemGraph } from "../types/simulation";

export const demoSystem: SystemGraph = {
  id: "demo-commerce",
  name: "Commerce platform / reference topology",
  nodes: [
    { id: "gateway", label: "API GATEWAY", kind: "service", description: "Public request entry point", x: 90, y: 190, criticality: 0.95 },
    { id: "identity", label: "IDENTITY", kind: "service", description: "Authentication and access", x: 300, y: 75, criticality: 0.9 },
    { id: "catalog", label: "CATALOG", kind: "service", description: "Product and inventory reads", x: 300, y: 190, criticality: 0.75 },
    { id: "orders", label: "ORDER SERVICE", kind: "service", description: "Order orchestration", x: 520, y: 190, criticality: 1 },
    { id: "payments", label: "PAYMENTS", kind: "service", description: "Payment authorization", x: 740, y: 75, criticality: 0.95 },
    { id: "inventory", label: "INVENTORY DB", kind: "database", description: "Stock and reservation records", x: 740, y: 300, criticality: 0.85 },
    { id: "fulfillment", label: "FULFILLMENT", kind: "process", description: "Warehouse dispatch workflow", x: 950, y: 190, criticality: 0.8 },
    { id: "operations", label: "OPERATIONS", kind: "team", description: "Incident response and service ownership", x: 520, y: 370, criticality: 0.65 }
  ],
  edges: [
    { from: "gateway", to: "identity", sensitivity: 0.9, label: "auth" },
    { from: "gateway", to: "catalog", sensitivity: 0.8, label: "routes" },
    { from: "identity", to: "orders", sensitivity: 0.8, label: "identity check" },
    { from: "catalog", to: "orders", sensitivity: 0.65, label: "product data" },
    { from: "orders", to: "payments", sensitivity: 0.95, label: "authorize" },
    { from: "orders", to: "inventory", sensitivity: 0.85, label: "reserve stock" },
    { from: "payments", to: "fulfillment", sensitivity: 0.8, label: "payment confirmed" },
    { from: "inventory", to: "fulfillment", sensitivity: 0.9, label: "stock allocated" },
    { from: "orders", to: "operations", sensitivity: 0.55, label: "alerts" },
    { from: "operations", to: "gateway", sensitivity: 0.2, label: "manual recovery" }
  ]
};

export const initialEvent: HypotheticalEvent = {
  id: "event-payment-outage",
  title: "Payment provider outage",
  kind: "outage",
  sourceNodeId: "payments",
  initialImpact: 100,
  decay: 0.88,
  description: "Simulate a complete loss of payment authorization."
};
