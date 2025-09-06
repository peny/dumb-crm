import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, User } from 'lucide-react'
import { contactAPI } from '../api/client'
import toast from 'react-hot-toast'
import ContactForm from '../components/ContactForm'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await contactAPI.getAll()
      setContacts(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch contacts')
      console.error('Fetch contacts error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.position && contact.position.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return
    }

    try {
      await contactAPI.delete(id)
      toast.success('Contact deleted successfully')
      fetchContacts()
    } catch (error) {
      toast.error('Failed to delete contact')
      console.error('Delete error:', error)
    }
  }

  const handleFormSubmit = async (contactData) => {
    try {
      if (editingContact) {
        await contactAPI.update(editingContact.id, contactData)
        toast.success('Contact updated successfully')
      } else {
        await contactAPI.create(contactData)
        toast.success('Contact created successfully')
      }
      
      setShowForm(false)
      setEditingContact(null)
      fetchContacts()
    } catch (error) {
      toast.error(editingContact ? 'Failed to update contact' : 'Failed to create contact')
      console.error('Form submit error:', error)
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingContact(null)
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-2 text-gray-600">
            Manage your customer contacts and their information.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Contact Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <ContactForm
              contact={editingContact}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery ? 'No contacts found matching your search.' : 'No contacts found.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary mt-4"
              >
                Add your first contact
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Customer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="font-medium">{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone || '-'}</td>
                    <td>{contact.position || '-'}</td>
                    <td>
                      {contact.customer ? (
                        <Link
                          to={`/customers/${contact.customer.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {contact.customer.name}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(contact)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Contacts
