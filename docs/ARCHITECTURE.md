# Architecture

## Overview

AFTERSHOCK separates the simulation domain from the interface and future external integrations.

```text
React interface
   │
   ├── Scenario controls
   ├── Network visualization
   └── Impact and timeline views
          │
          ▼
Typed simulation domain
   │
   ├── System graph
   ├── Hypothetical event
   └── Simulation result
          │
          ▼
Deterministic propagation engine
          │
          ▼
Impact map + trace + summary

Future adapters (not implemented)
   ├── Jira project data
   ├── Confluence context
   └── Rovo natural-language interface
```

## Domain boundaries

`src/types/simulation.ts` defines the stable data contracts. `src/engine/simulate.ts` is a pure function: it accepts a graph and event and returns a result without modifying its inputs. The UI owns interaction state and renders the result.

## Future integration strategy

External services should be isolated behind adapters that translate provider data into the AFTERSHOCK graph model. The simulation engine should not import Atlassian SDKs or depend on network access. This keeps the core testable and allows local scenarios to work independently.

No credentials, API tokens, or production data are required by the current prototype.
