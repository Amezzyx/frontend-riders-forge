import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { showAlert } = useAlert();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [graphicsRequests, setGraphicsRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestType, setRequestType] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, ordersData, allOrdersData, customersData, productsData, contactData, graphicsData] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAdminOrders().catch(() => []),
        api.getAllAdminOrders().catch(() => []),
        api.getAdminCustomers().catch(() => []),
        api.getProducts().catch(() => []),
        api.getContactRequests().catch(() => []),
        api.getGraphicsRequests().catch(() => [])
      ]);
      
      if (statsData) setStats(statsData);
      if (ordersData) setOrders(ordersData);
      if (allOrdersData) setAllOrders(allOrdersData);
      if (customersData) setCustomers(customersData);
      if (productsData) setProducts(productsData);
      if (contactData) setContactRequests(contactData);
      if (graphicsData) setGraphicsRequests(graphicsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(t('failedToLoadDashboard') || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/account');
      return;
    }
    loadDashboardData();
  }, [user, isAdmin, navigate, loadDashboardData]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to update order status:', err);
      showAlert(t('updateStatusError') || 'Failed to update order status', 'error');
    }
  };

  const handleRequestStatusChange = async (type, id, newStatus) => {
    try {
      await api.updateRequestStatus(type, id, newStatus);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to update request status:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <p className="loading-message">{t('loadingDashboardData') || 'Loading dashboard data...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>{t('adminDashboard') || 'Admin Dashboard'}</h1>
          <p>{t('adminWelcomeBack')?.replace('{name}', user?.name || 'Admin') || `Welcome back, ${user?.name || 'Admin'}`}</p>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="admin-layout">
          <div className="admin-sidebar">
            <nav className="admin-nav">
              <button
                className={activeSection === 'overview' ? 'active' : ''}
                onClick={() => setActiveSection('overview')}
              >
                {t('overview') || 'Overview'}
              </button>
              <button
                className={activeSection === 'orders' ? 'active' : ''}
                onClick={() => setActiveSection('orders')}
              >
                {t('orders') || 'Orders'}
              </button>
              <button
                className={activeSection === 'customers' ? 'active' : ''}
                onClick={() => setActiveSection('customers')}
              >
                {t('customers') || 'Customers'}
              </button>
              <button
                className={activeSection === 'products' ? 'active' : ''}
                onClick={() => setActiveSection('products')}
              >
                {t('products') || 'Products'}
              </button>
              <button
                className={activeSection === 'customerService' ? 'active' : ''}
                onClick={() => setActiveSection('customerService')}
              >
                {t('customerService') || 'Customer Service'}
              </button>
            </nav>
          </div>

          <div className="admin-content">
            {activeSection === 'overview' && (
              <div className="admin-section">
                <h2>{t('overview') || 'Overview'}</h2>
                {stats ? (
                  <>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <h3>{t('totalOrders') || 'Total Orders'}</h3>
                        <p className="stat-number">{stats.totalOrders || 0}</p>
                      </div>
                      <div className="stat-card">
                        <h3>{t('totalRevenue') || 'Total Revenue'}</h3>
                        <p className="stat-number">€{Number(stats.totalRevenue || 0).toFixed(2)}</p>
                      </div>
                      <div className="stat-card">
                        <h3>{t('pendingOrders') || 'Pending Orders'}</h3>
                        <p className="stat-number">{stats.pendingOrders || 0}</p>
                      </div>
                      <div className="stat-card">
                        <h3>{t('completedOrders') || 'Completed Orders'}</h3>
                        <p className="stat-number">{stats.completedOrders || 0}</p>
                      </div>
                      <div className="stat-card">
                        <h3>{t('totalProducts') || 'Total Products'}</h3>
                        <p className="stat-number">{stats.totalProducts || products.length || 0}</p>
                      </div>
                      <div className="stat-card">
                        <h3>{t('totalCustomers') || 'Total Customers'}</h3>
                        <p className="stat-number">{stats.totalCustomers || customers.length || 0}</p>
                      </div>
                    </div>

                    <div className="recent-orders">
                      <h3>{t('recentOrders') || 'Recent Orders'}</h3>
                      {orders.length > 0 ? (
                        <table className="orders-table">
                          <thead>
                            <tr>
                              <th>{t('orderId') || 'Order ID'}</th>
                              <th>{t('customer') || 'Customer'}</th>
                              <th>{t('amount') || 'Amount'}</th>
                              <th>{t('status') || 'Status'}</th>
                              <th>{t('date') || 'Date'}</th>
                              <th>{t('actions') || 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 10).map(order => (
                              <tr key={order.id}>
                                <td>{order.orderNumber || order.id}</td>
                                <td>{order.customer || order.email}</td>
                                <td>€{Number(order.amount || 0).toFixed(2)}</td>
                                <td>
                                  <span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                                    {order.status || 'Pending'}
                                  </span>
                                </td>
                                <td>{order.date || '-'}</td>
                                <td>
                                  <button
                                    className="action-btn"
                                    onClick={() => {
                                      const fullOrder = allOrders.find(o => o.id === order.id);
                                      setSelectedOrder(fullOrder || order);
                                    }}
                                  >
                                    {t('view') || 'View'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>{t('noRecentOrders') || 'No recent orders found.'}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p>{t('failedToLoadDashboard') || 'Failed to load dashboard data. Please check if the backend is running.'}</p>
                )}
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="admin-section">
                <h2>{t('ordersManagement') || 'Orders Management'}</h2>
                {allOrders.length > 0 ? (
                  <div className="orders-list-full">
                    <table className="orders-table-full">
                      <thead>
                        <tr>
                          <th>{t('orderId') || 'Order ID'}</th>
                          <th>{t('customer') || 'Customer'}</th>
                          <th>{t('amount') || 'Amount'}</th>
                          <th>{t('status') || 'Status'}</th>
                          <th>{t('date') || 'Date'}</th>
                          <th>{t('actions') || 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allOrders.map(order => (
                          <tr key={order.id}>
                            <td>{order.orderNumber || order.id}</td>
                            <td>{order.customer || order.email}</td>
                            <td>€{order.amount?.toFixed(2) || '0.00'}</td>
                            <td>
                              <select
                                className={`status-select status-${order.status?.toLowerCase() || 'pending'}`}
                                value={order.status || 'Pending'}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              >
                                <option value="Pending">{t('pending') || 'Pending'}</option>
                                <option value="Processing">{t('processing') || 'Processing'}</option>
                                <option value="Shipped">{t('shipped') || 'Shipped'}</option>
                                <option value="Delivered">{t('delivered') || 'Delivered'}</option>
                                <option value="Cancelled">{t('cancelled') || 'Cancelled'}</option>
                              </select>
                            </td>
                            <td>{order.date || '-'}</td>
                            <td>
                              <button
                                className="action-btn"
                                onClick={() => setSelectedOrder(order)}
                              >
                                {t('view') || 'View'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>{t('noOrders') || 'No orders found.'}</p>
                )}
              </div>
            )}

            {activeSection === 'customers' && (
              <div className="admin-section">
                <h2>{t('customersManagement') || 'Customers Management'}</h2>
                {customers.length > 0 ? (
                  <div className="customers-list">
                    <table className="customers-table">
                      <thead>
                        <tr>
                          <th>{t('name') || 'Name'}</th>
                          <th>{t('email') || 'Email'}</th>
                          <th>{t('location') || 'Location'}</th>
                          <th>{t('totalSpent') || 'Total Spent'}</th>
                          <th>{t('registeredDate') || 'Registered'}</th>
                          <th>{t('status') || 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map(customer => (
                          <tr key={customer.id}>
                            <td>
                              {customer.name || customer.email}
                              {customer.isAdmin && <span className="admin-badge">Admin</span>}
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.country || '-'}</td>
                            <td>€{Number(customer.totalSpent || 0).toFixed(2)}</td>
                            <td>{customer.registeredDate || '-'}</td>
                            <td>
                              <span className={`status-badge ${customer.active !== false ? 'active' : 'inactive'}`}>
                                {customer.active !== false ? t('active') || 'Active' : t('inactive') || 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>{t('noCustomers') || 'No customers found.'}</p>
                )}
              </div>
            )}

            {activeSection === 'products' && (
              <div className="admin-section">
                <div className="section-header">
                  <h2>{t('productsManagement') || 'Products Management'}</h2>
                  <button
                    className="add-product-btn"
                    onClick={() => {
                      setEditingProduct(null);
                      setShowProductForm(true);
                    }}
                  >
                    {t('addNewProduct') || '+ Add New Product'}
                  </button>
                </div>

                {showProductForm && (
                  <div className="product-form-modal" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}>
                    <div className="product-form-modal-content" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="product-form-modal-close"
                        onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                        aria-label="Close"
                      >
                        ×
                      </button>
                      <ProductForm
                        product={editingProduct}
                        onSave={async () => {
                          await loadDashboardData();
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }}
                        onCancel={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }}
                        t={t}
                      />
                    </div>
                  </div>
                )}

                {products.length > 0 ? (
                  <div className="products-list">
                    <table className="products-table">
                      <thead>
                        <tr>
                          <th>{t('image') || 'Image'}</th>
                          <th>{t('product') || 'Product'}</th>
                          <th>{t('category') || 'Category'}</th>
                          <th>{t('subcategory') || 'Subcategory'}</th>
                          <th>{t('price') || 'Price'}</th>
                          <th>{t('quantity') || 'Quantity'}</th>
                          <th>{t('actions') || 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id}>
                            <td>
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="product-thumbnail"
                                  onClick={() => setZoomedImage(product.image)}
                                />
                              ) : (
                                <div className="product-thumbnail" style={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  No Image
                                </div>
                              )}
                            </td>
                            <td>
                              <strong>{product.name}</strong>
                              {product.isNew && <span className="new-badge" style={{ marginLeft: '8px' }}>{t('new') || 'New'}</span>}
                            </td>
                            <td>{product.category}</td>
                            <td>{product.subcategory || '—'}</td>
                            <td>
                              {product.regularPrice ? (
                                <>
                                  <span className="sale-price">€{Number(product.price || 0).toFixed(2)}</span>
                                  <span className="regular-price">€{Number(product.regularPrice || 0).toFixed(2)}</span>
                                </>
                              ) : (
                                <span>€{Number(product.price || 0).toFixed(2)}</span>
                              )}
                            </td>
                            <td>
                              <span className={product.quantity <= 0 ? 'quantity-low' : product.quantity <= 10 ? 'quantity-medium' : 'quantity-ok'}>
                                {product.quantity || 0}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="edit-btn"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setShowProductForm(true);
                                  }}
                                >
                                  {t('edit') || 'Edit'}
                                </button>
                                <button
                                  className="delete-btn"
                                  onClick={async () => {
                                    const confirmMessage = t('confirmDeleteProduct') || 'Are you sure you want to delete this product?';
                                    if (window.confirm(confirmMessage)) {
                                      try {
                                        await api.deleteProduct(product.id);
                                        await loadDashboardData();
                                      } catch (err) {
                                        showAlert(t('deleteProductError') || 'Failed to delete product', 'error');
                                      }
                                    }
                                  }}
                                >
                                  {t('delete') || 'Delete'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>{t('noProducts') || 'No products found.'}</p>
                )}
              </div>
            )}

            {activeSection === 'customerService' && (
              <div className="admin-section">
                <h2>{t('customerService') || 'Customer Service'}</h2>
                
                <div className="requests-section">
                  <h3>{t('contactRequests') || 'Contact Requests'}</h3>
                  {contactRequests.length > 0 ? (
                    <div className="requests-table-container">
                      <table className="requests-table">
                        <thead>
                          <tr>
                            <th>{t('name') || 'Name'}</th>
                            <th>{t('email') || 'Email'}</th>
                            <th>{t('subject') || 'Subject'}</th>
                            <th>{t('status') || 'Status'}</th>
                            <th>{t('date') || 'Date'}</th>
                            <th>{t('actions') || 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contactRequests.map(request => (
                            <tr key={request.id}>
                              <td>{request.name}</td>
                              <td>{request.email}</td>
                              <td className="message-cell">{request.subject}</td>
                              <td>
                                <select
                                  className={`status-select status-${request.status?.toLowerCase() || 'pending'}`}
                                  value={request.status || 'Pending'}
                                  onChange={(e) => handleRequestStatusChange('contact', request.id, e.target.value)}
                                >
                                  <option value="Pending">{t('pending') || 'Pending'}</option>
                                  <option value="In Progress">{t('inProgress') || 'In Progress'}</option>
                                  <option value="Resolved">{t('resolved') || 'Resolved'}</option>
                                </select>
                              </td>
                              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                              <td>
                                <button
                                  className="action-btn"
                                  onClick={() => {
                                    setRequestType('contact');
                                    setSelectedRequest(request);
                                  }}
                                >
                                  {t('view') || 'View'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>{t('noContactRequests') || 'No contact requests found.'}</p>
                  )}
                </div>

                <div className="requests-section">
                  <h3>{t('graphicsRequests') || 'Graphics Requests'}</h3>
                  {graphicsRequests.length > 0 ? (
                    <div className="requests-table-container">
                      <table className="requests-table">
                        <thead>
                          <tr>
                            <th>{t('name') || 'Name'}</th>
                            <th>{t('email') || 'Email'}</th>
                            <th>{t('bikeModel') || 'Bike Model'}</th>
                            <th>{t('status') || 'Status'}</th>
                            <th>{t('date') || 'Date'}</th>
                            <th>{t('actions') || 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {graphicsRequests.map(request => (
                            <tr key={request.id}>
                              <td>{request.name || request.fullName}</td>
                              <td>{request.email}</td>
                              <td>{request.bikeModel}</td>
                              <td>
                                <select
                                  className={`status-select status-${request.status?.toLowerCase() || 'pending'}`}
                                  value={request.status || 'Pending'}
                                  onChange={(e) => handleRequestStatusChange('graphics', request.id, e.target.value)}
                                >
                                  <option value="Pending">{t('pending') || 'Pending'}</option>
                                  <option value="In Progress">{t('inProgress') || 'In Progress'}</option>
                                  <option value="Resolved">{t('resolved') || 'Resolved'}</option>
                                </select>
                              </td>
                              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                              <td>
                                <button
                                  className="action-btn"
                                  onClick={() => {
                                    setRequestType('graphics');
                                    setSelectedRequest(request);
                                  }}
                                >
                                  {t('view') || 'View'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>{t('noGraphicsRequests') || 'No graphics requests found.'}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          t={t}
        />
      )}

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          type={requestType}
          onClose={() => {
            setSelectedRequest(null);
            setRequestType(null);
          }}
          t={t}
        />
      )}

      {zoomedImage && (
        <div className="image-modal" onClick={() => setZoomedImage(null)}>
          <div className="image-modal-content">
            <button className="image-modal-close" onClick={() => setZoomedImage(null)}>×</button>
            <img src={zoomedImage} alt="Zoomed" className="image-modal-img" />
          </div>
        </div>
      )}
    </div>
  );
};

const SUBCATEGORIES = {
  'Men': ['Hoodies & Sweaters', 'T-shirts', 'Jackets', 'Pants', 'Shorts', 'Underwear'],
  'Women': ['Sports Bras & Bodysuits', 'Hoodies', 'Leggings', 'Sweatpants'],
  'MX Gear': ['Gloves', 'MX Goggles', 'MX Pants', 'MX Jerseys', 'Helmets', 'Bags', 'Protectors'],
  'Accessories': [],
  'Graphics': []
};

const SubcategorySelect = ({ category, value, onChange, t }) => {
  const options = SUBCATEGORIES[category] || [];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">—</option>
      {options.map(sub => (
        <option key={sub} value={sub}>{sub}</option>
      ))}
    </select>
  );
};

const ProductForm = ({ product, onSave, onCancel, t }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    regularPrice: product?.regularPrice || '',
    description: product?.description || '',
    category: product?.category || 'Men',
    subcategory: product?.subcategory || '',
    sizes: product?.sizes?.join(', ') || '',
    image: product?.image || '',
    isNew: product?.isNew || false,
    quantity: product?.quantity || 0,
    sizeQuantities: product?.sizeQuantities || {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const sizesArray = formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
      
      // Build sizeQuantities from per-size values only (no fallback to total quantity)
      const sizeQuantities = {};
      if (sizesArray.length > 0) {
        sizesArray.forEach(size => {
          const val = formData.sizeQuantities[size];
          sizeQuantities[size] = typeof val === 'number' ? val : (parseInt(val, 10) || 0);
        });
      }
      
      // Calculate total quantity from size quantities
      const totalQuantity = Object.values(sizeQuantities).reduce((sum, qty) => sum + (qty || 0), 0) || parseInt(formData.quantity) || 0;
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        regularPrice: formData.regularPrice ? parseFloat(formData.regularPrice) : null,
        sizes: sizesArray,
        quantity: totalQuantity,
        sizeQuantities: sizesArray.length > 0 ? sizeQuantities : null,
        subcategory: formData.subcategory || null
      };

      if (product) {
        await api.updateProduct(product.id, productData);
        setSuccess(true);
        setTimeout(() => {
          onSave();
        }, 1500);
      } else {
        await api.createProduct(productData);
        setSuccess(true);
        setTimeout(() => {
          onSave();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{product ? t('editProduct') || 'Edit Product' : t('createProduct') || 'Create Product'}</h3>
      
      {success && (
        <div className="success-message">
          {product ? t('productUpdatedSuccess') || 'Product updated successfully!' : t('productCreatedSuccess') || 'Product created successfully!'}
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>{t('productName') || 'Product Name'} *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder={t('productNamePlaceholder') || 'Enter product name'}
          />
        </div>
        <div className="form-group">
          <label>{t('category') || 'Category'} *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="Men">{t('men') || 'Men'}</option>
            <option value="Women">{t('women') || 'Women'}</option>
            <option value="MX Gear">{t('mxGear') || 'MX Gear'}</option>
            <option value="Accessories">{t('accessories') || 'Accessories'}</option>
            <option value="Graphics">{t('graphics') || 'Graphics'}</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t('subcategory') || 'Subcategory'} ({t('optional') || 'Optional'})</label>
          <SubcategorySelect
            category={formData.category}
            value={formData.subcategory}
            onChange={(v) => setFormData({ ...formData, subcategory: v })}
            t={t}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>{t('price') || 'Price'} *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('regularPrice') || 'Regular Price'} ({t('optional') || 'Optional'})</label>
          <input
            type="number"
            step="0.01"
            value={formData.regularPrice}
            onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>{t('sizes') || 'Sizes'} ({t('optional') || 'Optional'})</label>
        <input
          type="text"
          value={formData.sizes}
          onChange={(e) => {
            const newSizes = e.target.value;
            setFormData({ ...formData, sizes: newSizes });
            // Initialize size quantities for new sizes only (0 so each size can be set separately)
            if (newSizes) {
              const sizesArray = newSizes.split(',').map(s => s.trim()).filter(s => s);
              const newSizeQuantities = { ...formData.sizeQuantities };
              sizesArray.forEach(size => {
                if (!newSizeQuantities.hasOwnProperty(size)) {
                  newSizeQuantities[size] = 0;
                }
              });
              setFormData(prev => ({ ...prev, sizes: newSizes, sizeQuantities: newSizeQuantities }));
            }
          }}
          placeholder={t('sizesPlaceholder') || 'S, M, L, XL, XXL'}
        />
        <small>{t('sizesHint') || 'Enter sizes separated by commas (e.g., S, M, L, XL)'}</small>
      </div>

      {formData.sizes && formData.sizes.trim() && (
        <div className="form-group">
          <label>{t('quantityPerSize') || 'Quantity per Size'} *</label>
          <div className="size-quantities-grid">
            {formData.sizes.split(',').map(s => s.trim()).filter(s => s).map(size => (
              <div key={size} className="size-quantity-input">
                <label>{size}:</label>
                <input
                  type="number"
                  min="0"
                  value={formData.sizeQuantities[size] || 0}
                  onChange={(e) => {
                    const newSizeQuantities = {
                      ...formData.sizeQuantities,
                      [size]: parseInt(e.target.value) || 0
                    };
                    // Calculate total quantity
                    const totalQuantity = Object.values(newSizeQuantities).reduce((sum, qty) => sum + (qty || 0), 0);
                    setFormData({ ...formData, sizeQuantities: newSizeQuantities, quantity: totalQuantity });
                  }}
                />
              </div>
            ))}
          </div>
          <small>{t('quantityPerSizeHint') || 'Set quantity for each size. Total quantity will be calculated automatically.'}</small>
        </div>
      )}

      {(!formData.sizes || !formData.sizes.trim()) && (
        <div className="form-group">
          <label>{t('quantity') || 'Quantity'} *</label>
          <input
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
          <small>{t('quantityHint') || 'Enter the number of items in stock'}</small>
        </div>
      )}

      <div className="form-group">
        <label>{t('imageUrl') || 'Image URL'} ({t('optional') || 'Optional'})</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder={t('imageUrlPlaceholder') || 'https://example.com/image.jpg'}
        />
        <small>{t('imageUrlHint') || 'Leave empty to use a placeholder image'}</small>
      </div>

      <div className="form-group">
        <label>{t('description') || 'Description'}</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.isNew}
            onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
          />
          {t('markAsNew') || 'Mark as New Product'}
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (product ? t('updating') || 'Updating...' : t('creating') || 'Creating...') : (product ? t('updateProduct') || 'Update Product' : t('createProduct') || 'Create Product')}
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          {t('cancel') || 'Cancel'}
        </button>
      </div>
    </form>
  );
};

const OrderDetailsModal = ({ order, onClose, onStatusChange, t }) => {
  const [status, setStatus] = useState(order.status || 'Pending');

  const handleStatusUpdate = async () => {
    await onStatusChange(order.id, status);
    onClose();
  };

  return (
    <div className="order-modal" onClick={onClose}>
      <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="order-modal-close" onClick={onClose}>×</button>
        <h2>{t('orderDetails') || 'Order Details'}</h2>
        
        <div className="order-details-grid">
          <div className="order-detail-section">
            <h3>{t('orderInformation') || 'Order Information'}</h3>
            <p><strong>{t('orderNumber') || 'Order Number'}:</strong> {order.orderNumber || order.id}</p>
            <p><strong>{t('status') || 'Status'}:</strong> {order.status || 'Pending'}</p>
            <p><strong>{t('orderDate') || 'Date'}:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : (order.date || '-')}</p>
            <p><strong>{t('paymentMethod') || 'Payment Method'}:</strong> {order.paymentMethod || '-'}</p>
            <p><strong>{t('totalAmount') || 'Total'}:</strong> €{Number(order.amount ?? order.total ?? 0).toFixed(2)}</p>
          </div>

          <div className="order-detail-section">
            <h3>{t('customerInformation') || 'Customer Information'}</h3>
            <p><strong>{t('name') || 'Name'}:</strong> {order.customer || [order.firstName, order.lastName].filter(Boolean).join(' ') || order.email || '-'}</p>
            <p><strong>{t('email') || 'Email'}:</strong> {order.email || '-'}</p>
            <p><strong>{t('phone') || 'Phone'}:</strong> {order.phone || '-'}</p>
          </div>

          <div className="order-detail-section">
            <h3>{t('shippingAddress') || 'Shipping Address'}</h3>
            <p>{order.address || '-'}</p>
            <p>{[order.city, order.postalCode].filter(Boolean).join(' ') || '-'}</p>
            <p>{order.country || '-'}</p>
          </div>
        </div>

        <div className="order-items-section">
          <div className="order-items-header">
            <h3>{t('orderItems') || 'Order Items'}</h3>
            <span className="items-count-badge">{order.items?.length || order.itemsCount || 0} {t('items') || 'items'}</span>
          </div>

          {order.items && order.items.length > 0 ? (
            <div className="order-items-container">
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th className="col-image"></th>
                    <th className="col-product">{t('product') || 'Product'}</th>
                    <th className="col-id">{t('productId') || 'Product ID'}</th>
                    <th className="col-size">{t('size') || 'Size'}</th>
                    <th className="col-quantity">{t('quantity') || 'Qty'}</th>
                    <th className="col-price">{t('unitPrice') || 'Unit Price'}</th>
                    <th className="col-subtotal">{t('subtotal') || 'Subtotal'}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="order-item-row">
                      <td className="col-image">
                        <div className="order-item-image-wrapper">
                          {item.image ? (
                            <img src={item.image} alt={item.productName || item.name} className="order-item-image" />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#f5f5f5' }}></div>
                          )}
                        </div>
                      </td>
                      <td className="col-product product-name-cell">{item.productName || item.name || t('unknownProduct') || 'Unknown Product'}</td>
                      <td className="col-id"><span className="product-id-badge">{item.productId || '-'}</span></td>
                      <td className="col-size"><span className="size-badge">{item.size || '-'}</span></td>
                      <td className="col-quantity"><span className="quantity-badge">{item.quantity || 1}</span></td>
                      <td className="col-price">€{Number(item.price || 0).toFixed(2)}</td>
                      <td className="col-subtotal">€{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-items-message">{t('noItemsInOrder') || 'No items in this order.'}</p>
          )}

          <div className="order-summary-section">
            <div className="summary-row">
              <span>{t('itemsTotal') || 'Items Total'}</span>
              <span>€{Number(order.amount || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>{t('orderTotal') || 'Order Total'}</span>
              <span>€{Number(order.amount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label><strong>{t('updateStatus') || 'Update Status'}:</strong></label>
          <select
            className={`status-select status-${status.toLowerCase()}`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ marginRight: '10px' }}
          >
            <option value="Pending">{t('pending') || 'Pending'}</option>
            <option value="Processing">{t('processing') || 'Processing'}</option>
            <option value="Shipped">{t('shipped') || 'Shipped'}</option>
            <option value="Delivered">{t('delivered') || 'Delivered'}</option>
            <option value="Cancelled">{t('cancelled') || 'Cancelled'}</option>
          </select>
          <button className="action-btn" onClick={handleStatusUpdate}>
            {t('save') || 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const RequestDetailsModal = ({ request, type, onClose, t }) => {
  return (
    <div className="request-modal" onClick={onClose}>
      <div className="request-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="request-modal-close" onClick={onClose}>×</button>
        <h2>{type === 'contact' ? t('contactRequestDetails') || 'Contact Request Details' : t('graphicsRequestDetails') || 'Graphics Request Details'}</h2>

        <div className="request-details-grid">
          <div className="request-detail-section">
            <h3>{t('contactInformation') || 'Contact Information'}</h3>
            <p><strong>{t('name') || 'Name'}:</strong> {request.name || request.fullName || '-'}</p>
            <p><strong>{t('email') || 'Email'}:</strong> {request.email || '-'}</p>
            <p><strong>{t('phone') || 'Phone'}:</strong> {request.phone || '-'}</p>
          </div>

          {type === 'contact' ? (
            <>
              <div className="request-detail-section">
                <h3>{t('status') || 'Status'}</h3>
                <p><span className={`status-badge status-${(request.status || 'pending').toLowerCase()}`}>{request.status || 'Pending'}</span></p>
              </div>
              <div className="request-detail-section">
                <h3>{t('date') || 'Date'}</h3>
                <p>{request.createdAt ? new Date(request.createdAt).toLocaleString() : '-'}</p>
              </div>
              <div className="request-detail-section full-width">
                <h3>{t('messageDetails') || 'Message Details'}</h3>
                <p><strong>{t('subject') || 'Subject'}:</strong> {request.subject}</p>
                <div className="message-content">
                  <p>{request.message}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="request-detail-section">
                <h3>{t('status') || 'Status'}</h3>
                <p><span className={`status-badge status-${(request.status || 'pending').toLowerCase()}`}>{request.status || 'Pending'}</span></p>
              </div>
              <div className="request-detail-section">
                <h3>{t('date') || 'Date'}</h3>
                <p>{request.createdAt ? new Date(request.createdAt).toLocaleString() : '-'}</p>
              </div>
              <div className="request-detail-section">
                <h3>{t('bikeInformation') || 'Bike Information'}</h3>
                <p><strong>{t('bikeModel') || 'Bike Model'}:</strong> {request.bikeModel || '-'}</p>
                <p><strong>{t('bikeYear') || 'Bike Year'}:</strong> {request.bikeYear || '-'}</p>
              </div>
              <div className="request-detail-section">
                <h3>{t('projectDetails') || 'Project Details'}</h3>
                <p><strong>{t('designType') || 'Design Type'}:</strong> {request.designType || '-'}</p>
                <p><strong>{t('budgetRange') || 'Budget'}:</strong> {request.budget || request.budgetRange || '-'}</p>
                <p><strong>{t('timeline') || 'Timeline'}:</strong> {request.timeline || '-'}</p>
              </div>
              <div className="request-detail-section full-width">
                <h3>{t('designDescription') || 'Design Description'}</h3>
                <div className="message-content">
                  <p>{request.designDescription || '-'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
