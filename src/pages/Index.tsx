// Update this page (the content is just a fallback if you fail to update the page)

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderDashboard } from "@/components/order-dashboard";
import { CustomerTracking } from "@/components/customer-tracking";
import { FulfillmentDashboard } from "@/components/fulfillment-dashboard";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <OrderDashboard />;
      case "tracking":
        return <CustomerTracking />;
      case "fulfillment":
        return <FulfillmentDashboard />;
      default:
        return <OrderDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold">E-Commerce Order System</h1>
            <div className="flex gap-2">
              <Button 
                variant={activeView === "dashboard" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveView("dashboard")}
              >
                Order Management
              </Button>
              <Button 
                variant={activeView === "tracking" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveView("tracking")}
              >
                Customer Tracking
              </Button>
              <Button 
                variant={activeView === "fulfillment" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveView("fulfillment")}
              >
                Fulfillment Center
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderView()}
    </div>
  );
};

export default Index;
