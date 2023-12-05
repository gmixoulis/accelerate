"use client"

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import gfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import { memo } from "react";
import "../../styles/markdown.css"

const CodeComponent = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const MarkdownMessage = ({ message }) => {
 
    return (
        <div className="markdown-container">
         <ReactMarkdown
           linkTarget="_blank"
           remarkPlugins={[gfm]}
           components={{
              code: CodeComponent,
           }}
         >
           {message}
         </ReactMarkdown>                                                          
        </div>
    )
}

export default memo(MarkdownMessage);