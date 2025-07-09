import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Users,
  Boxes,
  CalendarDays
} from "lucide-react";

interface FulfillmentOrder {
  id: string;
  customerName: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    sku: string;
    location: string;
    available: number;
  }>;
  total: number;
  createdAt: string;
  dueDate: string;
  notes?: string;
}

const mockFulfillmentOrders: FulfillmentOrder[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    status: "pending",
    priority: "high",
    assignedTo: "Sarah Johnson",
    items: [
      { id: "1", name: "Wireless Headphones", quantity: 1, sku: "WH-001", location: "A1-B2", available: 25 },
      { id: "2", name: "Phone Case", quantity: 2, sku: "PC-001", location: "A2-C3", available: 100 }
    ],
    total: 139.97,
    createdAt: "2024-01-15T10:30:00Z",
    dueDate: "2024-01-17T17:00:00Z",
    notes: "Customer requested expedited shipping"
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    status: "processing",
    priority: "medium",
    assignedTo: "Mike Wilson",
    items: [
      { id: "3", name: "Laptop Stand", quantity: 1, sku: "LS-001", location: "B1-A4", available: 15 },
      { id: "4", name: "USB-C Cable", quantity: 3, sku: "UC-001", location: "C1-D2", available: 200 }
    ],
    total: 88.96,
    createdAt: "2024-01-15T09:15:00Z",
    dueDate: "2024-01-16T17:00:00Z"
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    status: "shipped",
    priority: "low",
    assignedTo: "Lisa Chen",
    items: [
      { id: "5", name: "Gaming Mouse", quantity: 1, sku: "GM-001", location: "D1-E3", available: 8 }
    ],
    total: 79.99,
    createdAt: "2024-01-14T14:45:00Z",
    dueDate: "2024-01-16T17:00:00Z"
  }
];

export const FulfillmentDashboard = () => {
  const [orders, setOrders] = useState(mockFulfillmentOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<FulfillmentOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          // Simulate order status updates
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
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesPriority = filterPriority === "all" || order.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "high": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStats = () => {
    const now = new Date();
    const overdue = orders.filter(o => new Date(o.dueDate) < now && o.status !== "delivered").length;
    const urgent = orders.filter(o => o.priority === "urgent" || o.priority === "high").length;
    const activeOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length;
    
    return {
      total: orders.length,
      active: activeOrders,
      overdue,
      urgent,
      completed: orders.filter(o => o.status === "delivered").length,
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Fulfillment Center
              </h1>
              <p className="text-muted-foreground">Order processing and inventory management</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="hero" size="sm">
                <Package className="h-4 w-4" />
                New Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Boxes className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-status-processing">{stats.active}</p>
                </div>
                <Clock className="h-8 w-8 text-status-processing" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-destructive">{stats.overdue}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                  <p className="text-2xl font-bold text-warning">{stats.urgent}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer, or assigned staff..."
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
            </select>
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">Customer: {order.customerName}</p>
                      {order.assignedTo && (
                        <p className="text-sm text-muted-foreground">Assigned to: {order.assignedTo}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items to Pick</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {item.sku} | Location: {item.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Qty: {item.quantity}</p>
                          <p className="text-xs text-muted-foreground">
                            Available: {item.available}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Meta */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      Due: {new Date(order.dueDate).toLocaleDateString()}
                    </div>
                    <div className="font-medium text-foreground">
                      Total: ${order.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status === "pending" && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleStatusChange(order.id, "processing")}
                      >
                        Start Processing
                      </Button>
                    )}
                    {order.status === "processing" && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleStatusChange(order.id, "shipped")}
                      >
                        Mark Shipped
                      </Button>
                    )}
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 p-3 bg-info/10 rounded-md">
                    <p className="text-sm text-info">📝 {order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
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