import { useEffect, useState } from 'react';
import './App.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const COLORS = [
  { key: 'yellow', label: 'Yellow Gold', code: '#e6ca97' },
  { key: 'white', label: 'White Gold', code: '#d9d9d9' },
  { key: 'rose', label: 'Rose Gold', code: '#e1a4a9' },
];

function Stars({ score }) {
  const fullStars = Math.floor(score);
  const halfStar = score - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="stars">
      {Array(fullStars).fill(0).map((_, i) => <span key={i}>★</span>)}
      {halfStar && <span>☆</span>}
      {Array(emptyStars).fill(0).map((_, i) => <span key={i+10}>☆</span>)}
    </span>
  );
}

function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState('yellow');
  const colorObj = COLORS.find(c => c.key === selectedColor);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.images[selectedColor]} alt={product.name} />
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        <div className="product-price">{product.priceFormatted}</div>
        <div className="product-weight">Ağırlık: {product.weight}g</div>
        <div className="color-picker">
          {COLORS.map((color) => (
            <button
              key={color.key}
              className={`color-btn ${color.key} ${selectedColor === color.key ? 'active' : ''}`}
              onClick={() => setSelectedColor(color.key)}
              aria-label={color.label}
            />
          ))}
        </div>
        <div className="selected-color-label">{colorObj.label}</div>
        <div className="product-popularity">
          <Stars score={parseFloat(product.popularityScore5)} />
          <span>{product.popularityScore5}/5</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Ürünler yüklenemedi.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-list">
      <h1 className="product-list-title">Product List</h1>
      <div className="product-grid">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={32}
          slidesPerView={4}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={i}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default App;
