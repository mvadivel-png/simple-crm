import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/contacts`);

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.first_name || !formData.last_name || !formData.phone) {
      setError('All fields are required');
      return;
    }

    try {
      if (editingId) {
        await updateContact();
      } else {
        await addContact();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addContact = async () => {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Failed to add contact');
    }

    await fetchContacts();
    resetForm();
  };

  const updateContact = async () => {
    const response = await fetch(`${API_URL}/contacts/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Failed to update contact');
    }

    await fetchContacts();
    resetForm();
  };

  const handleEdit = (contact) => {
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      phone: contact.phone
    });
    setEditingId(contact.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      setError('');
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      await fetchContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      phone: ''
    });
    setEditingId(null);
  };

  return (
    <div className="app">
      <h1>Simple CRM</h1>

      {error && <div className="error">{error}</div>}

      <div className="contact-form">
        <h2>{editingId ? 'Edit Contact' : 'Add New Contact'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="Enter first name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Enter last name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-buttons">
            {editingId ? (
              <>
                <button type="submit" className="btn-update">Update Contact</button>
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="submit" className="btn-add">Add Contact</button>
            )}
          </div>
        </form>
      </div>

      <div className="contacts-list">
        <h2>Contacts</h2>

        {loading ? (
          <div className="loading">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="empty-state">No contacts yet. Add your first contact above!</div>
        ) : (
          contacts.map(contact => (
            <div key={contact.id} className="contact-item">
              <div className="contact-info">
                <div className="contact-name">
                  {contact.first_name} {contact.last_name}
                </div>
                <div className="contact-phone">{contact.phone}</div>
              </div>
              <div className="contact-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(contact)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(contact.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
