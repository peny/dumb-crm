import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { customerAPI } from '../api/client'
import toast from 'react-hot-toast'
import CustomerForm from '../components/CustomerForm'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await customerAPI.getAll()
      setCustomers(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch customers')
      console.error('Fetch customers error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      fetchCustomers()
      return
    }

    try {
      setLoading(true)
      const response = await customerAPI.search(query)
      setCustomers(response.data || [])
    } catch (error) {
      toast.error('Failed to search customers')
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return
    }

    try {
      await customerAPI.delete(id)
      toast.success('Customer deleted successfully')
      fetchCustomers()
    } catch (error) {
      toast.error('Failed to delete customer')
      console.error('Delete error:', error)
    }
  }

  const handleFormSubmit = async (customerData) => {
    try {
      if (editingCustomer) {
        await customerAPI.update(editingCustomer.id, customerData)
        toast.success('Customer updated successfully')
      } else {
        await customerAPI.create(customerData)
        toast.success('Customer created successfully')
      }
      
      setShowForm(false)
      setEditingCustomer(null)
      fetchCustomers()
    } catch (error) {
      toast.error(editingCustomer ? 'Failed to update customer' : 'Failed to create customer')
      console.error('Form submit error:', error)
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCustomer(null)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-2 text-gray-600">
            Manage your customer relationships and information.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <CustomerForm
              customer={editingCustomer}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No customers found.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary mt-4"
            >
              Add your first customer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Contacts</th>
                  <th>Deals</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="font-medium">{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || '-'}</td>
                    <td>{customer.company || '-'}</td>
                    <td>{customer.contacts?.length || 0}</td>
                    <td>{customer.deals?.length || 0}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Link
                          to={`/customers/${customer.id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
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

export default Customers
