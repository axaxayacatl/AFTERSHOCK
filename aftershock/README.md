# AFTERSHOCK

**Counterfactual Systems Simulation**

AFTERSHOCK explores how hypothetical changes propagate through interconnected systems. It models components as a directed dependency graph, applies a simulated event, and calculates downstream exposure so that alternative scenarios can be compared before changes are made.

> Explore the consequences before they happen.

## Current capabilities

- Interactive dependency network with a baseline and simulated state.
- Scenario controls for selecting a component and introducing a disruption.
- Directed impact propagation with configurable edge sensitivity and decay.
- Per-component impact scores, affected-node counts, and a ranked impact list.
- A baseline-versus-simulation comparison and event trace.
- Deterministic simulation engine with unit tests.
- Example system topology included in the application.

The current release is a local, deterministic proof of concept. It does **not** connect to Jira, Confluence, Rovo, or live production systems. Those integrations are planned adapter layers, not implemented features.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify

```bash
npm test
npm run build
```

## Project structure

```text
aftershock/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SIMULATION_MODEL.md
│   └── ROADMAP.md
├── public/
│   └── aftershock-mark.svg
├── src/
│   ├── data/
│   │   └── demoSystem.ts
│   ├── engine/
│   │   ├── simulate.ts
│   │   └── simulate.test.ts
│   ├── components/
│   │   └── NetworkGraph.tsx
│   ├── types/
│   │   └── simulation.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── atlassian/
│   └── README.md
├── index.html
└── package.json
```

## Simulation model

A system is represented as a directed graph:

- **Node:** a component, service, team, or process.
- **Edge:** a directed dependency from one node to another.
- **Event:** a hypothetical disturbance applied to one node.
- **Impact:** a normalized score from 0 to 100 representing modeled exposure, not a probability of failure.

For each outgoing edge, impact is propagated using the edge sensitivity and a decay factor. If multiple paths reach the same node, the engine retains the strongest propagated impact. Cycles are handled by tracking the strongest known score and processing only meaningful improvements.

The model is intentionally transparent and deterministic. Scores are scenario indicators based on supplied assumptions; they are not empirical forecasts.

## Design principles

1. **Scenario isolation:** simulations never mutate the baseline system.
2. **Explainability:** each impacted component can be traced to its upstream cause.
3. **Determinism:** the same graph and event produce the same result.
4. **Honest uncertainty:** modeled impact is not presented as certainty.
5. **Integration boundaries:** external project-management systems will be connected through explicit adapters.

## License

MIT. See [LICENSE](./LICENSE).
