import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const anyadirAlCarrito = async (item) => {
    const productoExistente = cartItems.find((x) => x._id === product._id);
    const cantidad = productoExistente ? productoExistente.cantidad + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.stock < cantidad) {
      window.alert('Lo sentimos. Producto fuera de stock.');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, cantidad },
    });
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.imagen}
          className="card-img-top"
          alt={product.nombre}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.nombre}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>{product.precio}€</Card.Text>
        {product.stock === 0 ? (
          <Button variant="light" disabled>
            Producto sin stock
          </Button>
        ) : (
          <Button onClick={() => anyadirAlCarrito(product)}>
            Añadir a la cesta
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
