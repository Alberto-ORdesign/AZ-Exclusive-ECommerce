import data from './data';

function App() {
  return (
    <div>
      <header>
        <a href="/">AZ Exclusive</a>
      </header>
      <main>
        <h1>Featured Products</h1>
        <div className="products">
          {data.products.map((product) => (
            <div className="product" key={product.slug}>
              <a href={`/product/${product.slug}`}>
                <img src={product.imagen} alt={product.nombre} />
              </a>
              <div className="product-info">
                <a href={`/product/${product.slug}`}>
                  <p>{product.nombre}</p>
                </a>
                <p>
                  <strong>{product.precio}€</strong>
                </p>
                <button>Añadir al carrito</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
