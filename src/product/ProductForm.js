
import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { Col, Row, Card, Form, Button, InputGroup, Modal } from '@themesberg/react-bootstrap';
import PropTypes from "prop-types";
import http from "../config/configAPI";
import config from "../config/index";


export const ProductForm = (props) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [listCategorys, setListCategorys] = React.useState(props.listCategorys);
  const [listSubCategorys, setListSubCategorys] = React.useState([]);
  const [category, setCategory] = React.useState("");
  const [subCategory, setSubCategory] = React.useState("");
  const [image, setImage] = React.useState("");
  const [productName, setProductName] = React.useState('');
  const [oldPrice, setOldPrice] = React.useState(0);
  const [retailPrice, setRetailPrice] = React.useState(0);
  const [shortDescription, setShortDescription] = React.useState("");
  const [fullDescription, setFullDescription] = React.useState("");
  var newImage=""
  const loadProductData = async () => {
    try {
      if (props.product.id) {
        debugger
        await setProductName(props.product.name)
        await setOldPrice(props.product.oldPrice)
        await setRetailPrice(props.product.retailPrice)
        await setCategory(props.product.productCategory && props.product.productCategory.parentId)
        await handleParentCategoryChange(props.product.productCategory && props.product.productCategory.parentId)
        await setSubCategory(props.product.productCategory.id);
        await setShortDescription(props.product.description);
        await setFullDescription(props.product.fullDescription);
        const newProductDetails = [];
        props.product.variation && props.product.variation.map(item => (
          item.size.map((size) => (
            newProductDetails.push({ color: item.color, size: size.name, quantity: size.quantity })
          ))
        ));
        setProductDetails(newProductDetails);
        console.log(productDetails)
        const newProductImages = [];
        props.product.productImage.map(item => (
          newProductImages.push(config.Image + item)
        ));
        await setImageURLs(newProductImages)
        await setImage(props.product.productImage.join(';'));

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (props.product.id) {
      loadProductData();
    }else{
      setProductDetails([{ color: "white", size: "S", quantity: 0 }]);
    }
  }, [props.product]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
    setImage(Array.from(files).map((file, index) => file.name).join(';'));
    // Đọc và hiển thị hình ảnh
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        urls.push(e.target.result);
        if (urls.length === files.length) {
          setImageURLs(urls);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleNewDetail = () => {
    const newProductDetail = { color: "white", size: "S", quantity: 0 };
    setProductDetails([...productDetails, newProductDetail]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('id', props.product.id ? props.product.id : 0);
    if (Array.from(selectedFiles).length > 0) {
      Array.from(selectedFiles).forEach((file, index) => {
        formData.append(`files`, file);
      });
      const response = await http.post('/UploadPicture/UploadMultipleFileWithId', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      newImage= response.data.file.join(';');
      setImage(response.data.file.join(';'));
      console.log(newImage);

    }
  };

  const checkValid = () =>{
    if(productName==""){
      alert('Please input product name before save!');
      return false
    }
    if(subCategory==""){
      alert('Please choose category before save!');
      return false
    }
    if(oldPrice < 0){
      alert('Old price must >= 0 !');
      return false
    }
    if(retailPrice <= 0){
      alert('Retail price must > 0 !');
      return false
    }
    if((newImage!= "" ? newImage : image) == ""){
      alert('Please upload product picture before save !');
      return false
    }
    return true
  }
  const  handleNew = async () =>{
    if (checkValid()) {
      var obj = {
        name: productName,
        imageUrl: newImage!= "" ? newImage : image,
        oldPrice: oldPrice,
        retailPrice: retailPrice,
        categoryId: subCategory,
        description:shortDescription,
        fullDescription:fullDescription,
        Product_Detail:sumArrayItems(productDetails),
        hashTag:""
      };
      await http.post('/Product/Add', obj)
        .then(res => {
          alert('Sucessfull');
          props.onHide(false)
          props.setReload(!props.reload)
        })
        .catch(err => {
          alert(err.response.data.errors);
        });
    }
  }

  const  handleUpdate = async () =>{
    if (checkValid()) {
      var obj = {
        id:props.product.id,
        name: productName,
        imageUrl: newImage!= "" ? newImage : image,
        oldPrice: oldPrice,
        retailPrice: retailPrice,
        categoryId: subCategory,
        description:shortDescription,
        fullDescription:fullDescription,
        Product_Detail:sumArrayItems(productDetails),
        hashTag:""
      };
      await http.post('/Product/Update', obj)
        .then(res => {
          alert('Sucessfull');
          props.onHide(false)
          props.setReload(!props.reload)
        })
        .catch(err => {
          alert(err.response.data.errors);
        });
    }
  }
  const handleSave = async (e) => {
    await onFileUpload();
    if(props.product.id){
      await handleUpdate(); 
    }else{
      await handleNew(); 
    }
  };

  const handleColorChange = (index, color) => {
    const updatedProductDetails = [...productDetails];
    updatedProductDetails[index].color = color;
    setProductDetails(updatedProductDetails);
  };

  const handleSizeChange = (index, size) => {
    const updatedProductDetails = [...productDetails];
    updatedProductDetails[index].size = size;
    setProductDetails(updatedProductDetails);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProductDetails = [...productDetails];
    updatedProductDetails[index].quantity = quantity;
    setProductDetails(updatedProductDetails);
  };

  const handleParentCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
    if (selectedOption == "") {
      setListSubCategorys([]);
    } else {
      setListSubCategorys(listCategorys.filter(item => item.id == selectedOption)[0].subCategories)
    }
  };

  const handleSubCategoryChange = (selectedOption) => {
    setSubCategory(selectedOption);
  };

  function sumArrayItems(arr) {
    return arr.reduce((acc, curr) => {
      const { color, size, quantity } = curr;
      const quantityAsInt = parseInt(quantity, 10);
  
      if (!isNaN(quantityAsInt)) {
        const existingItem = acc.find((item) => item.color === color && item.size === size);
  
        if (existingItem) {
          existingItem.quantity += quantityAsInt;
        } else {
          acc.push({ color, size, quantity: quantityAsInt });
        }
      } else {
        console.log(`Không thể chuyển đổi "${quantity}" thành số nguyên.`);
      }
  
      return acc;
    }, []);
  }

  return (

    <Modal as={Modal.Dialog} centered size="lg" show={props.show} onHide={props.onHide}>
      <Modal.Header>
        <Modal.Title className="h6">Product information</Modal.Title>
        <Button variant="close" aria-label="Close" onClick={props.onHide} />
      </Modal.Header>
      <Modal.Body >
        <Card border="light" className="bg-white shadow-sm mb-4">
          <Card.Body>
            {/* <h5 className="mb-4">Product information</h5> */}
            <Form>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group id="productName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control required type="text" onChange={(e) => setProductName(e.target.value)} value={productName || ''} placeholder="Enter your product name" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Form.Label>Category</Form.Label>
                <Col sm={6} className="mb-3">
                  <Form.Group className="mb-2">
                    <Form.Select id="catogoryParent" value={category} onChange={(e) => handleParentCategoryChange(e.target.value)}>
                      <option value="">Choose</option>
                      {listCategorys && listCategorys.map((item, index) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6} className="mb-3">
                  <Form.Group className="mb-2">
                    <Form.Select id="catogory" value={subCategory} onChange={(e) => handleSubCategoryChange(e.target.value)}>
                      <option value="">Choose</option>
                      {listSubCategorys && listSubCategorys.map((item, index) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group id="oldPrice">
                    <Form.Label>Old Price</Form.Label>
                    <Form.Control required type="number" value={oldPrice || 0} onChange={(e) => setOldPrice(e.target.value)} placeholder="0" />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group id="retailPrice">
                    <Form.Label>Retail Price</Form.Label>
                    <Form.Control required type="number" value={retailPrice || 0} onChange={(e) => setRetailPrice(e.target.value)} placeholder="0" />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col sm={12} className="mb-3">
                  <Form.Group className="mb-3" controlId="shortDescription">
                    <div className={'d-flex justify-content-between align-items-center'}>
                      <Form.Label>Product Detail</Form.Label>
                      <Button variant="primary" onClick={handleNewDetail}>New</Button>
                    </div>
                    {productDetails.map((detail, index) => (
                      <ProductDetail
                        key={index}
                        color={detail.color}
                        size={detail.size}
                        quantity={detail.quantity}
                        onColorChange={(color) => handleColorChange(index, color)}
                        onSizeChange={(size) => handleSizeChange(index, size)}
                        onQuantityChange={(quantity) => handleQuantityChange(index, quantity)}
                      />
                    ))}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} className="mb-3">
                  <Form.Label>Images</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".png, .jpg, .jpeg"
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={12} className="mb-3">
                  <div>
                    {imageURLs.map((url, index) => (
                      <img key={index} src={url} alt={`Hình ảnh ${index}`} width="25%" />
                    ))}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={12} className="mb-3">
                  <Form.Group className="mb-3" controlId="shortDescription">
                    <Form.Label>Short Description</Form.Label>
                    <Form.Control as="textarea" value={shortDescription || ''} onChange={(e) => setShortDescription(e.target.value)} rows={3} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} className="mb-3">
                  <Form.Group className="mb-3" controlId="fullDescription">
                    <Form.Label>Full Description</Form.Label>
                    <Form.Control as="textarea" value={fullDescription || ''} onChange={(e) => setFullDescription(e.target.value)} rows={5} />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <div className="mt-3">
          <Button variant="primary" type="submit" onClick={handleSave}>Save</Button>
        </div>
        {/* <Button variant="link" className="text-gray ms-auto" onClick={props.onHide}>
          Close
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

const ProductDetail = ({ color, size, quantity, onColorChange, onSizeChange, onQuantityChange }) => {
  return (
    <Row>
      <Col sm={4} className="mb-3">
        <Form.Group className="mb-2">
          <Form.Label>Color</Form.Label>
          <Form.Select id="color" defaultValue={color} onChange={(e) => onColorChange(e.target.value)}>
            <option value="white">White</option>
            <option value="black">Black</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col sm={4} className="mb-3">
        <Form.Group className="mb-2">
          <Form.Label>Size</Form.Label>
          <Form.Select id="size" defaultValue={size} onChange={(e) => onSizeChange(e.target.value)}>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col sm={4}>
        <Form.Group className="mb-2">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            placeholder="0"
          />
        </Form.Group>
      </Col>
    </Row>
  );
};
ProductForm.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
  product: PropTypes.object,
  listCategorys: PropTypes.array,
  reload: PropTypes.bool,
  setReload: PropTypes.func,
};
