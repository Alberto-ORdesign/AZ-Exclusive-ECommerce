import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CestaScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCesta = async (item, cantidad) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < cantidad) {
      window.alert('Lo sentimos. Producto fuera de stock.');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, cantidad },
    });
  };
  const borrarUnProducto = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const tramitarPedido = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Cesta AZ Exclusive</title>
      </Helmet>
      <h1>Cesta</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              La cesta está vacía. <Link to="/">Comprar.</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.nombre}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() => updateCesta(item, item.cantidad - 1)}
                        variant="light"
                        disabled={item.cantidad === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.cantidad}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() => updateCesta(item, item.cantidad + 1)}
                        disabled={item.cantidad === item.stock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>{item.precio}€</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => borrarUnProducto(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.cantidad, 0)}{' '}
                    Productos) : €
                    {cartItems.reduce((a, c) => a + c.precio * c.cantidad, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={tramitarPedido}
                      disabled={cartItems.length === 0}
                    >
                      Tramitar pedido
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
