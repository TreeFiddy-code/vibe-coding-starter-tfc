'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button } from '@/components/dashboard';
import {
  HeadphonesIcon,
  MessageSquareIcon,
  MailIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  UserIcon,
  SendIcon,
  SearchIcon,
  FilterIcon,
  StarIcon,
  XIcon,
  RefreshCwIcon,
  CopyIcon,
  ArrowRightIcon,
  BotIcon,
  PlusIcon,
  TrashIcon,
  SaveIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  customer: string;
  email: string;
  subject: string;
  channel: string;
  priority: string;
  status: string;
  created: string;
  assignedTo: string;
  lastMessage: string;
  messages?: { from: string; text: string; time: string }[];
}

interface AITrainingExample {
  id: string;
  trigger: string;
  response: string;
  category: string;
}

const supportStats = {
  openTickets: 23,
  avgResponseTime: '12 min',
  satisfactionScore: 4.7,
  resolvedToday: 67,
  autoResolved: 45,
};

const initialTickets: Ticket[] = [
  {
    id: 'TKT-4521',
    customer: 'Sarah Mitchell',
    email: 'sarah.m@email.com',
    subject: 'Order not received',
    channel: 'Email',
    priority: 'High',
    status: 'Open',
    created: '15 min ago',
    assignedTo: 'AI Bot',
    lastMessage: 'I ordered 5 days ago and tracking shows delivered but I never received it.',
    messages: [
      { from: 'customer', text: 'Hi, I placed order #ORD-2345 five days ago. The tracking says delivered, but I never received it.', time: '15 min ago' },
      { from: 'ai', text: 'I apologize for the inconvenience. Let me look into this for you. I can see order #ORD-2345 was marked as delivered on Jan 25th. Could you confirm the delivery address?', time: '14 min ago' },
      { from: 'customer', text: 'Yes, it\'s 123 Main St, Apt 4B. I checked with my neighbors and building manager, no one has seen it.', time: '10 min ago' },
    ],
  },
  {
    id: 'TKT-4520',
    customer: 'John Davidson',
    email: 'john.d@email.com',
    subject: 'Wrong item received',
    channel: 'Chat',
    priority: 'Medium',
    status: 'In Progress',
    created: '1 hour ago',
    assignedTo: 'AI Bot',
    lastMessage: 'I ordered the blue version but received red.',
    messages: [
      { from: 'customer', text: 'I ordered the blue wireless headphones but received red ones instead.', time: '1 hour ago' },
      { from: 'ai', text: 'I\'m sorry about the mix-up! I can arrange for a free replacement. Would you like us to send a return label for the incorrect item?', time: '55 min ago' },
    ],
  },
  {
    id: 'TKT-4519',
    customer: 'Emily Roberts',
    email: 'emily.r@email.com',
    subject: 'Refund request',
    channel: 'Email',
    priority: 'Medium',
    status: 'Pending',
    created: '2 hours ago',
    assignedTo: 'Human',
    lastMessage: 'I would like to return this item for a full refund.',
    messages: [
      { from: 'customer', text: 'The product doesn\'t match the description. I would like to return it for a full refund.', time: '2 hours ago' },
      { from: 'ai', text: 'I understand your concern. This request has been escalated to a human agent for review due to our refund policy requirements.', time: '1 hour 55 min ago' },
    ],
  },
  {
    id: 'TKT-4518',
    customer: 'Mike Thompson',
    email: 'mike.t@email.com',
    subject: 'Product inquiry',
    channel: 'Chat',
    priority: 'Low',
    status: 'Open',
    created: '3 hours ago',
    assignedTo: 'AI Bot',
    lastMessage: 'Does this product come with a warranty?',
    messages: [
      { from: 'customer', text: 'Hi, I\'m interested in the Pro Wireless Speaker. Does it come with a warranty?', time: '3 hours ago' },
    ],
  },
];

const initialTrainingExamples: AITrainingExample[] = [
  { id: '1', trigger: 'order not received', response: 'I apologize for the inconvenience. Let me check the tracking status for you.', category: 'Shipping' },
  { id: '2', trigger: 'refund request', response: 'I understand you want a refund. Let me review your order details.', category: 'Refunds' },
  { id: '3', trigger: 'warranty', response: 'All our products come with a 1-year manufacturer warranty.', category: 'Products' },
];

const recentResponses = [
  { ticket: 'TKT-4517', response: 'Provided tracking update and expected delivery date', time: '5 min ago', auto: true },
  { ticket: 'TKT-4516', response: 'Initiated refund process for damaged item', time: '12 min ago', auto: true },
  { ticket: 'TKT-4515', response: 'Escalated to human agent for complex issue', time: '25 min ago', auto: true },
  { ticket: 'TKT-4514', response: 'Answered product compatibility question', time: '38 min ago', auto: true },
];

const channelIcons: Record<string, typeof MailIcon> = {
  Email: MailIcon,
  Chat: MessageSquareIcon,
  Phone: PhoneIcon,
};

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Open: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  'In Progress': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  Pending: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  Resolved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
};

export default function CustomerServicePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [trainingExamples, setTrainingExamples] = useState<AITrainingExample[]>(initialTrainingExamples);

  // Modal states
  const [ticketDetailOpen, setTicketDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);

  // Selected data
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Form states
  const [replyMessage, setReplyMessage] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string; time: string }[]>([]);
  const [selectedChatCustomer, setSelectedChatCustomer] = useState('');

  const [bulkUpdate, setBulkUpdate] = useState({
    status: '',
    message: '',
    selectedTickets: [] as string[],
  });

  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    channel: [] as string[],
    assignedTo: '',
  });

  const [newTrainingExample, setNewTrainingExample] = useState({
    trigger: '',
    response: '',
    category: '',
  });

  // Handlers
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyMessage('');
    setTicketDetailOpen(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        const newMessage = { from: 'agent', text: replyMessage, time: 'Just now' };
        return {
          ...t,
          messages: [...(t.messages || []), newMessage],
          lastMessage: replyMessage,
          status: 'In Progress',
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      messages: [...(selectedTicket.messages || []), { from: 'agent', text: replyMessage, time: 'Just now' }],
    });
    setReplyMessage('');
    toast.success('Reply sent successfully');
  };

  const handleResolveTicket = () => {
    if (!selectedTicket) return;

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? { ...t, status: 'Resolved' } : t)));
    setTicketDetailOpen(false);
    toast.success('Ticket resolved successfully');
  };

  const handleEscalateTicket = () => {
    if (!selectedTicket) return;

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? { ...t, assignedTo: 'Human', priority: 'High' } : t)));
    setSelectedTicket({ ...selectedTicket, assignedTo: 'Human', priority: 'High' });
    toast.success('Ticket escalated to human agent');
  };

  const handleStartLiveChat = () => {
    setChatMessages([
      { from: 'system', text: 'Live chat session started. Customer is waiting...', time: 'Just now' },
    ]);
    setSelectedChatCustomer('New Customer');
    setChatMessage('');
    setLiveChatOpen(true);
  };

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;

    setChatMessages([...chatMessages, { from: 'agent', text: chatMessage, time: 'Just now' }]);
    setChatMessage('');

    // Simulate customer response after a delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { from: 'customer', text: 'Thank you for your help!', time: 'Just now' },
      ]);
    }, 2000);
  };

  const handleEndChat = () => {
    setLiveChatOpen(false);
    toast.success('Chat session ended');
  };

  const handleBulkUpdate = () => {
    if (bulkUpdate.selectedTickets.length === 0) {
      toast.error('Please select at least one ticket');
      return;
    }
    if (!bulkUpdate.status && !bulkUpdate.message) {
      toast.error('Please select a status or enter a message');
      return;
    }

    setTickets(tickets.map((t) => {
      if (bulkUpdate.selectedTickets.includes(t.id)) {
        return {
          ...t,
          status: bulkUpdate.status || t.status,
          messages: bulkUpdate.message
            ? [...(t.messages || []), { from: 'agent', text: bulkUpdate.message, time: 'Just now' }]
            : t.messages,
        };
      }
      return t;
    }));

    setBulkUpdateOpen(false);
    setBulkUpdate({ status: '', message: '', selectedTickets: [] });
    toast.success(`Updated ${bulkUpdate.selectedTickets.length} tickets`);
  };

  const toggleBulkTicket = (ticketId: string) => {
    setBulkUpdate((prev) => ({
      ...prev,
      selectedTickets: prev.selectedTickets.includes(ticketId)
        ? prev.selectedTickets.filter((id) => id !== ticketId)
        : [...prev.selectedTickets, ticketId],
    }));
  };

  const handleAddTrainingExample = () => {
    if (!newTrainingExample.trigger || !newTrainingExample.response || !newTrainingExample.category) {
      toast.error('Please fill in all fields');
      return;
    }

    const example: AITrainingExample = {
      id: String(trainingExamples.length + 1),
      ...newTrainingExample,
    };

    setTrainingExamples([...trainingExamples, example]);
    setNewTrainingExample({ trigger: '', response: '', category: '' });
    toast.success('Training example added');
  };

  const handleDeleteTrainingExample = (id: string) => {
    setTrainingExamples(trainingExamples.filter((e) => e.id !== id));
    toast.success('Training example deleted');
  };

  const handleSaveTraining = () => {
    toast.success('AI training data saved successfully');
    setAiTrainingOpen(false);
  };

  const handleApplyFilters = () => {
    toast.success('Filters applied');
    setFilterOpen(false);
  };

  const toggleFilterStatus = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status) ? prev.status.filter((s) => s !== status) : [...prev.status, status],
    }));
  };

  const toggleFilterPriority = (priority: string) => {
    setFilters((prev) => ({
      ...prev,
      priority: prev.priority.includes(priority) ? prev.priority.filter((p) => p !== priority) : [...prev.priority, priority],
    }));
  };

  const toggleFilterChannel = (channel: string) => {
    setFilters((prev) => ({
      ...prev,
      channel: prev.channel.includes(channel) ? prev.channel.filter((c) => c !== channel) : [...prev.channel, channel],
    }));
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status.length === 0 || filters.status.includes(ticket.status);
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(ticket.priority);
    const matchesChannel = filters.channel.length === 0 || filters.channel.includes(ticket.channel);
    const matchesAssigned = !filters.assignedTo || ticket.assignedTo === filters.assignedTo;

    return matchesSearch && matchesStatus && matchesPriority && matchesChannel && matchesAssigned;
  });

  return (
    <DashboardLayout
      title="Customer Service"
      subtitle="Manage customer support tickets and AI-assisted responses."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{supportStats.openTickets}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Open Tickets</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{supportStats.avgResponseTime}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg Response</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <StarIcon className="w-5 h-5 text-amber-500 fill-amber-500" />
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{supportStats.satisfactionScore}</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">CSAT Score</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{supportStats.resolvedToday}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Resolved Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{supportStats.autoResolved}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI Resolved</p>
          </div>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Support Tickets"
              action={
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setFilterOpen(true)}>
                    <FilterIcon className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                </div>
              }
            />
            <div className="p-4">
              {/* Search */}
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              {/* Tickets */}
              <div className="space-y-3">
                {filteredTickets.map((ticket) => {
                  const ChannelIcon = channelIcons[ticket.channel] || MessageSquareIcon;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedTicketId === ticket.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900 dark:text-gray-100">{ticket.customer}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[ticket.priority]}`}>
                                {ticket.priority}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{ticket.id} · {ticket.created}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChannelIcon className="w-4 h-4 text-slate-400" />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status].bg} ${statusColors[ticket.status].text}`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-medium text-slate-800 dark:text-gray-200 mb-1">{ticket.subject}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{ticket.lastMessage}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          {ticket.assignedTo === 'AI Bot' ? (
                            <>
                              <HeadphonesIcon className="w-3 h-3" />
                              AI Handling
                            </>
                          ) : (
                            <>
                              <UserIcon className="w-3 h-3" />
                              Human Agent
                            </>
                          )}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTicket(ticket);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent AI Responses */}
          <Card>
            <CardHeader title="Recent AI Responses" action={<Chip variant="success" size="sm">Auto</Chip>} />
            <div className="p-4 space-y-3">
              {recentResponses.map((response, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900 dark:text-gray-100 text-sm">{response.ticket}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{response.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{response.response}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <div className="p-4 space-y-2">
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={handleStartLiveChat}>
                <MessageSquareIcon className="w-4 h-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => setBulkUpdateOpen(true)}>
                <MailIcon className="w-4 h-4 mr-2" />
                Send Bulk Update
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => setAiTrainingOpen(true)}>
                <HeadphonesIcon className="w-4 h-4 mr-2" />
                Train AI Responses
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      <Dialog open={ticketDetailOpen} onOpenChange={setTicketDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5" />
              Ticket {selectedTicket?.id}
            </DialogTitle>
            <DialogDescription>{selectedTicket?.subject}</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4 py-4">
              {/* Customer Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedTicket.customer}</p>
                    <p className="text-sm text-slate-500">{selectedTicket.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[selectedTicket.priority]}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedTicket.status]?.bg} ${statusColors[selectedTicket.status]?.text}`}>
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Ticket Meta */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Channel</p>
                  <p className="font-medium">{selectedTicket.channel}</p>
                </div>
                <div>
                  <p className="text-slate-500">Created</p>
                  <p className="font-medium">{selectedTicket.created}</p>
                </div>
                <div>
                  <p className="text-slate-500">Assigned To</p>
                  <p className="font-medium">{selectedTicket.assignedTo}</p>
                </div>
              </div>

              {/* Message Thread */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 border-b">
                  <p className="font-medium text-sm">Conversation</p>
                </div>
                <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
                  {selectedTicket.messages?.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.from === 'customer' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.from === 'customer'
                            ? 'bg-slate-100 dark:bg-slate-800'
                            : message.from === 'ai'
                            ? 'bg-primary-100 dark:bg-primary-900/30'
                            : 'bg-green-100 dark:bg-green-900/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium capitalize">
                            {message.from === 'ai' ? 'AI Bot' : message.from === 'agent' ? 'You' : 'Customer'}
                          </span>
                          <span className="text-xs text-slate-500">{message.time}</span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Input */}
              <div className="space-y-2">
                <Label>Reply</Label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="secondary" onClick={handleEscalateTicket}>
              <ArrowRightIcon className="w-4 h-4 mr-1" />
              Escalate
            </Button>
            <Button variant="secondary" onClick={handleResolveTicket}>
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Resolve
            </Button>
            <Button variant="primary" onClick={handleSendReply}>
              <SendIcon className="w-4 h-4 mr-1" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Tickets</DialogTitle>
            <DialogDescription>Narrow down your ticket list</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Status</Label>
              <div className="space-y-2">
                {['Open', 'In Progress', 'Pending', 'Resolved'].map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-status-${status}`}
                      checked={filters.status.includes(status)}
                      onCheckedChange={() => toggleFilterStatus(status)}
                    />
                    <Label htmlFor={`filter-status-${status}`} className="font-normal">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Priority</Label>
              <div className="space-y-2">
                {['High', 'Medium', 'Low'].map((priority) => (
                  <div key={priority} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-priority-${priority}`}
                      checked={filters.priority.includes(priority)}
                      onCheckedChange={() => toggleFilterPriority(priority)}
                    />
                    <Label htmlFor={`filter-priority-${priority}`} className="font-normal">
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Channel</Label>
              <div className="space-y-2">
                {['Email', 'Chat', 'Phone'].map((channel) => (
                  <div key={channel} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-channel-${channel}`}
                      checked={filters.channel.includes(channel)}
                      onCheckedChange={() => toggleFilterChannel(channel)}
                    />
                    <Label htmlFor={`filter-channel-${channel}`} className="font-normal">
                      {channel}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="assigned-filter">Assigned To</Label>
              <Select value={filters.assignedTo} onValueChange={(v) => setFilters({ ...filters, assignedTo: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Anyone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Anyone</SelectItem>
                  <SelectItem value="AI Bot">AI Bot</SelectItem>
                  <SelectItem value="Human">Human Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setFilters({ status: [], priority: [], channel: [], assignedTo: '' })}>
              Clear All
            </Button>
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Chat Modal */}
      <Dialog open={liveChatOpen} onOpenChange={setLiveChatOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5 text-green-500" />
              Live Chat with {selectedChatCustomer}
            </DialogTitle>
            <DialogDescription>Real-time customer support chat</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-800/50">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.from === 'agent' ? 'justify-end' : message.from === 'system' ? 'justify-center' : 'justify-start'}`}
                >
                  {message.from === 'system' ? (
                    <p className="text-xs text-slate-500 italic">{message.text}</p>
                  ) : (
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.from === 'agent' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-slate-700'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.time}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              />
              <Button variant="primary" onClick={handleSendChatMessage}>
                <SendIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleEndChat}>
              End Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Modal */}
      <Dialog open={bulkUpdateOpen} onOpenChange={setBulkUpdateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Update Tickets</DialogTitle>
            <DialogDescription>Apply changes to multiple tickets at once</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Ticket Selection */}
            <div>
              <Label className="mb-2 block">Select Tickets</Label>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
                {tickets.filter((t) => t.status !== 'Resolved').map((ticket) => (
                  <div key={ticket.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                    <Checkbox
                      id={`bulk-${ticket.id}`}
                      checked={bulkUpdate.selectedTickets.includes(ticket.id)}
                      onCheckedChange={() => toggleBulkTicket(ticket.id)}
                    />
                    <Label htmlFor={`bulk-${ticket.id}`} className="flex-1 font-normal cursor-pointer">
                      <span className="font-medium">{ticket.id}</span> - {ticket.subject}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {bulkUpdate.selectedTickets.length} ticket(s) selected
              </p>
            </div>

            {/* Update Options */}
            <div>
              <Label htmlFor="bulk-status">Update Status</Label>
              <Select value={bulkUpdate.status} onValueChange={(v) => setBulkUpdate({ ...bulkUpdate, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Keep current status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keep-current">Keep current status</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bulk-message">Send Message (Optional)</Label>
              <Textarea
                id="bulk-message"
                value={bulkUpdate.message}
                onChange={(e) => setBulkUpdate({ ...bulkUpdate, message: e.target.value })}
                placeholder="Message to send to all selected tickets..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setBulkUpdateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleBulkUpdate}>
              Apply to {bulkUpdate.selectedTickets.length} Tickets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Training Modal */}
      <Dialog open={aiTrainingOpen} onOpenChange={setAiTrainingOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BotIcon className="w-5 h-5" />
              Train AI Responses
            </DialogTitle>
            <DialogDescription>
              Add training examples to improve AI response quality
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Add New Example */}
            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <h4 className="font-medium mb-3">Add Training Example</h4>
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="trigger">Trigger Phrase</Label>
                  <Input
                    id="trigger"
                    value={newTrainingExample.trigger}
                    onChange={(e) => setNewTrainingExample({ ...newTrainingExample, trigger: e.target.value })}
                    placeholder="e.g., order not received, refund request"
                  />
                </div>
                <div>
                  <Label htmlFor="response">AI Response</Label>
                  <Textarea
                    id="response"
                    value={newTrainingExample.response}
                    onChange={(e) => setNewTrainingExample({ ...newTrainingExample, response: e.target.value })}
                    placeholder="The response AI should give..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTrainingExample.category}
                      onValueChange={(v) => setNewTrainingExample({ ...newTrainingExample, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Shipping">Shipping</SelectItem>
                        <SelectItem value="Refunds">Refunds</SelectItem>
                        <SelectItem value="Products">Products</SelectItem>
                        <SelectItem value="Orders">Orders</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="primary" onClick={handleAddTrainingExample}>
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Examples */}
            <div>
              <h4 className="font-medium mb-3">Existing Training Examples</h4>
              <div className="space-y-2">
                {trainingExamples.map((example) => (
                  <div key={example.id} className="p-3 border rounded-lg flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Chip variant="info" size="sm">{example.category}</Chip>
                        <span className="text-sm font-medium">{example.trigger}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{example.response}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTrainingExample(example.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAiTrainingOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveTraining}>
              <SaveIcon className="w-4 h-4 mr-1" />
              Save Training Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
