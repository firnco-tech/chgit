import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { addLanguageToPath } from "@/lib/i18n";

export default function CartPage() {
  const { items, removeItem, clearCart, getTotal } = useCart();
  const [, setLocation] = useLocation();
  const { t, currentLanguage } = useTranslation();

  const handleCheckout = () => {
    setLocation(addLanguageToPath('/checkout', currentLanguage));
  };

  const handleBackToBrowse = () => {
    setLocation(addLanguageToPath('/browse', currentLanguage));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Start browsing profiles to add them to your cart
            </p>
            <Button 
              onClick={handleBackToBrowse}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              Browse Profiles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">{items.length} profile{items.length !== 1 ? 's' : ''} in your cart</p>
            </div>
            <Button
              variant="outline"
              onClick={handleBackToBrowse}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Browsing
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Profile Image */}
                    <div className="w-32 h-32 flex-shrink-0">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No photo</span>
                        </div>
                      )}
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>Age: {item.age}</span>
                            <span>•</span>
                            <span>{item.location}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary mb-2">
                            ${item.price}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} profile{items.length !== 1 ? 's' : ''})</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>

                {/* Security & Info */}
                <div className="pt-4 border-t">
                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      Secure payment processing
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      Instant contact information delivery
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}