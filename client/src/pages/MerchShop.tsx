import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, X, Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const products = [
  {
    id: '1',
    name: 'Team Jersey',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop',
    category: 'Apparel',
    inStock: true,
  },
  {
    id: '2',
    name: 'Basketball',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
    category: 'Equipment',
    inStock: true,
  },
  {
    id: '3',
    name: 'Sweatband Set',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
    category: 'Accessories',
    inStock: false,
  },
  {
    id: '4',
    name: 'Hoops Cap',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
    category: 'Apparel',
    inStock: true,
  },
  {
    id: '5',
    name: 'Training Shorts',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    category: 'Apparel',
    inStock: true,
  },
  {
    id: '6',
    name: 'Water Bottle',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: 'Accessories',
    inStock: true,
  },
];

export default function MerchShop() {
  const { items, addItem, updateQuantity, removeItem, total, clearCart } = useCart();
  const { toast } = useToast();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Apparel', 'Equipment', 'Accessories'];

  const filteredProducts = filter === 'All'
    ? products
    : products.filter((p) => p.category === filter);

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleCheckout = () => {
    toast({
      title: 'Checkout',
      description: 'Redirecting to checkout...',
    });
    console.log('Proceeding to checkout with items:', items);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Merchandise Shop</h1>
          <p className="text-muted-foreground">Official Stormers360 gear and equipment</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2" data-testid="button-view-cart">
              <ShoppingCart className="w-4 h-4" />
              Cart ({items.length})
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Shopping Cart</SheetTitle>
              <SheetDescription>
                {items.length === 0 ? 'Your cart is empty' : `${items.length} items in cart`}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-8 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-mono text-primary mb-2">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-mono w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {items.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="font-mono">${total.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full" data-testid="button-checkout">
                  Checkout
                </Button>
                <Button variant="outline" onClick={clearCart} className="w-full" data-testid="button-clear-cart">
                  Clear Cart
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={filter === category ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setFilter(category)}
            data-testid={`filter-${category.toLowerCase()}`}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}
