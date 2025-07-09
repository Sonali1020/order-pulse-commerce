import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { OrderCard } from "@/components/order-card";
import { 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  RefreshCw,
  Bell,
  Settings
} from "lucide-react";

// Mock data for demonstration
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    status: "pending" as const,
    items: [
      { id: "1", name: "Wireless Headphones", quantity: 1, price: 99.99 },
      { id: "2", name: "Phone Case", quantity: 2, price: 19.99 }
    ],
    total: 139.97,
    createdAt: "2024-01-15T10:30:00Z",
    estimatedDelivery: "2024-01-20T00:00:00Z",
    shippingAddress: "123 Main St, New York, NY 10001",
    paymentMethod: "Credit Card (**** 4242)"
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    status: "processing" as const,
    items: [
      { id: "3", name: "Laptop Stand", quantity: 1, price: 49.99 },
      { id: "4", name: "USB-C Cable", quantity: 3, price: 12.99 }
    ],
    total: 88.96,
    createdAt: "2024-01-15T09:15:00Z",
    estimatedDelivery: "2024-01-18T00:00:00Z",
    trackingNumber: "TRK123456789",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    paymentMethod: "PayPal"
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    status: "shipped" as const,
    items: [
      { id: "5", name: "Gaming Mouse", quantity: 1, price: 79.99 }
    ],
    total: 79.99,
    createdAt: "2024-01-14T14:45:00Z",
    estimatedDelivery: "2024-01-17T00:00:00Z",
    trackingNumber: "TRK987654321",
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    paymentMethod: "Credit Card (**** 5555)"
  }
];

export const OrderDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random order updates
      setOrders(prevOrders => 
        prevOrders.map(order => {
          // Randomly update order status (10% chance)
          if (Math.random() < 0.1) {
            const statuses = ["pending", "processing", "shipped", "delivered"];
            const currentIndex = statuses.indexOf(order.status);
            if (currentIndex < statuses.length - 1) {
              return { ...order, status: statuses[currentIndex + 1] as any };
            }
          }
          return order;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      processing: orders.filter(o => o.status === "processing").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      revenue: orders.reduce((sum, order) => sum + order.total, 0)
    };
    
    return stats;
  };

  const handleStatusChange = (orderId: string, newStatus: any) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="text-muted-foreground">Real-time order processing and tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.total}</div>
                <Package className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-status-pending">{stats.pending}</div>
                <Clock className="h-5 w-5 text-status-pending" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-status-processing">{stats.processing}</div>
                <RefreshCw className="h-5 w-5 text-status-processing" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Shipped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-status-shipped">{stats.shipped}</div>
                <CheckCircle className="h-5 w-5 text-status-shipped" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-success">
                  ${stats.revenue.toFixed(2)}
                </div>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders found matching your criteria.</p>
              </div>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={(orderId) => console.log("View details for", orderId)}
              />
            ))
          )}
        </div>

        {/* Real-time indicator */}
        <div className="fixed bottom-4 right-4">
          <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 shadow-lg">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
            <span className="text-sm text-muted-foreground">Live Updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};