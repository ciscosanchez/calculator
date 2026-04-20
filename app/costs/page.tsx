export default function CostsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cost Management</h1>
        <p className="mt-2 text-gray-600">Configure labor rates, equipment costs, and overhead allocations</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-amber-900 mb-1">Admin Access Required</h3>
            <p className="text-sm text-amber-800">
              Cost management features require Admin or Super Admin privileges. Some fields may be restricted to Super Admin only.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Labor Rates</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              + Add Rate
            </button>
          </div>

          <div className="space-y-4">
            <CostItem
              label="Driver - Loaded Rate"
              value="$23.76/hr"
              badge="Standard"
            />
            <CostItem
              label="Warehouse Worker - Loaded Rate"
              value="$21.50/hr"
              badge="Standard"
            />
            <CostItem
              label="Installation Specialist - Loaded Rate"
              value="$28.00/hr"
              badge="Standard"
            />
            <CostItem
              label="Supervisor - Loaded Rate"
              value="$32.50/hr"
              badge="Standard"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Equipment Costs</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              + Add Equipment
            </button>
          </div>

          <div className="space-y-4">
            <CostItem
              label="Fuel Cost per Mile"
              value="$0.68/mi"
              badge="Standard"
            />
            <CostItem
              label="Truck - Depreciation + Maintenance"
              value="$0.45/mi"
              badge="Standard"
            />
            <CostItem
              label="Forklift - Hourly Rate"
              value="$12.00/hr"
              badge="Standard"
            />
            <CostItem
              label="Pallet Jack - Daily Rate"
              value="$8.00/day"
              badge="Standard"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Overhead Allocations</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              + Add Overhead
            </button>
          </div>

          <div className="space-y-4">
            <CostItem
              label="Final Mile - Per Route"
              value="$65.00"
              badge="Standard"
            />
            <CostItem
              label="Hotel Installation - Per Room"
              value="$8.50"
              badge="Standard"
            />
            <CostItem
              label="Warehouse - Daily Allocation"
              value="$125.00"
              badge="Standard"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Location Overrides</h2>
            <span className="text-sm text-gray-500">Current: All Locations</span>
          </div>

          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-gray-600 mb-4">No location-specific overrides configured</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Configure Location Costs
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-blue-900 mb-1">About Cost Management</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Standard costs are shared across all locations in your organization. Location-specific overrides allow individual 
              locations to adjust costs based on their local market conditions. Changes to standard costs require Super Admin approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CostItemProps {
  label: string
  value: string
  badge?: string
}

function CostItem({ label, value, badge }: CostItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-bold text-gray-900">{value}</span>
        <button className="text-gray-400 hover:text-blue-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
