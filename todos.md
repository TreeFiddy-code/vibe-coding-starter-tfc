# Project Todos - Dashboard Button Implementations

## Progress Tracker
- [ ] Reusable Components (Foundation)
- [ ] Command Center (3 pages)
- [ ] Integrations (4 pages)
- [ ] Platforms (4 pages)
- [ ] Management (3 pages)
- [ ] Support (2 pages)
- [ ] Settings (1 page)
- [ ] Main Dashboard (1 page)

---

## 1. REUSABLE COMPONENTS (Build First)

### Foundation Components Needed:
- [ ] Modal wrapper component (`components/ui/Modal.tsx`)
- [ ] Confirmation Dialog (`components/ui/ConfirmDialog.tsx`)
- [ ] Toast notifications (`components/ui/Toast.tsx`)
- [ ] Dropdown menu (`components/ui/DropdownMenu.tsx`)
- [ ] Form Input component (`components/ui/FormInput.tsx`)
- [ ] Form Select component (`components/ui/FormSelect.tsx`)
- [ ] Form Toggle component (`components/ui/FormToggle.tsx`)

---

## 2. COMMAND CENTER (3 pages)

### AI Agents (`/dashboard/command/agents`)
- [ ] "Deploy Agent" button → Agent configuration modal
- [ ] Play/Pause buttons → Click handlers + confirmation
- [ ] Settings icons → Settings modal per agent
- [ ] More vertical icons → Dropdown menu with actions

### Automation Rules (`/dashboard/command/rules`)
- [ ] "New Rule" button → Rule creation form/modal
- [ ] Toggle switches → Enable/disable handlers
- [ ] Edit icons → Rule edit modal
- [ ] Delete icons → Delete confirmation dialog
- [ ] Approve/Reject buttons → Escalation action handlers

### Workflows (`/dashboard/command/workflows`)
- [ ] "New Workflow" button → Workflow builder modal
- [ ] Play/Pause buttons → Workflow control handlers
- [ ] Edit icons → Workflow edit modal
- [ ] Copy icons → Duplicate workflow handler

---

## 3. INTEGRATIONS (4 pages)

### Integration Portal (`/dashboard/integrations`)
- [ ] "Add Integration" button → Integration connection modal
- [ ] Refresh icons → Sync refresh handlers
- [ ] Settings icons → Platform settings modal
- [ ] Available platform cards → Connection setup modals

### API Keys (`/dashboard/integrations/api-keys`)
- [ ] "Generate New Key" button → Key generation modal
- [ ] Copy icons → Copy to clipboard handler
- [ ] Refresh icons → Rotate key confirmation
- [ ] Delete icons → Delete confirmation dialog

### Webhooks (`/dashboard/integrations/webhooks`)
- [ ] "Add Webhook" button → Webhook creation form
- [ ] Play/Pause buttons → Enable/disable handlers
- [ ] Edit icons → Webhook edit modal
- [ ] Delete icons → Delete confirmation
- [ ] Copy URL buttons → Copy to clipboard handler

### Integration Health (`/dashboard/integrations/health`)
- [ ] Incident items → Incident detail modal
- [ ] Service rows → Service detail view

---

## 4. PLATFORMS (4 pages)

### Amazon (`/dashboard/platforms/amazon`)
- [ ] Order rows → Order detail modal
- [ ] Inventory alerts → Restock action modal
- [ ] Stock warnings → Alert resolution flow

### Shopify (`/dashboard/platforms/shopify`)
- [ ] Order rows → Order management modal
- [ ] Product rows → Product detail/edit modal
- [ ] Health recommendations → Action flow modals

### eBay (`/dashboard/platforms/ebay`)
- [ ] Auction rows → Auction management modal
- [ ] Performance issues → Resolution workflow modal
- [ ] Rate limit banner → Alert handling actions

### Social Commerce (`/dashboard/platforms/social`)
- [ ] Content items → Performance drill-down modal
- [ ] Influencer cards → Partnership management modal
- [ ] Channel progress → Goal tracking modal

---

## 5. MANAGEMENT (3 pages)

### Orders (`/dashboard/management/orders`)
- [ ] "Export" button → Export options modal
- [ ] "Filter" button → Advanced filter modal
- [ ] Eye icons → Order detail modal
- [ ] "Process" buttons → Process order workflow
- [ ] "Ship" buttons → Ship order workflow
- [ ] "Resolve" buttons → Exception resolution modal

### Products (`/dashboard/management/products`)
- [ ] "Add Product" button → Product creation form
- [ ] "Filter" button → Advanced filter modal
- [ ] Stats chart icons → Product analytics modal
- [ ] Edit icons → Product edit form
- [ ] Delete icons → Delete confirmation

### Suppliers (`/dashboard/management/suppliers`)
- [ ] "Add Supplier" button → Supplier creation form
- [ ] "Filter" button → Filter modal
- [ ] Phone icons → Contact handler (tel: link or modal)
- [ ] Mail icons → Email handler (mailto: or modal)
- [ ] External link icons → Supplier detail view

---

## 6. SUPPORT (2 pages)

### Customer Service (`/dashboard/support/customer-service`)
- [ ] "Filter" button → Filter modal
- [ ] "View" buttons → Ticket detail modal
- [ ] "Start Live Chat" → Live chat interface
- [ ] "Send Bulk Update" → Bulk update modal
- [ ] "Train AI Responses" → AI training interface

### Escalations (`/dashboard/support/escalations`)
- [ ] "Approve" buttons → Approval confirmation handler
- [ ] "Investigate" buttons → Investigation modal
- [ ] "Reject" buttons → Rejection confirmation
- [ ] "Mark Resolved" buttons → Resolution handler
- [ ] "Add Note" buttons → Notes/comments modal

---

## 7. SETTINGS (`/dashboard/settings`)
- [ ] "Save Changes" button → Save settings handler
- [ ] All toggle switches → Toggle state handlers
- [ ] Edit buttons → Edit field modals
- [ ] "Manage" buttons → Management modals (billing, team, etc.)
- [ ] Theme toggle → Theme switching handler

---

## 8. MAIN DASHBOARD (`/dashboard`)
- [ ] Quick Actions buttons → Navigation or action handlers
- [ ] Automation Control toggle → Mode switching handler
- [ ] All cards → Click-through navigation to detail pages

---

## Completed

