import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, User, TrendingUp } from 'lucide-react'
import { dealAPI } from '../api/client'
import toast from 'react-hot-toast'
import DealForm from '../components/DealForm'

const DealDetail = () => {
  const { id } = useParams()
  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchDeal = async () => {
    try {
      setLoading(true)
      const response = await dealAPI.getById(id)
      setDeal(response.data)
    } catch (error) {
      toast.error('Failed to fetch deal')
      console.error('Fetch deal error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (dealData) => {
    try {
      await dealAPI.update(id, dealData)
      toast.success('Deal updated successfully')
      setShowForm(false)
      fetchDeal()
    } catch (error) {
      toast.error('Failed to update deal')
      console.error('Update error:', error)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this deal?')) {
      return
    }

    try {
      await dealAPI.delete(id)
      toast.success('Deal deleted successfully')
      window.location.href = '/deals'
    } catch (error) {
      toast.error('Failed to delete deal')
      console.error('Delete error:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'won':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  useEffect(() => {
    fetchDeal()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Deal not found.</p>
        <Link to="/deals" className="btn btn-primary mt-4">
          Back to Deals
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
            to="/deals"
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{deal.title}</h1>
            <p className="mt-2 text-gray-600">
              Deal with {deal.customer.name}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-secondary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Deal
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Deal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-gray-900">{deal.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Value</label>
                <p className="text-gray-900 text-lg font-semibold">${deal.value.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-gray-900">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="text-gray-900">
                  <Link
                    to={`/customers/${deal.customer.id}`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    {deal.customer.name}
                  </Link>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-gray-900">
                  {new Date(deal.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(deal.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {deal.description && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 mt-1">{deal.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer
            </h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">
                  <Link
                    to={`/customers/${deal.customer.id}`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    {deal.customer.name}
                  </Link>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{deal.customer.email}</p>
              </div>
              {deal.customer.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{deal.customer.phone}</p>
                </div>
              )}
              {deal.customer.company && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="text-gray-900">{deal.customer.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/customers/${deal.customer.id}`}
                className="w-full btn btn-secondary flex items-center justify-center"
              >
                <User className="h-4 w-4 mr-2" />
                View Customer
              </Link>
              <Link
                to="/deals"
                className="w-full btn btn-secondary flex items-center justify-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                All Deals
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Edit Deal</h2>
            <DealForm
              deal={deal}
              onSubmit={handleUpdate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DealDetail
