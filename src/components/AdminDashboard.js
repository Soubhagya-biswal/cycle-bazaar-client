/* eslint-disable react-hooks/exhaustive-deps */
// client/src/components/AdminDashboard.js

import React, { useState, useEffect, useContext } from 'react'; 
import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext'; 

function AdminDashboard() {
  const { userInfo } = useContext(AuthContext); 

  const [cycles, setCycles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    imageUrl: '',
    description: '', 
    stock: ''        
  });

  useEffect(() => {
    fetchCycles();
    fetchOrders();
  }, []);

  const fetchCycles = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cycles/`)
      .then(res => res.json())
      .then(data => setCycles(data.cycles))
      .catch(err => console.error('Error fetching cycles:', err));
  };
     const fetchOrders = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
    })
    .then(res => res.json())
    .then(data => setOrders(data))
    .catch(err => console.error('Error fetching orders:', err));
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cycles/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`, 
      },
      body: JSON.stringify(formData),
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) { 
        alert(data.message);
      } else { 
        alert('Error adding cycle: ' + (data.error || 'Unknown error'));
      }
      setFormData({ brand: '', model: '', price: '', imageUrl: '', description: '', stock: '' }); 
      fetchCycles();
    })
    .catch(err => alert('Error adding cycle. Check console for details.')); 
  };

  const deleteCycle = (id) => {
    if (window.confirm('Are you sure you want to delete this cycle?')) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/cycles/${id}`, {
        method: 'DELETE',
        headers: {
        },
      })
      .then(res => {
        if (res.ok) { 
          return res.json(); 
        } else {
          throw new Error('Failed to delete cycle: ' + res.statusText);
        }
      })
      .then(data => {
        alert(data.message); 
        fetchCycles();
      })
      .catch(err => alert('Error deleting cycle: ' + err.message)); 
    }
  };
       const handleCancellationAction = async (orderId, action) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderId}/manage-cancellation`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            },
            body: JSON.stringify({ action })
        });
        if (!res.ok) throw new Error('Action failed');

        alert(`Order cancellation has been ${action}d.`);
        fetchOrders(); 
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
  };
  
  const cancellationRequests = orders.filter(order => order.status === 'Cancellation Requested');
  return (
    <div className="admin-container">
      {/* Add Cycle Form */}
      <form onSubmit={handleSubmit} className="add-cycle-form">
        <h2>Add a New Cycle</h2>
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required />
        <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model" required />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required />
        {/* NEW: Description Field */}
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required rows="4"></textarea>
        {/* NEW: Stock Field */}
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required min="0" />
        <button type="submit">Add Cycle</button>
      </form>
               {/* NEW SECTION: Cancellation Requests */}
      <div className="admin-cancellation-list mt-5">
        <h2>Cancellation Requests ({cancellationRequests.length})</h2>
        {cancellationRequests.length > 0 ? (
          <Table striped bordered hover responsive variant="dark">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cancellationRequests.map(order => (
                <tr key={order._id}>
                  <td><Link to={`/order/${order._id}?adminView=true`}>{order._id}</Link></td>
                  <td>{order.user ? order.user.name : 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.cancellationDetails.reason}</td>
                  <td>
                    <Button variant="success" size="sm" className="me-2" onClick={() => handleCancellationAction(order._id, 'approve')}>
                      Approve
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleCancellationAction(order._id, 'reject')}>
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No pending cancellation requests.</p>
        )}
      </div>
      {/* Cycle List for Admin */}
      <div className="admin-cycle-list">
        <h2>Manage Cycles</h2>
        {cycles.map(cycle => (
          <div key={cycle._id} className="admin-cycle-item">
            <span>{cycle.brand} {cycle.model}</span>
            <div>
              <Link to={`/edit/${cycle._id}`} className="edit-btn">Edit</Link>
              <button onClick={() => deleteCycle(cycle._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;