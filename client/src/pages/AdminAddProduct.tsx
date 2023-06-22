import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Input from '../components/Input';
import MUITransferList from '../components/MUITransferList';
import prefectureList from '../data/prefectures.json';
import '../styles/Login.css';

function AdminAddProduct() {
  const navigate = useNavigate();
  const auth = UserAuth();

  const [productName, setProductName] = useState<string>('');
  const [productUrl, setProductUrl] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [selectedPrefs, setSelectedPrefs] = useState<number[]>([]);

  const [isSending, setIsSending] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('Sending...')

  const isValidProduct = (input: Product) => {
    if (input.product_name === '') { 
      setAlertMessage('Product name required.');
      return false;
    }

    if (input.link_url === '') {
      setAlertMessage('Link URL required.');
      return false;
    }

    if (input.img_url === '') {
      setAlertMessage('Image required.');
      return false;
    }

    if (input.location.length < 1) {
      setAlertMessage('Locations required.');
      return false;
    }

    if (input.id) { return false; }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSending(true);
    const newProduct: Product = {
      product_name: productName.trim(),
      link_url: productUrl.trim(),
      img_url: image.trim(),
      location: selectedPrefs
    };

    if (startDate !== '') {
      newProduct.start_date = startDate;
    }
    if (endDate !== '') {
      newProduct.end_date = endDate;
    }

    console.log(newProduct);
    if (isValidProduct(newProduct)) {
      axios.post(`/api/products/newProduct/`, newProduct, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': auth?.csrftoken ?? ""
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setAlertMessage('Successfully Added!')
          // navigate(0);
        } else if (response.status >= 300) {
          setAlertMessage(response.data)
        }
      })
      .catch((err) => {
        setAlertMessage(err)
        console.log(err);
      });
    }
  };

  return (
    <>
      <Header
        mainText='OriOri Admin'
        secondaryText='Submit New Product'/>
      <form
        onSubmit = { handleSubmit }>
        
        <label>
          { 'Product Name: ' }
          <Input 
            className = 'admin__input'
            placeholder = 'Product Name'
            type = 'text'
            value = { productName }
            onChange = { (e) => setProductName(e.target.value) }
            required
            />
        </label>

        <label>
          { 'Link URL: ' }
          <Input 
            className = 'admin__input'
            placeholder = 'Link URL'
            type = 'url'
            value = { productUrl }
            onChange = { (e) => setProductUrl(e.target.value) }
            required
            />
        </label>

        <label>
          { 'Image: ' }
          <Input 
            className = 'admin__input'
            placeholder = ''
            type = 'file'
            value = { image }
            onChange = { (e) => setImage(e.target.value) }
            required
            />
        </label>
        
        <label>
          { 'Start Date: ' }
          <Input 
            className = 'admin__input'
            placeholder = ''
            type = 'date'
            value = { startDate }
            onChange = { (e) => setStartDate(e.target.value) }
            />
        </label>

        <label>
          { 'End Date: ' }
          <Input 
            className = 'admin__input'
            placeholder = ''
            type = 'date'
            value = { endDate }
            onChange = { (e) => setEndDate(e.target.value) }
            />
        </label>

        <MUITransferList options={ prefectureList } setSelected={ setSelectedPrefs }/>
        
        { isSending
          ? <div className='admin__sending-msg'>{ alertMessage }</div>
          : <></> }
        
        <Button 
          className = 'admin__button'
          text = 'Submit'
          type = 'submit'/>
      </form>

      <Footer/>
    </>
  );
};

export default AdminAddProduct;