import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserCheck, TrendingUp, DollarSign } from 'lucide-react'
import { customerAPI, contactAPI, dealAPI } from '../api/client'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    contacts: 0,
    deals: 0,
    totalValue: 0,
    wonValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, contactsRes, dealsRes, dealStatsRes] = await Promise.all([
          customerAPI.getAll(),
          contactAPI.getAll(),
          dealAPI.getAll(),
          dealAPI.getStats()
        ])

        setStats({
          customers: customersRes.data?.length || 0,
          contacts: contactsRes.data?.length || 0,
          deals: dealsRes.data?.length || 0,
          totalValue: dealStatsRes.data?.totalValue || 0,
          wonValue: dealStatsRes.data?.wonValue || 0
        })
      } catch (error) {
        toast.error('Failed to load dashboard statistics')
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      name: 'Total Customers',
      value: stats.customers,
      icon: Users,
      color: 'bg-blue-500',
      href: '/customers'
    },
    {
      name: 'Total Contacts',
      value: stats.contacts,
      icon: UserCheck,
      color: 'bg-green-500',
      href: '/contacts'
    },
    {
      name: 'Total Deals',
      value: stats.deals,
      icon: TrendingUp,
      color: 'bg-purple-500',
      href: '/deals'
    },
    {
      name: 'Won Value',
      value: `$${stats.wonValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      href: '/deals'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your CRM dashboard. Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/dashboard/customers"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-5 w-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium">View Customers</span>
          </Link>
          <Link
            to="/dashboard/contacts"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserCheck className="h-5 w-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium">View Contacts</span>
          </Link>
          <Link
            to="/dashboard/deals"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium">View Deals</span>
          </Link>
          <Link
            to="/dashboard/deals"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="h-5 w-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium">Deal Statistics</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
