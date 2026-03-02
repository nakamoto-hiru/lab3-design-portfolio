import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CaseStudyContentProps {
  body: string;
}

export default function CaseStudyContent({ body }: CaseStudyContentProps) {
  return (
    <div
      className="prose prose-lg max-w-[720px] mt-12
        prose-headings:font-medium prose-headings:text-text-primary
        prose-p:text-text-primary prose-p:leading-relaxed
        prose-li:text-text-primary
        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-strong:text-text-primary
        prose-hr:border-border"
    >
      <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
    </div>
  );
}
