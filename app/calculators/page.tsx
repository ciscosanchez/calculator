import Link from 'next/link'

const calculators = [
  {
    id: 'final-mile',
    title: 'Final Mile Delivery',
    description: 'Calculate delivery costs for final mile services including labor, fuel, and equipment costs.',
    icon: '🚛',
    href: '/calculators/final-mile',
    color: 'blue',
  },
  {
    id: 'installation-services',
    title: 'Installation Services',
    description: 'Flexible pricing for hotel, data center, office, healthcare, education, and retail installations.',
    icon: '🔧',
    href: '/calculators/installation-services',
    color: 'purple',
  },
  {
    id: 'pallet-handling',
    title: 'Pallet Handling',
    description: 'Calculate pallet handling and storage costs for warehouse operations.',
    icon: '📦',
    href: '/calculators/pallet-handling',
    color: 'amber',
  },
  {
    id: 'warehouse-storage',
    title: 'Warehouse Storage',
    description: 'Estimate warehouse storage fees based on space, duration, and handling requirements.',
    icon: '🏭',
    href: '/calculators/warehouse-storage',
    color: 'green',
  },
]

export default function CalculatorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pricing Calculators</h1>
        <p className="mt-2 text-gray-600">Select a calculator to get started with pricing your services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculators.map((calc) => (
          <Link
            key={calc.id}
            href={calc.href}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-blue-300"
          >
            <div className="flex items-start space-x-4">
              <div className="text-5xl">{calc.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{calc.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{calc.description}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center text-blue-600 font-medium text-sm">
                    Launch Calculator
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-blue-900 mb-1">Getting Started</h3>
            <p className="text-sm text-blue-800">
              Each calculator is pre-populated with standard costs from your location. You can adjust any values to see real-time pricing updates. 
              Save your calculations as quotes to share with customers or export to your CRM.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
