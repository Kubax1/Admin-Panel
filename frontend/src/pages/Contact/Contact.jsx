import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '../../components/Sidebar/Sidebar.jsx';
import { useProject } from '../../context/ProjectContext.jsx';
import { mockBetaContactMessages } from '../../data/projectMockData.js';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import dayjs from 'dayjs';
import { FiCornerUpLeft, FiFilter, FiSearch } from 'react-icons/fi';
import './Contact.scss';

const initialMessages = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    subject: 'Partnership inquiry',
    message:
      'Hello, I am reaching out regarding a potential partnership opportunity between our companies. We believe there is strong synergy in our product offerings and would love to schedule a call to discuss further details and next steps.',
    status: 'New',
    receivedAt: '2024-06-06T10:30:00',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'm.chen@techcorp.io',
    subject: 'Bug report - Dashboard',
    message:
      'I noticed an issue with the dashboard loading times when switching between projects. The spinner appears for more than 5 seconds on slower connections. Could you look into optimizing the initial data fetch?',
    status: 'Replied',
    receivedAt: '2024-06-05T14:22:00',
  },
  {
    id: 3,
    name: 'Emma Williams',
    email: 'emma.w@startup.co',
    subject: 'Feature request',
    message:
      'Would it be possible to add export functionality for the analytics reports? Our team needs to share monthly summaries with stakeholders in PDF or CSV format. Happy to provide more details on our use case.',
    status: 'New',
    receivedAt: '2024-06-05T09:15:00',
  },
  {
    id: 4,
    name: 'James Rodriguez',
    email: 'j.rodriguez@mail.com',
    subject: 'Account upgrade question',
    message:
      'I am currently on the Pro plan and would like to understand the differences between Pro and Enterprise tiers. Specifically interested in SSO integration and dedicated support options for our growing team.',
    status: 'Replied',
    receivedAt: '2024-06-04T16:45:00',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.a@design.studio',
    subject: 'Billing discrepancy',
    message:
      'I was charged twice for the same billing period on my last invoice. Could you please review my account and issue a refund for the duplicate charge? I have attached the invoice numbers for reference.',
    status: 'New',
    receivedAt: '2024-06-04T11:30:00',
  },
  {
    id: 6,
    name: 'David Kim',
    email: 'david.kim@enterprise.com',
    subject: 'API integration support',
    message:
      'Our engineering team is integrating your API and we need documentation for the webhook events related to user activity. Is there a sandbox environment available for testing before we go to production?',
    status: 'Replied',
    receivedAt: '2024-06-03T13:20:00',
  },
  {
    id: 7,
    name: 'Rachel Green',
    email: 'rachel.g@agency.net',
    subject: 'Demo request',
    message:
      'We are evaluating admin panel solutions for our client portfolio and would like to schedule a live demo. We have a team of 15 people who would benefit from seeing the dashboard and user management features.',
    status: 'New',
    receivedAt: '2024-06-03T08:00:00',
  },
  {
    id: 8,
    name: 'Tom Bradley',
    email: 'tom.b@freelance.dev',
    subject: 'Password reset issue',
    message:
      'I have tried resetting my password multiple times but never receive the confirmation email. Could you check if my account email is verified and help me regain access to the panel?',
    status: 'Replied',
    receivedAt: '2024-06-02T17:10:00',
  },
  {
    id: 9,
    name: 'Nina Patel',
    email: 'nina.patel@consulting.io',
    subject: 'Custom branding options',
    message:
      'Does the platform support white-label branding for agencies? We need to customize logos, colors, and domain for each client workspace within a single admin account.',
    status: 'New',
    receivedAt: '2024-06-02T10:45:00',
  },
  {
    id: 10,
    name: 'Chris Evans',
    email: 'chris.evans@retail.com',
    subject: 'Data export request',
    message:
      'We need to export all user contact data collected over the last quarter for our compliance audit. Please advise on the best way to retrieve this information in a structured format.',
    status: 'Replied',
    receivedAt: '2024-06-01T15:30:00',
  },
  {
    id: 11,
    name: 'Diana Prince',
    email: 'diana.prince@justice.league',
    subject: 'Feature request',
    message:
      'Would it be possible to add a new feature to the dashboard that allows users to export data in a structured format? We need to share monthly summaries with stakeholders in PDF or CSV format. Happy to provide more details on our use case.',
    status: 'Replied',
    receivedAt: '2024-06-01T15:30:00',
  },
];

const statusColor = {
  New: 'blue',
  Replied: 'green',
};

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const Contact = () => {
  const { isMockProject } = useProject();
  const [messages, setMessages] = useState(initialMessages);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    setMessages(
      isMockProject
        ? mockBetaContactMessages.map((message) => ({ ...message }))
        : initialMessages.map((message) => ({ ...message }))
    );
    setSearch('');
    setStatusFilter('All Status');
    setPage(1);
    setSelectedMessage(null);
    setReplyText('');
  }, [isMockProject]);

  const closeReplyModal = () => {
    setSelectedMessage(null);
    setReplyText('');
  };

  const openReplyModal = (message) => {
    setSelectedMessage(message);
    setReplyText(message.reply || '');
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    setMessages((prev) =>
      prev.map((message) =>
        message.id === selectedMessage.id
          ? { ...message, status: 'Replied', reply: replyText.trim() }
          : message
      )
    );

    closeReplyModal();
  };

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !query ||
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'All Status' || message.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + pageSize);
  const rangeStart = filteredMessages.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + pageSize, filteredMessages.length);

  const rows = paginatedMessages.map((message) => (
    <Table.Tr key={message.id}>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <Avatar size="sm" radius="xl" color="blue" className="contact-avatar">
            {getInitials(message.name)}
          </Avatar>
          <div>
            <Text fw={600} size="xs">
              {message.name}
            </Text>
            <Text size="xs" c="dimmed">
              {message.email}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="xs">{message.subject}</Text>
      </Table.Td>
      <Table.Td className="contact-message-cell">
        <Text size="sm" c="dimmed" lineClamp={1}>
          {message.message}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge color={statusColor[message.status]} variant="light" radius="xl">
          {message.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{dayjs(message.receivedAt).format('MMM D, YYYY')}</Text>
        <Text size="xs" c="dimmed">
          {dayjs(message.receivedAt).format('h:mm A')}
        </Text>
      </Table.Td>
      <Table.Td>
        <Button
          variant="default"
          size="xs"
          leftSection={<FiCornerUpLeft size={14} />}
          className="contact-reply-btn"
          onClick={() => openReplyModal(message)}
        >
          Reply
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="contact-page">
      <Sidebar />
      <div className="contact-main">
        <div className="contact-header">
          <div>
            <h1>Contact</h1>
            <Text c="dimmed" size="sm">
              View and manage all contact messages from your users.
            </Text>
          </div>
        </div>

        <Modal
          opened={selectedMessage !== null}
          onClose={closeReplyModal}
          title={selectedMessage?.subject}
          size="lg"
          className="contact-reply-modal"
        >
          {selectedMessage && (
            <Stack gap="md">
              <Group gap="sm" wrap="nowrap">
                <Avatar radius="xl" color="blue" className="contact-avatar">
                  {getInitials(selectedMessage.name)}
                </Avatar>
                <div>
                  <Text fw={600}>{selectedMessage.name}</Text>
                  <Text size="sm" c="dimmed">
                    {selectedMessage.email}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {dayjs(selectedMessage.receivedAt).format('MMM D, YYYY h:mm A')}
                  </Text>
                </div>
                <Badge
                  color={statusColor[selectedMessage.status]}
                  variant="light"
                  radius="xl"
                  ml="auto"
                >
                  {selectedMessage.status}
                </Badge>
              </Group>

              <div className="contact-original-message">
                <Text size="sm" className="contact-original-message__text">
                  {selectedMessage.message}
                </Text>
              </div>

              {selectedMessage.reply && (
                <>
                  <Divider label="Previous reply" labelPosition="left" />
                  <div className="contact-previous-reply">
                    <Text size="sm">{selectedMessage.reply}</Text>
                  </div>
                </>
              )}

              <Textarea
                label="Your reply"
                placeholder="Write your response..."
                minRows={5}
                value={replyText}
                onChange={(event) => setReplyText(event.currentTarget.value)}
              />

              <Group justify="flex-end">
                <Button variant="default" onClick={closeReplyModal}>
                  Cancel
                </Button>
                <Button
                  leftSection={<FiCornerUpLeft size={16} />}
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                >
                  Send reply
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>

        <Group className="contact-toolbar" wrap="nowrap">
          <TextInput
            className="contact-search"
            placeholder="Search messages by name, email or subject..."
            leftSection={<FiSearch size={16} />}
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              setPage(1);
            }}
          />
          <Button variant="default" leftSection={<FiFilter size={16} />}>
            Filters
          </Button>
          <Select
            className="contact-status-filter"
            data={['All Status', 'New', 'Replied']}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            allowDeselect={false}
          />
        </Group>

        <div className="contact-table-wrapper">
          <Table.ScrollContainer minWidth={1000}>
            <Table
              highlightOnHover
              horizontalSpacing="lg"
              verticalSpacing="md"
              className="contact-table"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>From</Table.Th>
                  <Table.Th>Subject</Table.Th>
                  <Table.Th>Message</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Received At</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </div>

        <Group justify="space-between" align="center" className="contact-footer">
          <Text size="xs" c="dimmed">
            Showing {rangeStart} to {rangeEnd} of {filteredMessages.length} messages
          </Text>

          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setPage}
            size="sm"
          />

          
        </Group>
      </div>
    </div>
  );
};

export default Contact;
