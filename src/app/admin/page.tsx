'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Calendar,
  Settings,
  BarChart3,
  FileText
} from 'lucide-react'

interface DashboardStats {
  activeSubscriptions: number
  monthlyRevenue: number
  todaysDeliveries: number
  totalCustomers: number
}

interface TodaysDelivery {
  id: string
  scheduledFor: string
  status: string
  fruitsBoxes: number
  sproutsBoxes: number
  subscription: {
    user: {
      name: string
      email: string
    }
    address: {
      line1: string
      city: string
      pincode: string
    }
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [todaysDeliveries, setTodaysDeliveries] = useState<TodaysDelivery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      // Check if user is admin
      if (session?.user?.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }
      
      fetchDashboardData()
    }
  }, [status, session, router])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, deliveriesResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/deliveries/today'),
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (deliveriesResponse.ok) {
        const deliveriesData = await deliveriesResponse.json()
        setTodaysDeliveries(deliveriesData.deliveries)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-green-600">HealthyBowl Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {session?.user?.name}</span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeSubscriptions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats?.monthlyRevenue || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.todaysDeliveries || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/pricing')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-5 h-5 mr-2" />
              Manage Pricing
            </button>

            <button
              onClick={() => router.push('/admin/route-planner')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Route Planner
            </button>

            <button
              onClick={() => router.push('/admin/analytics')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Analytics
            </button>

            <button
              onClick={() => router.push('/admin/export')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <FileText className="w-5 h-5 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Today's Deliveries */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Deliveries</h2>
          
          {todaysDeliveries.length === 0 ? (
            <p className="text-gray-600">No deliveries scheduled for today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todaysDeliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {delivery.subscription.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {delivery.subscription.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {delivery.subscription.address.line1}
                        </div>
                        <div className="text-sm text-gray-500">
                          {delivery.subscription.address.city} - {delivery.subscription.address.pincode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {delivery.fruitsBoxes} fruits + {delivery.sproutsBoxes} sprouts
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(delivery.scheduledFor).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          delivery.status === 'SCHEDULED' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : delivery.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          Mark Delivered
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Reschedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
