import { Check, Clock, X } from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = (status || "").toLowerCase();

  const map = {
    processed: {
      label: "Processed",
      classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      Icon: Check,
    },
    pending: {
      label: "Pending",
      classes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      Icon: Clock,
    },
    processing: {
      label: "Processing",
      classes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      Icon: Clock,
    },
    failed: {
      label: "Failed",
      classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      Icon: X,
    },
  } as const;

  const entry = map[normalized as keyof typeof map] || {
    label: status || "Unknown",
    classes: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
    Icon: Clock,
  };

  const Icon = entry.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.classes}`}
    >
      <Icon className="w-3 h-3 stroke-current" />
      {entry.label}
    </span>
  );
};

export default StatusBadge;
