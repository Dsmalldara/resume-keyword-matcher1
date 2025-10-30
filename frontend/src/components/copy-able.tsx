"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";

type CopyableProps = {
  value: string | undefined;
  showText?: boolean;
  showBorder?: boolean;
};

export const Copyable = ({
  value,
  showText = true,
  showBorder = false,
}: CopyableProps) => {
  const [copied, setCopied] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  if (!value) return <span>-</span>;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);

    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }

    setTimeout(() => {
      setCopied(false);
      setTooltipPos(null);
    }, 1000);
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer relative group"
      onClick={handleCopy}
    >
      {showText && <span>Copy</span>}
      <span
        ref={iconRef}
        className={cn(
          "border rounded-full p-1 border-neutral-300",
          showBorder ? "border-neutral-300" : "border-transparent",
        )}
      >
        <Copy size={14} className={copied ? "text-primary" : "text-deep-100"} />
      </span>

      {copied &&
        tooltipPos &&
        createPortal(
          <span
            style={{
              position: "absolute",
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translate(-50%, 0)",
              zIndex: 9999,
            }}
            className="bg-black text-white text-xs px-2 py-1 rounded-[8px] whitespace-nowrap shadow-lg border"
          >
            Copied!
          </span>,
          document.body,
        )}
    </div>
  );
};
