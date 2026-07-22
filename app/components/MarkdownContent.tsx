import type { ReactNode } from "react";

export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <>
      {markdown.split(/\n{2,}/).filter(Boolean).map((block, index) => {
        if (block.startsWith("# ")) return <h2 key={index}>{block.slice(2)}</h2>;
        if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
        if (block.startsWith("### ")) return <h3 key={index}>{block.slice(4)}</h3>;
        if (block.startsWith("- ")) {
          return <ul key={index}>{block.split(/\r?\n/).map((item) => <li key={item}>{inline(item.slice(2))}</li>)}</ul>;
        }
        return <p key={index}>{inline(block)}</p>;
      })}
    </>
  );
}

function inline(markdown: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(markdown))) {
    if (match.index > lastIndex) nodes.push(markdown.slice(lastIndex, match.index));
    if (match[2]) nodes.push(<strong key={match.index}>{match[2]}</strong>);
    else nodes.push(<a href={match[4]} key={match.index}>{match[3]}</a>);
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < markdown.length) nodes.push(markdown.slice(lastIndex));
  return nodes;
}
