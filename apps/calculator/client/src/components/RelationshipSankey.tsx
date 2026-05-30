import { useMemo, useRef, useState } from "react";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import {
  PILLAR_COLORS,
  SDG_LABELS,
  transformCriteriaToSankey,
  type RelationshipCriteriaData,
  type RelationshipMapCriterion,
  type RelationshipMapGraph,
  type RelationshipMapLink,
  type RelationshipMapMode,
  type RelationshipMapNode,
  type RelationshipPillarId,
} from "@sd-standard/standard-core";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type PillarFilter = RelationshipPillarId | "all";
type Selection =
  | { title: string; description: string; criteria: RelationshipMapCriterion[] }
  | null;
type HoverState =
  | { x: number; y: number; title: string; rows: string[] }
  | null;

const pillarOptions: Array<{ id: PillarFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "environment", label: "Environment" },
  { id: "society", label: "Society" },
  { id: "culture", label: "Culture" },
  { id: "finance", label: "Finance" },
];

function uniqueCriteria(criteria: RelationshipMapCriterion[]) {
  const byId = new Map<string, RelationshipMapCriterion>();
  for (const criterion of criteria) {
    byId.set(criterion.id, criterion);
  }
  return Array.from(byId.values()).sort((a, b) => a.displayId.localeCompare(b.displayId));
}

function nodeColor(node: RelationshipMapNode) {
  if (node.type === "sdg") {
    return "#1f241f";
  }

  return PILLAR_COLORS[node.pillarId as RelationshipPillarId] ?? "#7d8580";
}

function linkColor(link: RelationshipMapLink) {
  return PILLAR_COLORS[link.pillarId as RelationshipPillarId] ?? "#7d8580";
}

function tooltipForNode(node: RelationshipMapNode) {
  const rows = [`Related criteria: ${uniqueCriteria(node.criteria).length}`];

  if (node.pillarLabel) {
    rows.unshift(`Pillar: ${node.pillarLabel}`);
  }

  if (node.type === "criterion") {
    rows.push(`Criterion: ${node.criteria[0]?.displayId ?? node.criterionId}`);
  }

  if (node.type === "sdg" && node.sdg) {
    rows.unshift(`SDG ${node.sdg}: ${SDG_LABELS[node.sdg] ?? "Goal"}`);
  }

  return { title: node.label, rows };
}

function tooltipForLink(link: RelationshipMapLink) {
  const rows = [`Pillar: ${link.pillarLabel}`, `Related criteria: ${uniqueCriteria(link.criteria).length}`];

  if (link.criterionId) {
    rows.push(`Criterion: ${link.criteria[0]?.displayId ?? link.criterionId}`);
  }

  if (link.sdg) {
    rows.push(`SDG ${link.sdg}: ${SDG_LABELS[link.sdg] ?? "Goal"}`);
  }

  return { title: "Relationship", rows };
}

function selectionForNode(node: RelationshipMapNode): Selection {
  const criteria = uniqueCriteria(node.criteria);

  if (node.type === "sdg" && node.sdg) {
    return {
      title: `SDG ${node.sdg}: ${SDG_LABELS[node.sdg] ?? "Goal"}`,
      description: `${criteria.length} criteria connect to this goal.`,
      criteria,
    };
  }

  if (node.type === "criterion") {
    return {
      title: node.criteria[0]?.title ?? node.label,
      description: "Criterion relationship details.",
      criteria,
    };
  }

  return {
    title: node.pillarLabel ?? node.label,
    description: `${criteria.length} criteria connect this pillar to SDGs.`,
    criteria,
  };
}

function selectionForLink(link: RelationshipMapLink): Selection {
  const criteria = uniqueCriteria(link.criteria);
  const sdgLabel = link.sdg ? ` and SDG ${link.sdg}` : "";

  return {
    title: `${link.pillarLabel}${sdgLabel}`,
    description: `${criteria.length} criteria represented by this flow.`,
    criteria,
  };
}

function useSankeyLayout(graph: RelationshipMapGraph, mode: RelationshipMapMode) {
  return useMemo(() => {
    const width = mode === "detail" ? 1120 : 940;
    const rightLabelMargin = mode === "detail" ? 250 : 240;
    const height = Math.max(520, Math.min(920, graph.nodes.length * (mode === "detail" ? 26 : 34)));
    const generator = sankey()
      .nodeId((node: RelationshipMapNode) => node.id)
      .nodeWidth(18)
      .nodePadding(mode === "detail" ? 12 : 18)
      .nodeSort((a: RelationshipMapNode, b: RelationshipMapNode) => a.label.localeCompare(b.label))
      .extent([
        [24, 18],
        [width - rightLabelMargin, height - 18],
      ]);

    const layout = generator({
      nodes: graph.nodes.map((node) => ({ ...node, criteria: [...node.criteria] })),
      links: graph.links.map((link) => ({ ...link, criteria: [...link.criteria] })),
    });

    return {
      width,
      height,
      minWidth: mode === "detail" ? 1060 : 760,
      nodes: layout.nodes,
      links: layout.links,
    };
  }, [graph, mode]);
}

export function RelationshipSankey({ criteriaData }: { criteriaData: RelationshipCriteriaData }) {
  const [mode, setMode] = useState<RelationshipMapMode>("overview");
  const [pillarFilter, setPillarFilter] = useState<PillarFilter>("all");
  const [includeMandatory, setIncludeMandatory] = useState(true);
  const [hover, setHover] = useState<HoverState>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const graph = useMemo(
    () =>
      transformCriteriaToSankey(criteriaData, {
        mode,
        pillarId: pillarFilter,
        includeMandatory,
        pillarColors: PILLAR_COLORS,
      }),
    [criteriaData, includeMandatory, mode, pillarFilter],
  );
  const layout = useSankeyLayout(graph, mode);

  const selectedCriteria = selection?.criteria ?? graph.criteria.slice(0, 8);
  const selectedTitle = selection?.title ?? "Select a node or flow";
  const selectedDescription =
    selection?.description ?? "Click any pillar, criterion, SDG, or flow to inspect the related criteria.";

  const showTooltip = (
    event: React.MouseEvent<SVGElement>,
    details: { title: string; rows: string[] },
  ) => {
    setHover({
      x: event.clientX + 14,
      y: event.clientY + 14,
      title: details.title,
      rows: details.rows,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#d9d4c8] bg-[#fffdf8] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Diagram mode">
            {(["overview", "detail"] as RelationshipMapMode[]).map((option) => (
              <button
                className={cn(
                  "rounded-md border px-4 py-2 text-sm font-extrabold transition focus:outline-none focus:ring-4 focus:ring-[#85bba8]",
                  mode === option
                    ? "border-[#1f241f] bg-[#1f241f] text-white"
                    : "border-[#d9d4c8] bg-white text-[#5f5a50] hover:text-[#1f241f]",
                )}
                key={option}
                type="button"
                onClick={() => {
                  setMode(option);
                  setSelection(null);
                }}
              >
                {option === "overview" ? "Overview" : "Detail"}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Pillar filter">
            {pillarOptions.map((option) => (
              <button
                className={cn(
                  "rounded-md border px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#85bba8]",
                  pillarFilter === option.id
                    ? "border-[#28775e] bg-[#e5efe9] text-[#28775e]"
                    : "border-[#d9d4c8] bg-white text-[#5f5a50] hover:text-[#1f241f]",
                )}
                key={option.id}
                type="button"
                onClick={() => {
                  setPillarFilter(option.id);
                  setSelection(null);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {graph.hasMandatoryCriteria ? (
            <label className="flex items-center gap-2 text-sm font-bold text-[#5f5a50]">
              <Checkbox
                checked={includeMandatory}
                onCheckedChange={(checked) => {
                  setIncludeMandatory(checked === true);
                  setSelection(null);
                }}
              />
              Show mandatory criteria
            </label>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(17rem,1fr)]">
        <div className="rounded-md border border-[#d9d4c8] bg-white p-3 shadow-sm">
          <div className="overflow-x-auto" ref={chartRef}>
            {graph.links.length > 0 ? (
              <svg
                aria-label="SD Standard relationship Sankey diagram"
                className="block h-auto max-w-full"
                height={layout.height}
                preserveAspectRatio="xMinYMin meet"
                role="img"
                style={{ minWidth: `${layout.minWidth}px` }}
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                width="100%"
              >
                <g fill="none">
                  {layout.links.map((link: any) => {
                    const source = link.source as RelationshipMapNode;
                    const target = link.target as RelationshipMapNode;
                    const typedLink = {
                      ...link,
                      source: source.id,
                      target: target.id,
                    } as RelationshipMapLink;

                    return (
                      <path
                        className="cursor-pointer transition-opacity hover:opacity-90"
                        d={sankeyLinkHorizontal()(link) ?? ""}
                        key={typedLink.id}
                        stroke={linkColor(typedLink)}
                        strokeOpacity={0.32}
                        strokeWidth={Math.max(1, link.width)}
                        onClick={() => setSelection(selectionForLink(typedLink))}
                        onMouseLeave={() => setHover(null)}
                        onMouseMove={(event) => showTooltip(event, tooltipForLink(typedLink))}
                      />
                    );
                  })}
                </g>

                <g>
                  {layout.nodes.map((node: any) => {
                    const typedNode = node as RelationshipMapNode & {
                      x0: number;
                      x1: number;
                      y0: number;
                      y1: number;
                    };
                    const isRightSide = typedNode.x0 > layout.width * 0.58;

                    return (
                      <g
                        className="cursor-pointer"
                        key={typedNode.id}
                        onClick={() => setSelection(selectionForNode(typedNode))}
                        onMouseLeave={() => setHover(null)}
                        onMouseMove={(event) => showTooltip(event, tooltipForNode(typedNode))}
                      >
                        <rect
                          fill={nodeColor(typedNode)}
                          height={Math.max(1, typedNode.y1 - typedNode.y0)}
                          rx={4}
                          width={typedNode.x1 - typedNode.x0}
                          x={typedNode.x0}
                          y={typedNode.y0}
                        />
                        <text
                          dominantBaseline="middle"
                          fill="#1f241f"
                          fontSize={typedNode.type === "criterion" ? 10 : 12}
                          fontWeight={typedNode.type === "criterion" ? 700 : 800}
                          pointerEvents="none"
                          textAnchor="start"
                          x={typedNode.x1 + 8}
                          y={(typedNode.y0 + typedNode.y1) / 2}
                        >
                          {typedNode.type === "criterion" && typedNode.label.length > 30
                            ? `${typedNode.label.slice(0, 30)}...`
                            : isRightSide && typedNode.label.length > 32
                              ? `${typedNode.label.slice(0, 32)}...`
                            : typedNode.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            ) : (
              <div className="grid min-h-[320px] place-items-center rounded-md border border-dashed border-[#d9d4c8] bg-[#f7f5ef] p-8 text-center">
                <p className="max-w-md text-sm font-semibold text-[#5f5a50]">
                  No SDG relationships are available for this filter combination.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-md border border-[#d9d4c8] bg-[#fffdf8] p-4 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#5f5a50]">
            Related criteria
          </p>
          <h2 className="mt-2 text-xl font-extrabold leading-tight tracking-normal text-[#1f241f]">
            {selectedTitle}
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#5f5a50]">{selectedDescription}</p>

          <div className="mt-4 grid gap-3">
            {selectedCriteria.map((criterion) => (
              <article className="rounded-md border border-[#d9d4c8] bg-white p-3" key={criterion.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-[#1f241f] px-2 py-1 text-xs font-extrabold text-white">
                    {criterion.displayId}
                  </span>
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: PILLAR_COLORS[criterion.pillarId as RelationshipPillarId] }}
                  />
                  <span className="text-xs font-bold text-[#5f5a50]">{criterion.pillarLabel}</span>
                  {criterion.mandatory ? (
                    <span className="rounded bg-[#fff3bf] px-2 py-1 text-xs font-extrabold text-[#6b5700]">
                      Mandatory
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-sm font-extrabold leading-snug text-[#1f241f]">
                  {criterion.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#5f5a50]">{criterion.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {criterion.sdgs.map((sdg) => (
                    <span
                      className="rounded-full border border-[#d9d4c8] px-2.5 py-1 text-xs font-bold text-[#5f5a50]"
                      key={sdg}
                    >
                      SDG {sdg}
                    </span>
                  ))}
                </div>
                {criterion.url ? (
                  <a
                    className="mt-4 inline-flex text-xs font-extrabold text-[#28775e] hover:text-[#1f241f]"
                    href={criterion.url}
                  >
                    Open Knowledge Base
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </aside>
      </section>

      {hover ? (
        <div
          className="pointer-events-none fixed z-50 max-w-xs rounded-md border border-[#d9d4c8] bg-[#1f241f] px-3 py-2 text-sm text-white shadow-xl"
          style={{ left: hover.x, top: hover.y }}
        >
          <div className="font-extrabold">{hover.title}</div>
          <div className="mt-1 grid gap-1 text-xs text-white/78">
            {hover.rows.map((row) => (
              <span key={row}>{row}</span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
