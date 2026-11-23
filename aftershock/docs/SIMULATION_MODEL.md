# Simulation model

## Graph

Let the system be a directed graph \(G=(V,E)\). Each vertex \(v \in V\) is a system component. Each directed edge \(e=(u,v)\) indicates that downstream component \(v\) depends on upstream component \(u\).

Each edge has a sensitivity \(w_e \in [0,1]\).

## Event and propagation

A hypothetical event injects an initial impact \(I_0 \in [0,100]\) into a selected node. For each outgoing edge, the candidate downstream impact is:

\[
I_v = I_u \cdot w_{(u,v)} \cdot d
\]

where \(d \in [0,1]\) is the propagation decay factor.

If multiple paths reach the same node, the engine keeps the maximum candidate impact. The engine processes a node again only if a stronger impact is discovered, which prevents endless traversal in cyclic graphs.

## Interpretation

Impact is a relative scenario score. It is not a probability, service-level objective, or prediction of actual downtime. Real deployments would need calibrated edge weights, domain-specific models, historical validation, and uncertainty intervals.
