import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Plus, UserCheck, TrendingUp } from 'lucide-react'
import { customerAPI, contactAPI, dealAPI } from '../api/client'
import toast from 'react-hot-toast'
import CustomerForm from '../components/CustomerForm'
import ContactForm from '../components/ContactForm'
import DealForm from '../components/DealForm'

const CustomerDetail = () => {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showDealForm, setShowDealForm] = useState(false)

  const fetchCustomerData = async () => {
    try {
      setLoading(true)
      const [customerRes, contactsRes, dealsRes] = await Promise.all([
        customerAPI.getById(id),
        contactAPI.getByCustomerId(id),
        dealAPI.getByCustomerId(id)
      ])

      setCustomer(customerRes.data)
      setContacts(contactsRes.data || [])
      setDeals(dealsRes.data || [])
    } catch (error) {
      toast.error('Failed to fetch customer data')
      console.error('Fetch customer error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerUpdate = async (customerData) => {
    try {
      await customerAPI.update(id, customerData)
      toast.success('Customer updated successfully')
      setShowCustomerForm(false)
      fetchCustomerData()
    } catch (error) {
      toast.error('Failed to update customer')
      console.error('Update error:', error)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!window.confirm('Are you sure you want to delete this customer? This will also delete all associated contacts and deals.')) {
      return
    }

    try {
      await customerAPI.delete(id)
      toast.success('Customer deleted successfully')
      window.location.href = '/customers'
    } catch (error) {
      toast.error('Failed to delete customer')
      console.error('Delete error:', error)
    }
  }

  const handleContactSubmit = async (contactData) => {
    try {
      await contactAPI.create({ ...contactData, customerId: id })
      toast.success('Contact created successfully')
      setShowContactForm(false)
      fetchCustomerData()
    } catch (error) {
      toast.error('Failed to create contact')
      console.error('Contact creation error:', error)
    }
  }

  const handleDealSubmit = async (dealData) => {
    try {
      await dealAPI.create({ ...dealData, customerId: id })
      toast.success('Deal created successfully')
      setShowDealForm(false)
      fetchCustomerData()
    } catch (error) {
      toast.error('Failed to create deal')
      console.error('Deal creation error:', error)
    }
  }

  useEffect(() => {
    fetchCustomerData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Customer not found.</p>
        <Link to="/customers" className="btn btn-primary mt-4">
          Back to Customers
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link
            to="/customers"
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="mt-2 text-gray-600">{customer.email}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCustomerForm(true)}
            className="btn btn-secondary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Customer
          </button>
          <button
            onClick={handleDeleteCustomer}
            className="btn btn-danger flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{customer.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{customer.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{customer.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="text-gray-900">{customer.company || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-gray-900">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </button>
              <button
                onClick={() => setShowDealForm(true)}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Contacts:</span>
                <span className="font-medium">{contacts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deals:</span>
                <span className="font-medium">{deals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium">
                  ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts and Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Contacts ({contacts.length})
            </h2>
            <button
              onClick={() => setShowContactForm(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {contacts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No contacts yet.</p>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  {contact.phone && (
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  )}
                  {contact.position && (
                    <p className="text-sm text-gray-500">{contact.position}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Deals ({deals.length})
            </h2>
            <button
              onClick={() => setShowDealForm(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {deals.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No deals yet.</p>
          ) : (
            <div className="space-y-3">
              {deals.map((deal) => (
                <div key={deal.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{deal.title}</h4>
                      <p className="text-sm text-gray-600">${deal.value.toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      deal.status === 'won' ? 'bg-green-100 text-green-800' :
                      deal.status === 'lost' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {deal.status}
                    </span>
                  </div>
                  {deal.description && (
                    <p className="text-sm text-gray-500 mt-2">{deal.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
            <CustomerForm
              customer={customer}
              onSubmit={handleCustomerUpdate}
              onCancel={() => setShowCustomerForm(false)}
            />
          </div>
        </div>
      )}

      {showContactForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Add Contact</h2>
            <ContactForm
              onSubmit={handleContactSubmit}
              onCancel={() => setShowContactForm(false)}
            />
          </div>
        </div>
      )}

      {showDealForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Add Deal</h2>
            <DealForm
              onSubmit={handleDealSubmit}
              onCancel={() => setShowDealForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerDetail
