import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { OrderWithItems, OrderStatus } from "@shared/schema";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Price } from "@/components/ui/price";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Clock, CheckCircle, Truck, Package } from "lucide-react";
import { format } from "date-fns";

export default function OrdersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: orders = [], isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${user!.id}`, { credentials: 'include' });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    enabled: !!user,
  });
  
  // Helper function to get status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "delivering":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";
    }
  };

  // Helper function to get order progress
  const getOrderProgress = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { progress: 20, currentStep: 1, estimatedTime: "15-20 mins" };
      case "processing":
        return { progress: 50, currentStep: 2, estimatedTime: "10-15 mins" };
      case "delivering":
        return { progress: 80, currentStep: 3, estimatedTime: "5-10 mins" };
      case "delivered":
        return { progress: 100, currentStep: 4, estimatedTime: "Delivered" };
      case "cancelled":
        return { progress: 0, currentStep: 0, estimatedTime: "Cancelled" };
      default:
        return { progress: 0, currentStep: 0, estimatedTime: "Unknown" };
    }
  };

  // Order tracking steps
  const trackingSteps = [
    { id: 1, name: "Order Placed", icon: Clock, description: "Your order has been received" },
    { id: 2, name: "Preparing", icon: Package, description: "Chef is preparing your food" },
    { id: 3, name: "Out for Delivery", icon: Truck, description: "Your order is on the way" },
    { id: 4, name: "Delivered", icon: CheckCircle, description: "Enjoy your meal!" }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="bg-muted rounded-full p-6 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  You haven't placed any orders yet. Browse our menu and place your first order!
                </p>
                <Button asChild>
                  <a href="/">Browse Menu</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 border-b border-border">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.createdAt ? format(new Date(order.createdAt), 'MMM d, yyyy - h:mm a') : 'Processing'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getStatusColor(order.status as OrderStatus)}`}>
                          {order.status}
                        </span>
                        <Price value={order.total} />
                      </div>
                    </div>
                  </CardHeader>

                  {/* Order Tracking Progress */}
                  <div className="px-6 py-4 bg-card border-b border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-foreground">Order Progress</h3>
                      <Badge variant="outline" className="text-xs">
                        {getOrderProgress(order.status as OrderStatus).estimatedTime}
                      </Badge>
                    </div>

                    <Progress
                      value={getOrderProgress(order.status as OrderStatus).progress}
                      className="mb-4 h-2"
                    />

                    <div className="flex justify-between items-center">
                      {trackingSteps.map((step, index) => {
                        const IconComponent = step.icon;
                        const isCompleted = step.id <= getOrderProgress(order.status as OrderStatus).currentStep;
                        const isCurrent = step.id === getOrderProgress(order.status as OrderStatus).currentStep;

                        return (
                          <div key={step.id} className="flex flex-col items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : isCurrent
                                  ? 'bg-primary text-primary-foreground animate-pulse'
                                  : 'bg-muted text-muted-foreground'
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className={`text-xs text-center leading-tight ${
                              isCompleted || isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                            }`}>
                              {step.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="items" className="border-0">
                        <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                          <span className="font-medium">Order Details</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="space-y-3">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-4 py-2 text-left">Item</th>
                                    <th className="px-4 py-2 text-right">Quantity</th>
                                    <th className="px-4 py-2 text-right">Price</th>
                                    <th className="px-4 py-2 text-right">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item, index) => (
                                    <tr key={index} className="border-b border-border">
                                      <td className="px-4 py-3">
                                        <div className="flex items-center">
                                          <img
                                            src={item.menuItem.imageUrl || undefined}
                                            alt={item.menuItem.name}
                                            className="w-10 h-10 rounded-md object-cover mr-3"
                                          />
                                          <div>
                                            <p className="font-medium text-foreground">{item.menuItem.name}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-muted-foreground text-right">{item.quantity}</td>
                                      <td className="px-4 py-3 text-muted-foreground text-right">
                                        <Price value={item.menuItem.price} size="sm" />
                                      </td>
                                      <td className="px-4 py-3 text-foreground font-medium text-right">
                                        <Price value={item.menuItem.price * item.quantity} size="sm" />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-4 text-sm">
                              <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Subtotal</span>
                                <Price value={order.total - 2.99} size="sm" />
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Delivery Fee</span>
                                <Price value={2.99} size="sm" />
                              </div>
                              <div className="flex justify-between py-1 font-medium">
                                <span className="text-foreground">Total</span>
                                <Price value={order.total} size="sm" className="font-medium" />
                              </div>
                            </div>

                            {order.address && (
                              <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                                <p className="font-medium mb-1">Delivery Address</p>
                                <p className="text-muted-foreground">{order.address}</p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <CartSidebar />
    </div>
  );
}
