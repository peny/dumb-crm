import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Eye, TrendingUp } from 'lucide-react'
import { dealAPI } from '../api/client'
import toast from 'react-hot-toast'
import DealForm from '../components/DealForm'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const [dealsRes, statsRes] = await Promise.all([
        dealAPI.getAll(),
        dealAPI.getStats()
      ])
      setDeals(dealsRes.data || [])
      setStats(statsRes.data)
    } catch (error) {
      toast.error('Failed to fetch deals')
      console.error('Fetch deals error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.description && deal.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      deal.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) {
      return
    }

    try {
      await dealAPI.delete(id)
      toast.success('Deal deleted successfully')
      fetchDeals()
    } catch (error) {
      toast.error('Failed to delete deal')
      console.error('Delete error:', error)
    }
  }

  const handleFormSubmit = async (dealData) => {
    try {
      if (editingDeal) {
        await dealAPI.update(editingDeal.id, dealData)
        toast.success('Deal updated successfully')
      } else {
        await dealAPI.create(dealData)
        toast.success('Deal created successfully')
      }
      
      setShowForm(false)
      setEditingDeal(null)
      fetchDeals()
    } catch (error) {
      toast.error(editingDeal ? 'Failed to update deal' : 'Failed to create deal')
      console.error('Form submit error:', error)
    }
  }

  const handleEdit = (deal) => {
    setEditingDeal(deal)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingDeal(null)
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
    fetchDeals()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="mt-2 text-gray-600">
            Track and manage your sales deals and opportunities.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeals}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Deals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openDeals}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Won Deals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.wonDeals}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Won Value</p>
                <p className="text-2xl font-bold text-gray-900">${stats.wonValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-full sm:w-auto"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Deal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">
              {editingDeal ? 'Edit Deal' : 'Add New Deal'}
            </h2>
            <DealForm
              deal={editingDeal}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* Deals Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery || statusFilter !== 'all' ? 'No deals found matching your criteria.' : 'No deals found.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary mt-4"
              >
                Add your first deal
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Customer</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => (
                  <tr key={deal.id}>
                    <td className="font-medium">{deal.title}</td>
                    <td>
                      <Link
                        to={`/customers/${deal.customer.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        {deal.customer.name}
                      </Link>
                    </td>
                    <td>${deal.value.toLocaleString()}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(deal.status)}`}>
                        {deal.status}
                      </span>
                    </td>
                    <td>{new Date(deal.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Link
                          to={`/deals/${deal.id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(deal)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(deal.id)}
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

export default Deals
