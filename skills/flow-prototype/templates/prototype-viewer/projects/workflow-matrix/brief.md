## Goal

Design the workflow configuration matrix — a UI where users define automation rules that map dimensions (customer segments, ageing buckets, risk levels) to actions (email templates, SMS, task assignments).

## Flow

1. Select a workflow or create a new one
2. Define the matrix axes (rows = dimension values, columns = stages/steps)
3. Configure each cell: assign action templates, set conditions, toggle active/inactive
4. Preview the workflow as a visual timeline
5. Save and publish

## Constraints

- Must handle 50+ dimension values × 10+ stages without performance issues
- Cells can be empty (no action), single action, or multi-action
- The matrix must be scannable — users need to see the full picture at a glance
- Mobile is not a priority — this is a power-user desktop tool

## Shell Context

Route: `/admin/workflows`
Active nav: Admin

## Context

See the archived reference document for the full workflow-matrix specification (V1 scope).
