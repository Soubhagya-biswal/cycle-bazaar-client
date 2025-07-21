import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function ShippingPage() {
    const { shippingAddress, saveShippingAddress } = useContext(CartContext);
    
    // Initialize state with address from context (which is from localStorage)
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country });
        navigate('/payment');
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h1>Shipping Details</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='address' className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type='text' placeholder='Enter address' value={address} required onChange={(e) => setAddress(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='city' className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control type='text' placeholder='Enter city' value={city} required onChange={(e) => setCity(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='postalCode' className="mb-3">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control type='text' placeholder='Enter postal code' value={postalCode} required onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='country' className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control type='text' placeholder='Enter country' value={country} required onChange={(e) => setCountry(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary' className="w-100 mt-2">
                        Proceed to Payment
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default ShippingPage;