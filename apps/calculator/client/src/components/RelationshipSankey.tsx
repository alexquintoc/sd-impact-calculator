import { useMemo, useRef, useState, type MouseEvent, type Ref } from "react";
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
type SankeyLayoutOptions = {
  width?: number;
  height?: number;
  minWidth?: number;
  rightLabelMargin?: number;
  nodeWidth?: number;
  nodePadding?: number;
  marginX?: number;
  marginY?: number;
};

const EXPORT_WIDTH = 3200;
const EXPORT_HEIGHT = 1800;
const SVG_FILE_NAME = "sd-standard-sdg-alluvial-detail.svg";
const PNG_FILE_NAME = "sd-standard-sdg-alluvial-detail.png";
const SVG_XMLNS = "http://www.w3.org/2000/svg";

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

function createSankeyLayout(
  graph: RelationshipMapGraph,
  mode: RelationshipMapMode,
  options: SankeyLayoutOptions = {},
) {
  const width = options.width ?? (mode === "detail" ? 1120 : 940);
  const rightLabelMargin = options.rightLabelMargin ?? (mode === "detail" ? 250 : 240);
  const height =
    options.height ??
    Math.max(520, Math.min(920, graph.nodes.length * (mode === "detail" ? 26 : 34)));
  const generator = sankey()
    .nodeId((node: RelationshipMapNode) => node.id)
    .nodeWidth(options.nodeWidth ?? 18)
    .nodePadding(options.nodePadding ?? (mode === "detail" ? 12 : 18))
    .nodeSort((a: RelationshipMapNode, b: RelationshipMapNode) => a.label.localeCompare(b.label))
    .extent([
      [options.marginX ?? 24, options.marginY ?? 18],
      [width - rightLabelMargin, height - (options.marginY ?? 18)],
    ]);

  const layout = generator({
    nodes: graph.nodes.map((node) => ({ ...node, criteria: [...node.criteria] })),
    links: graph.links.map((link) => ({ ...link, criteria: [...link.criteria] })),
  });

  return {
    width,
    height,
    minWidth: options.minWidth ?? (mode === "detail" ? 1060 : 760),
    nodes: layout.nodes,
    links: layout.links,
  };
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
    return createSankeyLayout(graph, mode);
  }, [graph, mode]);
}

function serializeSvg(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", SVG_XMLNS);
  clone.setAttribute("width", `${EXPORT_WIDTH}`);
  clone.setAttribute("height", `${EXPORT_HEIGHT}`);
  clone.setAttribute("viewBox", `0 0 ${EXPORT_WIDTH} ${EXPORT_HEIGHT}`);

  const source = new XMLSerializer().serializeToString(clone);
  return source.startsWith("<?xml")
    ? source
    : `<?xml version="1.0" encoding="UTF-8"?>\n${source}`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function SankeySvg({
  layout,
  exportMode = false,
  onLinkSelect,
  onNodeSelect,
  onTooltip,
  onTooltipEnd,
  svgRef,
}: {
  layout: ReturnType<typeof createSankeyLayout>;
  exportMode?: boolean;
  onLinkSelect?: (link: RelationshipMapLink) => void;
  onNodeSelect?: (node: RelationshipMapNode) => void;
  onTooltip?: (event: MouseEvent<SVGElement>, details: { title: string; rows: string[] }) => void;
  onTooltipEnd?: () => void;
  svgRef?: Ref<SVGSVGElement>;
}) {
  const labelFontSize = exportMode ? 22 : 12;
  const criterionFontSize = exportMode ? 18 : 10;
  const labelOffset = exportMode ? 18 : 8;
  const markerOffset = exportMode ? 7 : 4;

  return (
    <svg
      aria-label="SD Standard relationship Sankey diagram"
      className={exportMode ? undefined : "block h-auto max-w-full"}
      height={layout.height}
      preserveAspectRatio="xMinYMin meet"
      ref={svgRef}
      role="img"
      style={exportMode ? { background: "#ffffff", fontFamily: "Plus Jakarta Sans, Arial, sans-serif" } : { minWidth: `${layout.minWidth}px` }}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width={exportMode ? layout.width : "100%"}
      xmlns={SVG_XMLNS}
    >
      <style>
        {`text{font-family:'Plus Jakarta Sans',Arial,sans-serif}.sankey-link{transition:opacity 150ms ease}.sankey-node{cursor:pointer}`}
      </style>
      {exportMode ? <rect fill="#ffffff" height="100%" width="100%" x={0} y={0} /> : null}
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
              className={exportMode ? undefined : "sankey-link cursor-pointer transition-opacity hover:opacity-90"}
              d={sankeyLinkHorizontal()(link) ?? ""}
              key={typedLink.id}
              stroke={linkColor(typedLink)}
              strokeLinecap="round"
              strokeOpacity={0.32}
              strokeWidth={Math.max(1, link.width)}
              onClick={exportMode ? undefined : () => onLinkSelect?.(typedLink)}
              onMouseLeave={exportMode ? undefined : onTooltipEnd}
              onMouseMove={exportMode ? undefined : (event) => onTooltip?.(event, tooltipForLink(typedLink))}
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
          const label =
            exportMode || typedNode.type !== "criterion"
              ? exportMode || !isRightSide || typedNode.label.length <= 32
                ? typedNode.label
                : `${typedNode.label.slice(0, 32)}...`
              : typedNode.label.length > 30
                ? `${typedNode.label.slice(0, 30)}...`
                : typedNode.label;
          const showMandatoryMarker =
            typedNode.type === "criterion" && typedNode.criteria[0]?.mandatory === true;
          const textY = (typedNode.y0 + typedNode.y1) / 2;

          return (
            <g
              className={exportMode ? undefined : "sankey-node cursor-pointer"}
              key={typedNode.id}
              onClick={exportMode ? undefined : () => onNodeSelect?.(typedNode)}
              onMouseLeave={exportMode ? undefined : onTooltipEnd}
              onMouseMove={exportMode ? undefined : (event) => onTooltip?.(event, tooltipForNode(typedNode))}
            >
              <rect
                fill={nodeColor(typedNode)}
                height={Math.max(1, typedNode.y1 - typedNode.y0)}
                rx={exportMode ? 8 : 4}
                width={typedNode.x1 - typedNode.x0}
                x={typedNode.x0}
                y={typedNode.y0}
              />
              {showMandatoryMarker ? (
                <circle
                  cx={typedNode.x1 + labelOffset}
                  cy={textY}
                  fill="#f4c430"
                  r={exportMode ? 8 : 4}
                  stroke="#6b5700"
                  strokeWidth={exportMode ? 2 : 1}
                />
              ) : null}
              <text
                dominantBaseline="middle"
                fill="#1f241f"
                fontSize={typedNode.type === "criterion" ? criterionFontSize : labelFontSize}
                fontWeight={typedNode.type === "criterion" ? 700 : 800}
                pointerEvents="none"
                textAnchor="start"
                x={typedNode.x1 + labelOffset + (showMandatoryMarker ? markerOffset + (exportMode ? 14 : 7) : 0)}
                y={textY}
              >
                {label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function RelationshipSankey({ criteriaData }: { criteriaData: RelationshipCriteriaData }) {
  const [mode, setMode] = useState<RelationshipMapMode>("overview");
  const [pillarFilter, setPillarFilter] = useState<PillarFilter>("all");
  const [includeMandatory, setIncludeMandatory] = useState(true);
  const [hover, setHover] = useState<HoverState>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const exportSvgRef = useRef<SVGSVGElement>(null);

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
  const exportGraph = useMemo(
    () =>
      transformCriteriaToSankey(criteriaData, {
        mode: "detail",
        pillarId: pillarFilter,
        includeMandatory,
        pillarColors: PILLAR_COLORS,
      }),
    [criteriaData, includeMandatory, pillarFilter],
  );
  const exportLayout = useMemo(
    () =>
      createSankeyLayout(exportGraph, "detail", {
        width: EXPORT_WIDTH,
        height: EXPORT_HEIGHT,
        minWidth: EXPORT_WIDTH,
        rightLabelMargin: 880,
        nodeWidth: 34,
        nodePadding: 10,
        marginX: 80,
        marginY: 70,
      }),
    [exportGraph],
  );

  const selectedCriteria = selection?.criteria ?? graph.criteria.slice(0, 8);
  const selectedTitle = selection?.title ?? "Select a node or flow";
  const selectedDescription =
    selection?.description ?? "Click any pillar, criterion, SDG, or flow to inspect the related criteria.";

  const showTooltip = (
    event: MouseEvent<SVGElement>,
    details: { title: string; rows: string[] },
  ) => {
    setHover({
      x: event.clientX + 14,
      y: event.clientY + 14,
      title: details.title,
      rows: details.rows,
    });
  };

  const handleDownloadSvg = () => {
    if (!exportSvgRef.current || exportGraph.links.length === 0) {
      return;
    }

    const svgText = serializeSvg(exportSvgRef.current);
    downloadBlob(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }), SVG_FILE_NAME);
  };

  const handleDownloadPng = async () => {
    if (!exportSvgRef.current || exportGraph.links.length === 0) {
      return;
    }

    const scale = 3;
    const svgText = serializeSvg(exportSvgRef.current);
    const svgUrl = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
    const image = new Image();

    try {
      image.src = svgUrl;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = EXPORT_WIDTH * scale;
      canvas.height = EXPORT_HEIGHT * scale;
      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, PNG_FILE_NAME);
        }
      }, "image/png");
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
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

          <div className="flex flex-wrap gap-2" aria-label="Diagram exports">
            <button
              className="rounded-md border border-[#1f241f] bg-white px-3 py-2 text-sm font-extrabold text-[#1f241f] transition hover:bg-[#1f241f] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#85bba8] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={exportGraph.links.length === 0}
              type="button"
              onClick={handleDownloadSvg}
            >
              Download SVG
            </button>
            <button
              className="rounded-md border border-[#d9d4c8] bg-white px-3 py-2 text-sm font-bold text-[#5f5a50] transition hover:text-[#1f241f] focus:outline-none focus:ring-4 focus:ring-[#85bba8] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={exportGraph.links.length === 0}
              type="button"
              onClick={handleDownloadPng}
            >
              Download PNG
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(17rem,1fr)]">
        <div className="rounded-md border border-[#d9d4c8] bg-white p-3 shadow-sm">
          <div className="overflow-x-auto" ref={chartRef}>
            {graph.links.length > 0 ? (
              <SankeySvg
                layout={layout}
                onLinkSelect={(link) => setSelection(selectionForLink(link))}
                onNodeSelect={(node) => setSelection(selectionForNode(node))}
                onTooltip={showTooltip}
                onTooltipEnd={() => setHover(null)}
              />
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

      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] top-0 h-0 w-0 overflow-hidden"
      >
        <SankeySvg
          exportMode
          layout={exportLayout}
          svgRef={exportSvgRef}
        />
      </div>
    </div>
  );
}
