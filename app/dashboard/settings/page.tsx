'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button } from '@/components/dashboard';
import {
  SettingsIcon,
  UserIcon,
  BellIcon,
  ShieldIcon,
  CreditCardIcon,
  UsersIcon,
  PaletteIcon,
  GlobeIcon,
  KeyIcon,
  MailIcon,
  SmartphoneIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  EyeIcon,
  SendIcon,
  XIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/shared/ui/alert-dialog';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { toast } from 'sonner';

interface SettingItem {
  label: string;
  value: string;
  editable?: boolean;
  toggle?: boolean;
  enabled?: boolean;
  action?: string;
  badge?: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  sentAt: string;
}

const initialTeamMembers: TeamMember[] = [
  { id: '1', name: 'Avery Chen', email: 'avery.chen@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Manager', status: 'Active' },
  { id: '3', name: 'Mike Davis', email: 'mike.d@example.com', role: 'Editor', status: 'Active' },
  { id: '4', name: 'Emily Roberts', email: 'emily.r@example.com', role: 'Viewer', status: 'Active' },
  { id: '5', name: 'John Smith', email: 'john.s@example.com', role: 'Editor', status: 'Inactive' },
];

const initialInvites: Invite[] = [
  { id: '1', email: 'alex.m@example.com', role: 'Editor', sentAt: '2 days ago' },
  { id: '2', email: 'lisa.k@example.com', role: 'Viewer', sentAt: '1 week ago' },
];

const settingsSectionsBase = [
  {
    id: 'profile',
    name: 'Profile Settings',
    description: 'Manage your account information and preferences',
    icon: UserIcon,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configure how you receive alerts and updates',
    icon: BellIcon,
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Protect your account with security features',
    icon: ShieldIcon,
  },
  {
    id: 'billing',
    name: 'Billing & Subscription',
    description: 'Manage your subscription and payment methods',
    icon: CreditCardIcon,
  },
  {
    id: 'team',
    name: 'Team Management',
    description: 'Manage team members and permissions',
    icon: UsersIcon,
  },
  {
    id: 'appearance',
    name: 'Appearance',
    description: 'Customize the look and feel of your dashboard',
    icon: PaletteIcon,
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [invites, setInvites] = useState<Invite[]>(initialInvites);

  // Settings state
  const [profile, setProfile] = useState({
    displayName: 'Avery Chen',
    email: 'avery.chen@example.com',
    role: 'Ops Manager',
    timezone: 'PST (UTC-8)',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    escalationAlerts: 'Immediate',
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: true,
    sessionTimeout: '30 minutes',
    loginNotifications: true,
  });

  const [billing, setBilling] = useState({
    currentPlan: 'Enterprise',
    billingCycle: 'Annual',
    paymentMethod: '•••• 4242',
    nextInvoice: 'Feb 15, 2024 - $2,499',
  });

  const [appearance, setAppearance] = useState({
    darkMode: true,
    compactMode: false,
    sidebarPosition: 'Left',
  });

  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editFieldOpen, setEditFieldOpen] = useState(false);
  const [editingField, setEditingField] = useState({ label: '', value: '', section: '' });
  const [updatePaymentOpen, setUpdatePaymentOpen] = useState(false);
  const [viewInvoiceOpen, setViewInvoiceOpen] = useState(false);
  const [manageTeamOpen, setManageTeamOpen] = useState(false);
  const [viewInvitesOpen, setViewInvitesOpen] = useState(false);
  const [inviteUserOpen, setInviteUserOpen] = useState(false);
  const [configureRolesOpen, setConfigureRolesOpen] = useState(false);
  const [removeUserOpen, setRemoveUserOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Form states
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [newPayment, setNewPayment] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });
  const [newInvite, setNewInvite] = useState({ email: '', role: 'Viewer' });

  const currentSectionBase = settingsSectionsBase.find((s) => s.id === activeSection);

  // Build current section items based on state
  const getCurrentSectionItems = (): SettingItem[] => {
    switch (activeSection) {
      case 'profile':
        return [
          { label: 'Display Name', value: profile.displayName, editable: true },
          { label: 'Email', value: profile.email, editable: true },
          { label: 'Role', value: profile.role, editable: false },
          { label: 'Timezone', value: profile.timezone, editable: true },
        ];
      case 'notifications':
        return [
          { label: 'Email Notifications', value: notifications.emailNotifications ? 'Enabled' : 'Disabled', toggle: true, enabled: notifications.emailNotifications },
          { label: 'Push Notifications', value: notifications.pushNotifications ? 'Enabled' : 'Disabled', toggle: true, enabled: notifications.pushNotifications },
          { label: 'SMS Alerts', value: notifications.smsAlerts ? 'Enabled' : 'Disabled', toggle: true, enabled: notifications.smsAlerts },
          { label: 'Escalation Alerts', value: notifications.escalationAlerts, editable: true },
        ];
      case 'security':
        return [
          { label: 'Two-Factor Authentication', value: security.twoFactorAuth ? 'Enabled' : 'Disabled', toggle: true, enabled: security.twoFactorAuth },
          { label: 'Session Timeout', value: security.sessionTimeout, editable: true },
          { label: 'Login Notifications', value: security.loginNotifications ? 'Enabled' : 'Disabled', toggle: true, enabled: security.loginNotifications },
          { label: 'API Access', value: '4 active keys', action: 'Manage' },
        ];
      case 'billing':
        return [
          { label: 'Current Plan', value: billing.currentPlan, badge: 'Active' },
          { label: 'Billing Cycle', value: billing.billingCycle, editable: true },
          { label: 'Payment Method', value: billing.paymentMethod, action: 'Update' },
          { label: 'Next Invoice', value: billing.nextInvoice, action: 'View' },
        ];
      case 'team':
        return [
          { label: 'Team Members', value: `${teamMembers.length} users`, action: 'Manage' },
          { label: 'Pending Invites', value: `${invites.length} pending`, action: 'View' },
          { label: 'Roles & Permissions', value: '4 roles defined', action: 'Configure' },
        ];
      case 'appearance':
        return [
          { label: 'Theme', value: appearance.darkMode ? 'Dark' : 'Light', toggle: true, enabled: appearance.darkMode },
          { label: 'Compact Mode', value: appearance.compactMode ? 'Enabled' : 'Disabled', toggle: true, enabled: appearance.compactMode },
          { label: 'Sidebar Position', value: appearance.sidebarPosition, editable: true },
        ];
      default:
        return [];
    }
  };

  // Handlers
  const handleToggle = (label: string) => {
    switch (activeSection) {
      case 'notifications':
        if (label === 'Email Notifications') setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications });
        if (label === 'Push Notifications') setNotifications({ ...notifications, pushNotifications: !notifications.pushNotifications });
        if (label === 'SMS Alerts') setNotifications({ ...notifications, smsAlerts: !notifications.smsAlerts });
        break;
      case 'security':
        if (label === 'Two-Factor Authentication') setSecurity({ ...security, twoFactorAuth: !security.twoFactorAuth });
        if (label === 'Login Notifications') setSecurity({ ...security, loginNotifications: !security.loginNotifications });
        break;
      case 'appearance':
        if (label === 'Theme') setAppearance({ ...appearance, darkMode: !appearance.darkMode });
        if (label === 'Compact Mode') setAppearance({ ...appearance, compactMode: !appearance.compactMode });
        break;
    }
    toast.success(`${label} updated`);
  };

  const handleEdit = (item: SettingItem) => {
    setEditingField({ label: item.label, value: item.value, section: activeSection });
    setEditFieldOpen(true);
  };

  const handleSaveField = () => {
    const { label, value, section } = editingField;
    switch (section) {
      case 'profile':
        if (label === 'Display Name') setProfile({ ...profile, displayName: value });
        if (label === 'Email') setProfile({ ...profile, email: value });
        if (label === 'Timezone') setProfile({ ...profile, timezone: value });
        break;
      case 'notifications':
        if (label === 'Escalation Alerts') setNotifications({ ...notifications, escalationAlerts: value });
        break;
      case 'security':
        if (label === 'Session Timeout') setSecurity({ ...security, sessionTimeout: value });
        break;
      case 'billing':
        if (label === 'Billing Cycle') setBilling({ ...billing, billingCycle: value });
        break;
      case 'appearance':
        if (label === 'Sidebar Position') setAppearance({ ...appearance, sidebarPosition: value });
        break;
    }
    setEditFieldOpen(false);
    toast.success(`${label} updated`);
  };

  const handleAction = (item: SettingItem) => {
    if (item.action === 'Update' && item.label === 'Payment Method') {
      setUpdatePaymentOpen(true);
    } else if (item.action === 'View' && item.label === 'Next Invoice') {
      setViewInvoiceOpen(true);
    } else if (item.action === 'Manage' && item.label === 'Team Members') {
      setManageTeamOpen(true);
    } else if (item.action === 'View' && item.label === 'Pending Invites') {
      setViewInvitesOpen(true);
    } else if (item.action === 'Configure' && item.label === 'Roles & Permissions') {
      setConfigureRolesOpen(true);
    } else if (item.action === 'Manage' && item.label === 'API Access') {
      toast.success('Opening API key management...');
    }
  };

  const handleSaveChanges = () => {
    toast.success('Settings saved successfully');
  };

  const handleUpdatePayment = () => {
    if (!newPayment.cardNumber || !newPayment.expiry || !newPayment.cvv) {
      toast.error('Please fill in all payment details');
      return;
    }
    setBilling({ ...billing, paymentMethod: `•••• ${newPayment.cardNumber.slice(-4)}` });
    setUpdatePaymentOpen(false);
    setNewPayment({ cardNumber: '', expiry: '', cvv: '', name: '' });
    toast.success('Payment method updated');
  };

  const handleInviteUser = () => {
    if (!newInvite.email) {
      toast.error('Please enter an email address');
      return;
    }
    const invite: Invite = {
      id: String(Date.now()),
      email: newInvite.email,
      role: newInvite.role,
      sentAt: 'Just now',
    };
    setInvites([invite, ...invites]);
    setNewInvite({ email: '', role: 'Viewer' });
    setInviteUserOpen(false);
    toast.success(`Invitation sent to ${invite.email}`);
  };

  const handleCancelInvite = (id: string) => {
    setInvites(invites.filter((i) => i.id !== id));
    toast.success('Invitation cancelled');
  };

  const handleResendInvite = (invite: Invite) => {
    toast.success(`Invitation resent to ${invite.email}`);
  };

  const handleRemoveUser = () => {
    if (!selectedMember) return;
    setTeamMembers(teamMembers.filter((m) => m.id !== selectedMember.id));
    setRemoveUserOpen(false);
    setSelectedMember(null);
    toast.success('Team member removed');
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    setTeamMembers(teamMembers.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    toast.success('Role updated');
  };

  const currentItems = getCurrentSectionItems();

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account settings and preferences."
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-2">
              {settingsSectionsBase.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{section.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {currentSectionBase && (
            <Card>
              <CardHeader
                title={currentSectionBase.name}
                action={<Button variant="primary" size="sm" onClick={handleSaveChanges}>Save Changes</Button>}
              />
              <div className="p-4">
                <p className="text-slate-500 dark:text-slate-400 mb-6">{currentSectionBase.description}</p>

                <div className="space-y-4">
                  {currentItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-gray-100">{item.label}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.value}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Chip variant="success" size="sm">{item.badge}</Chip>
                        )}
                        {item.toggle !== undefined && (
                          <button
                            onClick={() => handleToggle(item.label)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              item.enabled
                                ? 'bg-primary-500'
                                : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                item.enabled ? 'left-5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        )}
                        {item.editable && (
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                        )}
                        {item.action && (
                          <Button variant="secondary" size="sm" onClick={() => handleAction(item)}>{item.action}</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Field Modal */}
      <Dialog open={editFieldOpen} onOpenChange={setEditFieldOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit {editingField.label}</DialogTitle>
            <DialogDescription>Update the value for this setting.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="field-value">{editingField.label}</Label>
            <Input
              id="field-value"
              value={editingField.value}
              onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditFieldOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveField}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Modal */}
      <Dialog open={updatePaymentOpen} onOpenChange={setUpdatePaymentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>Enter your new card details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="card-name">Name on Card</Label>
              <Input
                id="card-name"
                value={newPayment.name}
                onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                value={newPayment.cardNumber}
                onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-expiry">Expiry Date</Label>
                <Input
                  id="card-expiry"
                  value={newPayment.expiry}
                  onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })}
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <Label htmlFor="card-cvv">CVV</Label>
                <Input
                  id="card-cvv"
                  value={newPayment.cvv}
                  onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })}
                  placeholder="123"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setUpdatePaymentOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdatePayment}>Update Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Modal */}
      <Dialog open={viewInvoiceOpen} onOpenChange={setViewInvoiceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>Upcoming invoice for your subscription.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Plan</span>
                <span className="font-medium">Enterprise</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Billing Period</span>
                <span className="font-medium">Annual</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Due Date</span>
                <span className="font-medium">Feb 15, 2024</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-primary-600">$2,499.00</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setViewInvoiceOpen(false)}>Close</Button>
            <Button variant="primary" onClick={() => { toast.success('Invoice downloaded'); setViewInvoiceOpen(false); }}>
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Team Modal */}
      <Dialog open={manageTeamOpen} onOpenChange={setManageTeamOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Team Members</DialogTitle>
            <DialogDescription>View and manage your team members.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-end mb-4">
              <Button variant="primary" size="sm" onClick={() => { setManageTeamOpen(false); setInviteUserOpen(true); }}>
                <PlusIcon className="w-4 h-4 mr-1" />
                Invite User
              </Button>
            </div>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip variant={member.status === 'Active' ? 'success' : 'neutral'} size="sm">
                      {member.status}
                    </Chip>
                    <Select value={member.role} onValueChange={(v) => handleChangeRole(member.id, v)}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setSelectedMember(member); setRemoveUserOpen(true); }}
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="primary" onClick={() => setManageTeamOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User Modal */}
      <Dialog open={inviteUserOpen} onOpenChange={setInviteUserOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to join your team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                value={newInvite.email}
                onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                placeholder="colleague@example.com"
              />
            </div>
            <div>
              <Label htmlFor="invite-role">Role</Label>
              <Select value={newInvite.role} onValueChange={(v) => setNewInvite({ ...newInvite, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setInviteUserOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleInviteUser}>
              <SendIcon className="w-4 h-4 mr-1" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Pending Invites Modal */}
      <Dialog open={viewInvitesOpen} onOpenChange={setViewInvitesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pending Invitations</DialogTitle>
            <DialogDescription>Manage pending team invitations.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {invites.length === 0 ? (
              <p className="text-center text-slate-500 py-4">No pending invitations</p>
            ) : (
              <div className="space-y-2">
                {invites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-slate-500">{invite.role} · Sent {invite.sentAt}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="secondary" size="sm" onClick={() => handleResendInvite(invite)}>
                        Resend
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleCancelInvite(invite.id)}>
                        <XIcon className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => { setViewInvitesOpen(false); setInviteUserOpen(true); }}>
              <PlusIcon className="w-4 h-4 mr-1" />
              New Invitation
            </Button>
            <Button variant="primary" onClick={() => setViewInvitesOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Roles Modal */}
      <Dialog open={configureRolesOpen} onOpenChange={setConfigureRolesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Roles & Permissions</DialogTitle>
            <DialogDescription>Review the permissions for each role.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            {[
              { role: 'Admin', desc: 'Full access to all settings and features', count: 1 },
              { role: 'Manager', desc: 'Manage team, view reports, edit content', count: 2 },
              { role: 'Editor', desc: 'Create and edit content, limited settings', count: 3 },
              { role: 'Viewer', desc: 'Read-only access to dashboard', count: 2 },
            ].map((r) => (
              <div key={r.role} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{r.role}</span>
                  <Chip variant="neutral" size="sm">{r.count} users</Chip>
                </div>
                <p className="text-sm text-slate-500">{r.desc}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="primary" onClick={() => setConfigureRolesOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove User Confirmation */}
      <AlertDialog open={removeUserOpen} onOpenChange={setRemoveUserOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from the team? They will lose access to all resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveUser} className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
