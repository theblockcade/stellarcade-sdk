"use client";

import React, { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

function CodeBlock({ className, children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard?.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If inline code
  if (!match && typeof children === "string" && !children.includes("\n")) {
    return (
      <code className="inline-code" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="code-block-copy-btn"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={13} style={{ color: "#00ffcc" }} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="docs-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          a({ href, children, ...props }) {
            const url = href ?? "#";
            if (url.startsWith("/")) {
              return (
                <Link href={url} {...props}>
                  {children}
                </Link>
              );
            }
            const external = url.startsWith("http");
            return (
              <a
                href={url}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="table-container">
                <table>{children}</table>
              </div>
            );
          },
          blockquote({ children }) {
            return <blockquote className="docs-callout">{children}</blockquote>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
