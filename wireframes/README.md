# Armstrong Pricing Tool - Wireframes Index

## Overview

This directory contains interactive HTML wireframes for the Armstrong Pricing Tool. Open any file in a web browser to view the design.

## Files

1. **01-dashboard.html** - Main dashboard view
   - Stats overview (quotes, margin, revenue, acceptance rate)
   - Quick access calculator cards
   - Recent quotes list
   - Navigation sidebar

2. **02-calculator-final-mile.html** - Final Mile Delivery Calculator
   - Business type toggle (Commercial/Residential)
   - Location selector
   - Two-column layout (inputs left, results right)
   - Real-time stats display
   - Cost breakdown
   - Verdict box with margin analysis
   - Save/Export/Share actions

3. **03-quotes-list.html** - Quotes Management Page
   - Advanced filtering (search, status, service type, location)
   - Sortable table with all quotes
   - Status badges (Draft, Sent, Accepted, Rejected, Expired)
   - Margin indicators (color-coded by performance)
   - Quick actions per quote
   - Pagination

4. **04-cost-management.html** - Admin Cost Management (ADMIN ONLY)
   - Tabbed interface (Labor, Equipment, Overhead, Facility)
   - Location selector for cost overrides
   - Super Admin field restrictions (gold border)
   - Override indicators (badges showing DEFAULT vs OVERRIDE)
   - Service-specific rates
   - Target margins by business type
   - Bulk save functionality

## Design System

### Colors
- Navy (#0D2B4E) - Primary brand, headers, text
- Sky (#2B9ED4) - Accent, buttons, active states
- Green (#1A7A4A) - Success, positive margins
- Red (#C0392B) - Danger, negative margins
- Gold (#E8A020) - Warning, caution
- Gray (#5D7A8A) - Secondary text, labels
- Mist (#E8F4FB) - Light backgrounds, input fields
- Border (#C8E0F0) - Dividers, borders

### Typography
- System fonts: -apple-system, BlinkMacSystemFont, 'Segoe UI'
- Headings: 700-800 weight
- Body: 400-600 weight
- Labels: 600 weight, uppercase

### Components
- **Cards**: White background, 8px border radius, subtle shadow
- **Buttons**: Primary (Sky), Secondary (White), rounded corners
- **Inputs**: Mist background, Sky border on focus, rounded
- **Status Badges**: Color-coded, rounded, small text
- **Tables**: Zebra striping, hover states, sortable headers
- **Verdict Box**: Gradient background, color-coded by status

## Key Features Demonstrated

1. **Multi-tenant Support**
   - Location selector throughout
   - Company branding in header

2. **Role-Based Access Control**
   - Admin badge in header
   - Super Admin field restrictions
   - Conditional UI elements

3. **Business Type Toggle**
   - Commercial vs Residential
   - Affects calculations and defaults

4. **Real-Time Calculations**
   - Live updates as user types
   - Debounced for performance
   - Clear visual feedback

5. **Margin Analysis**
   - Color-coded indicators
   - Break-even calculations
   - Target rate suggestions
   - Verdict boxes with guidance

## Next Steps

- [ ] Create mobile-responsive versions
- [ ] Add loading states and animations
- [ ] Design error states and validation
- [ ] Create quote detail/edit views
- [ ] Design user management pages
- [ ] Create NetSuite sync status view
- [ ] Design public quote share page
- [ ] Add dark mode variant (optional)
