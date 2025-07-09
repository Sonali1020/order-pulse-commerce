import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Search,
  Truck,
  Home,
  AlertCircle
} from "lucide-react";

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  location: string;
}

interface OrderTracking {
  orderId: string;
  customerName: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  estimatedDelivery: string;
  shippingAddress: string;
  events: TrackingEvent[];
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
}

const mockTrackingData: OrderTracking = {
  orderId: "ORD-001",
  customerName: "John Doe",
  status: "shipped",
  trackingNumber: "TRK123456789",
  estimatedDelivery: "2024-01-20T00:00:00Z",
  shippingAddress: "123 Main St, New York, NY 10001",
  items: [
    { id: "1", name: "Wireless Headphones", quantity: 1, price: 99.99 },
    { id: "2", name: "Phone Case", quantity: 2, price: 19.99 }
  ],
  events: [
    {
      id: "1",
      status: "Order Placed",
      description: "Your order has been received and is being prepared",
      timestamp: "2024-01-15T10:30:00Z",
      location: "Processing Center"
    },
    {
      id: "2",
      status: "Order Confirmed",
      description: "Payment processed successfully",
      timestamp: "2024-01-15T10:45:00Z",
      location: "Payment Center"
    },
    {
      id: "3",
      status: "Preparing for Shipment",
      description: "Items are being picked and packed",
      timestamp: "2024-01-16T08:30:00Z",
      location: "Fulfillment Center - NYC"
    },
    {
      id: "4",
      status: "Shipped",
      description: "Package has been dispatched and is on its way",
      timestamp: "2024-01-17T14:20:00Z",
      location: "Distribution Center - NYC"
    },
    {
      id: "5",
      status: "In Transit",
      description: "Package is en route to your location",
      timestamp: "2024-01-18T09:15:00Z",
      location: "Local Delivery Hub"
    }
  ]
};

export const CustomerTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderData, setOrderData] = useState<OrderTracking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Simulate real-time updates
  useEffect(() => {
    if (orderData) {
      const interval = setInterval(() => {
        // Simulate tracking updates
        setOrderData(prev => {
          if (!prev) return prev;
          
          // Randomly add new tracking events
          if (Math.random() < 0.3) {
            const newEvent: TrackingEvent = {
              id: Date.now().toString(),
              status: "Location Update",
              description: "Package scanned at facility",
              timestamp: new Date().toISOString(),
              location: "Transit Hub"
            };
            
            return {
              ...prev,
              events: [...prev.events, newEvent]
            };
          }
          
          return prev;
        });
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [orderData]);

  const handleTrackOrder = () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      setOrderData(mockTrackingData);
      setIsLoading(false);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "order placed":
      case "order confirmed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "preparing for shipment":
        return <Package className="h-4 w-4 text-status-processing" />;
      case "shipped":
      case "in transit":
        return <Truck className="h-4 w-4 text-status-shipped" />;
      case "delivered":
        return <Home className="h-4 w-4 text-status-delivered" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-hero">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-white/80">Get real-time updates on your package delivery</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Enter Tracking Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter tracking number (e.g., TRK123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                />
              </div>
              <Button 
                onClick={handleTrackOrder}
                disabled={isLoading}
                className="shrink-0"
              >
                {isLoading ? "Tracking..." : "Track Order"}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm mt-2 justify-center">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order #{orderData.orderId}</CardTitle>
                  <StatusBadge status={orderData.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {orderData.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Shipping Address</p>
                        <p className="text-sm text-muted-foreground">{orderData.shippingAddress}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Estimated Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(orderData.estimatedDelivery)}
                        </p>
                      </div>
                    </div>
                    
                    {orderData.trackingNumber && (
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Tracking Number</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {orderData.trackingNumber}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.events.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(event.status)}
                        {index < orderData.events.length - 1 && (
                          <div className="w-0.5 h-8 bg-border mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.status}</h4>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Updates Notice */}
            <Card className="bg-gradient-card border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 text-center">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
                  <span className="text-sm">
                    This page updates automatically with real-time tracking information
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};