import ProductCard from '../ProductCard';

export default function ProductCardExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <ProductCard
        id="1"
        name="Team Jersey"
        price={45.99}
        image="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop"
        category="Apparel"
        inStock={true}
        onAddToCart={() => console.log('Added to cart')}
      />
      <ProductCard
        id="2"
        name="Basketball"
        price={29.99}
        image="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop"
        category="Equipment"
        inStock={true}
        onAddToCart={() => console.log('Added to cart')}
      />
      <ProductCard
        id="3"
        name="Sweatband Set"
        price={12.99}
        image="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop"
        category="Accessories"
        inStock={false}
        onAddToCart={() => console.log('Added to cart')}
      />
    </div>
  );
}
