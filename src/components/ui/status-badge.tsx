import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      status: {
        pending: "bg-status-pending/10 text-status-pending border border-status-pending/20",
        processing: "bg-status-processing/10 text-status-processing border border-status-processing/20",
        shipped: "bg-status-shipped/10 text-status-shipped border border-status-shipped/20",
        delivered: "bg-status-delivered/10 text-status-delivered border border-status-delivered/20",
        cancelled: "bg-status-cancelled/10 text-status-cancelled border border-status-cancelled/20",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  showIcon?: boolean;
}

const StatusBadge = ({ className, status, size, showIcon = true, ...props }: StatusBadgeProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return "⏳";
      case "processing":
        return "🔄";
      case "shipped":
        return "🚚";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "⏳";
    }
  };

  return (
    <div className={cn(statusBadgeVariants({ status, size, className }))} {...props}>
      {showIcon && <span className="text-xs">{getStatusIcon()}</span>}
      <span className="capitalize">{status}</span>
    </div>
  );
};

export { StatusBadge, statusBadgeVariants };