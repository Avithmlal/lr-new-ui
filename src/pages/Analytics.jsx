import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, hasPermission } from '../contexts/AppContext';

export function Analytics() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [metricType, setMetricType] = useState('users');

  // Check permissions
  const canViewAnalytics = hasPermission(state.currentUser, 'analytics', 'read');

  useEffect(() => {
    // Redirect if no permission
    if (!canViewAnalytics) {
      navigate('/');
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Access Denied',
          message: 'You do not have permission to view analytics.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  }, [canViewAnalytics, navigate, dispatch]);

  // Mock analytics data
  const analyticsData = {
    userGrowth: [
      { date: '2024-01-01', value: 1200 },
      { date: '2024-01-08', value: 1350 },
      { date: '2024-01-15', value: 1480 },
      { date: '2024-01-22', value: 1620 },
      { date: '2024-01-29', value: 1750 },
    ],
    organizationGrowth: [
      { date: '2024-01-01', value: 45 },
      { date: '2024-01-08', value: 52 },
      { date: '2024-01-15', value: 58 },
      { date: '2024-01-22', value: 64 },
      { date: '2024-01-29', value: 71 },
    ],
    revenueGrowth: [
      { date: '2024-01-01', value: 45000 },
      { date: '2024-01-08', value: 52000 },
      { date: '2024-01-15', value: 58000 },
      { date: '2024-01-22', value: 64000 },
      { date: '2024-01-29', value: 71000 },
    ],
    planDistribution: [
      { plan: 'Free', count: 45, percentage: 28.8 },
      { plan: 'Starter', count: 38, percentage: 24.4 },
      { plan: 'Professional', count: 52, percentage: 33.3 },
      { plan: 'Enterprise', count: 21, percentage: 13.5 },
    ],
    topFeatures: [
      { feature: 'Billy Chat', usage: 89.5 },
      { feature: 'Course Generation', usage: 76.3 },
      { feature: 'File Upload', usage: 92.1 },
      { feature: 'Avatar Videos', usage: 45.7 },
      { feature: 'Voice Recording', usage: 67.8 },
    ],
    geographicDistribution: [
      { country: 'United States', users: 1245, percentage: 43.7 },
      { country: 'United Kingdom', users: 456, percentage: 16.0 },
      { country: 'Canada', users: 234, percentage: 8.2 },
      { country: 'Germany', users: 189, percentage: 6.6 },
      { country: 'Australia', users: 167, percentage: 5.9 },
      { country: 'Others', users: 556, percentage: 19.6 },
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTimeRangeLabel = (range) => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  if (!canViewAnalytics) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
            Analytics
          </h1>
          <p className="text-gray-600 mt-1">System usage and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-red-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-900">Admin Access</h3>
          <p className="text-sm text-red-800">
            You're viewing this page with administrative privileges. You can see analytics data for the entire system.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(89750)}</p>
              <p className="text-sm text-green-600 mt-1">+15.7% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(1923)}</p>
              <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Organizations</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(156)}</p>
              <p className="text-sm text-green-600 mt-1">+8.3% from last month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session Time</p>
              <p className="text-2xl font-bold text-gray-900">24m 32s</p>
              <p className="text-sm text-green-600 mt-1">+5.2% from last month</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Growth Trends</h3>
            <select
              value={metricType}
              onChange={(e) => setMetricType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="users">Users</option>
              <option value="organizations">Organizations</option>
              <option value="revenue">Revenue</option>
              <option value="usage">Usage</option>
            </select>
          </div>
          
          {/* Mock Chart Area */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Growth chart for {getTimeRangeLabel(timeRange)}</p>
              <p className="text-sm text-gray-500 mt-1">Chart visualization would be implemented here</p>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Plan Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analyticsData.planDistribution.map((item, index) => (
              <div key={item.plan} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{item.plan}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{item.count}</p>
                  <p className="text-xs text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Feature Usage</h3>
          <div className="space-y-4">
            {analyticsData.topFeatures.map((feature) => (
              <div key={feature.feature}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{feature.feature}</span>
                  <span className="text-sm text-gray-600">{feature.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${feature.usage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
          <div className="space-y-3">
            {analyticsData.geographicDistribution.map((location) => (
              <div key={location.country} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{location.country}</span>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatNumber(location.users)}</p>
                  <p className="text-xs text-gray-500">{location.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  New User Registrations
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  324
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  288
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +12.5%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Course Generations
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  1,456
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  1,234
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +18.0%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Billy Sessions
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  8,934
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  7,456
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +19.8%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Storage Usage (GB)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2,847.5
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2,634.2
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +8.1%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}