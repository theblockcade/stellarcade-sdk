"use client";

import React, { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00ffcc"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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
      <code
        className="rounded-md border border-line-strong bg-surface2 px-1.75 py-0.5 text-[0.86em] text-signal before:content-none after:content-none"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-line-strong bg-surface">
      <div className="flex items-center justify-between border-b border-line bg-surface2 px-4 py-2 text-xs">
        <span className="font-mono font-bold uppercase tracking-wider text-muted2">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.25 rounded px-2 py-0.75 text-xs text-muted transition-colors duration-150 hover:bg-signal/10 hover:text-signal"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <CheckIcon />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-transparent p-5 text-[0.88rem] leading-[1.6]">
        <code className="border-none bg-none p-0 font-mono text-slate-200">{children}</code>
      </pre>
    </div>
  );
}

export function Markdown({ content }: { content: string }) {
  return (
    <div
      className="prose prose-invert max-w-none
        prose-headings:tracking-tight
        prose-h1:mt-0 prose-h1:mb-6 prose-h1:text-[2.25rem] prose-h1:font-extrabold prose-h1:tracking-[-0.02em] prose-h1:text-white
        prose-h2:mt-11 prose-h2:mb-4 prose-h2:border-t prose-h2:border-line prose-h2:pt-6 prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-[-0.01em] prose-h2:text-slate-100
        prose-h3:mt-7 prose-h3:mb-3 prose-h3:text-[1.1875rem] prose-h3:font-semibold prose-h3:text-slate-200
        prose-p:my-4 prose-p:text-base prose-p:leading-[1.75] prose-p:text-muted
        prose-li:my-2 prose-li:text-muted prose-li:leading-[1.75]
        prose-ul:my-4 prose-ul:pl-6 prose-ol:my-4 prose-ol:pl-6
        prose-a:text-signal prose-a:no-underline hover:prose-a:text-hot
        prose-strong:text-white"
    >
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
              <div className="not-prose my-7 overflow-x-auto rounded-lg border border-line bg-surface">
                <table className="w-full border-collapse text-[0.88rem]">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead>{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="border-b border-line-strong bg-surface2 px-4 py-3 text-left font-bold text-white">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-b border-line px-4 py-3 text-muted [tr:last-child_&]:border-b-0">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="not-prose my-6 rounded-r-lg border-l-[3px] border-line-strong bg-surface px-4.5 py-3.5 text-ink [&>p]:m-0 [&>p]:text-[0.9375rem] [&>p]:text-muted">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
