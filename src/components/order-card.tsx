import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Clock, User, CreditCard } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shippingAddress: string;
  paymentMethod: string;
}

interface OrderCardProps {
  order: Order;
  onStatusChange?: (orderId: string, newStatus: Order['status']) => void;
  onViewDetails?: (orderId: string) => void;
  showActions?: boolean;
}

export const OrderCard = ({ order, onStatusChange, onViewDetails, showActions = true }: OrderCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNextStatus = (currentStatus: Order['status']) => {
    switch (currentStatus) {
      case "pending":
        return "processing";
      case "processing":
        return "shipped";
      case "shipped":
        return "delivered";
      default:
        return currentStatus;
    }
  };

  const canAdvanceStatus = (status: Order['status']) => {
    return ["pending", "processing", "shipped"].includes(status);
  };

  return (
    <Card className="w-full hover:shadow-card transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Order #{order.id}</CardTitle>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {order.customerName}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDate(order.createdAt)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Items ({order.items.length})</h4>
          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Shipping Address</p>
                <p className="text-xs text-muted-foreground">{order.shippingAddress}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Payment</p>
                <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {order.trackingNumber && (
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tracking</p>
                  <p className="text-xs text-muted-foreground font-mono">{order.trackingNumber}</p>
                </div>
              </div>
            )}
            
            {order.estimatedDelivery && (
              <div>
                <p className="text-sm font-medium">Estimated Delivery</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.estimatedDelivery)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Total and Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-lg font-bold">
            Total: {formatPrice(order.total)}
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails?.(order.id)}
              >
                View Details
              </Button>
              {canAdvanceStatus(order.status) && onStatusChange && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onStatusChange(order.id, getNextStatus(order.status))}
                >
                  Mark as {getNextStatus(order.status)}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};