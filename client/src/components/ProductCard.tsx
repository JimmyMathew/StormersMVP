import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  onAddToCart?: () => void;
}

export default function ProductCard({
  name,
  price,
  image,
  category,
  inStock,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate">
      <div className="aspect-square bg-muted relative">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        {!inStock && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            Out of Stock
          </Badge>
        )}
      </div>
      <div className="p-4">
        <Badge variant="secondary" className="mb-2">{category}</Badge>
        <h3 className="font-semibold mb-1">{name}</h3>
        <p className="text-2xl font-bold font-mono text-primary mb-3">${price.toFixed(2)}</p>
        <Button
          onClick={onAddToCart}
          disabled={!inStock}
          className="w-full gap-2"
          data-testid={`button-add-cart-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
