
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faEllipsisH, faExternalLinkAlt, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Image, Button, Table, Dropdown, ProgressBar, Pagination, ButtonGroup, Modal } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../routes";
import http from "../config/configAPI";
import { ProductForm } from "../product/ProductForm";


export const ProductsList = () => {
  const [showDefault, setShowDefault] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [listCategorys, setListCategorys] = React.useState([]);

  const handleClose = () => setShowDefault(false);

  const [products, setlistProducts] = React.useState([]);
  const [product, setProduct] = React.useState({});
  const [reload, setReload] = React.useState(false);
  useEffect(() => {
    http.get(
      'Product/GetUiList',
    ).then(result => {
      setlistProducts(result.data.result.results);
    });

    http.get('/ProductCategory/GetUiList')
      .then(result => {
          setListCategorys(result.data.result.filter(item => item.id === 6)[0].subCategories);
      });
  }, [reload]);

  const handleClick = (id) => {
    setModalKey(modalKey+1);
    setProduct(products.filter(x=>x.id==id)[0])
    setShowDefault(true)
  };
  const handleNewProduct = () => {
    setProduct({});
    setModalKey(modalKey+1);
    setShowDefault(true);
  };
  const handleDeleteClick = (id) => {

    if(window.confirm("Are you sure wanto delete this product ?")){
      http.post('/Product/'+id)
      .then(res => {
        alert('Sucessfull');
        setReload(!reload);
      })
      .catch(err => {
        alert(err.response.data.errors);
      });
    }
    
  };

  const totalTransactions = products.length;
  const TableRow = (props) => {
    const { id, name, saleCount, category, retailPrice, variation } = props;
    return (
      <tr>
        <td>
          <Card.Link as={Link} to={"#"} onClick={(e) =>handleClick(id)} className="fw-normal">
            {id}
          </Card.Link>
        </td>
        <td>
          <span className="fw-normal">
            {name}
          </span>
        </td>
        <td>
          {category.map(item => (
            <span key={item.id} className="fw-normal">
              - {item.name}
              <br />
            </span>
          ))}
        </td>
        <td>
          <span className="fw-normal">
            {retailPrice.toLocaleString()}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {variation && variation.map((item, index) => (
              <span key={index} className="fw-normal">
                <span>
                  <span>- {item.color}
                    <label style={{ marginBottom: -2 + 'px', marginLeft: 5 + 'px', width: 0.75 + 'rem', height: 0.75 + 'rem', background: `${item.color}`, borderRadius: 50 + '%' }} >
                    </label>
                  </span>
                </span>
                {item.size.map((size, subindex) => (
                  <span key={subindex} className="fw-normal">
                    <br />
                    <span className="size" style={{ marginLeft: 10 + '%' }}>
                      - Size: {size.name} - Stock: {size.quantity}
                    </span>
                  </span>
                ))}
                {index == 0 ? (<br />) : ("")}
              </span>
            ))}
          </span>
        </td>
        <td>
          <span className={`fw-normal`}>
            {saleCount}
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* <Dropdown.Item onClick={(e) =>handleClick(id)}>
                <FontAwesomeIcon icon={faEye} className="me-2" /> View Details
              </Dropdown.Item> */}
              <Dropdown.Item onClick={(e) =>handleClick(id)}>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
              </Dropdown.Item>
              <Dropdown.Item className="text-danger" onClick={(e) =>handleDeleteClick(id)}>
                <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Remove
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };
  return (
    <>
      <Button variant="primary" className="my-3" onClick={() => handleNewProduct()}>New Product</Button>
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">Id</th>
                <th className="border-bottom">Name</th>
                <th className="border-bottom">Category</th>
                <th className="border-bottom">Price</th>
                <th className="border-bottom">Color - Size - Stock</th>
                <th className="border-bottom">Sell</th>
                <th className="border-bottom">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* {transactions.map(t => <TableRow key={`transaction-${t.invoiceNumber}`} {...t} />)} */}
              {products.map((t, index) => (
                <TableRow key={`transaction-${index + 1}`} {...t}>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
            <Nav>
              <Pagination className="mb-2 mb-lg-0">
                <Pagination.Prev>
                  Previous
                </Pagination.Prev>
                <Pagination.Item active>1</Pagination.Item>
                <Pagination.Item>2</Pagination.Item>
                <Pagination.Item>3</Pagination.Item>
                <Pagination.Item>4</Pagination.Item>
                <Pagination.Item>5</Pagination.Item>
                <Pagination.Next>
                  Next
                </Pagination.Next>
              </Pagination>
            </Nav>
            <small className="fw-bold">
              Showing <b>{totalTransactions}</b> out of <b>25</b> entries
            </small>
          </Card.Footer>
        </Card.Body>
        <ProductForm
        key={modalKey}
        show={showDefault}
        onHide={() => handleClose()}
        product={product}
        listCategorys={listCategorys}
        setReload={setReload}
        reload={reload}
        />
      </Card>
    </>





  );

};



