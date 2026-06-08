const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const betaUsersByMonth = [8, 14, 21, 27, 33, 29, 36, 41, 38, 47, 52, 58];

export const mockBetaUsers = [
  { id: 1, name: 'Elena Nowak', email: 'elena.nowak@betaproject.io', role: 'ADMIN', createdAt: '2024-02-10' },
  { id: 2, name: 'Marcin Kubiak', email: 'marcin.kubiak@betaproject.io', role: 'USER', createdAt: '2024-03-18' },
  { id: 3, name: 'Sofia Berg', email: 'sofia.berg@betaproject.io', role: 'USER', createdAt: '2024-04-05' },
  { id: 4, name: 'Lukas Meyer', email: 'lukas.meyer@betaproject.io', role: 'USER', createdAt: '2024-05-22' },
  { id: 5, name: 'Nina Costa', email: 'nina.costa@betaproject.io', role: 'USER', createdAt: '2024-06-14' },
  { id: 6, name: 'Oliver Shaw', email: 'oliver.shaw@betaproject.io', role: 'USER', createdAt: '2024-07-09' },
  { id: 7, name: 'Zofia Lis', email: 'zofia.lis@betaproject.io', role: 'USER', createdAt: '2024-08-27' },
  { id: 8, name: 'Felix Braun', email: 'felix.braun@betaproject.io', role: 'USER', createdAt: '2024-09-11' },
];

export const mockBetaChartData = MONTH_NAMES.map((month, index) => ({
  month,
  Users: betaUsersByMonth[index],
}));

export const mockBetaUserCount = mockBetaChartData.reduce(
  (sum, item) => sum + item.Users,
  0
);

export const mockBetaRevenue = 32400;

export const mockBetaContactMessages = [
  {
    id: 1,
    name: 'Alex Turner',
    email: 'alex.turner@betastudio.com',
    subject: 'Beta access request',
    message:
      'Our team would like early access to Project Beta features and sandbox environments for QA testing before the public rollout.',
    status: 'New',
    receivedAt: '2024-06-06T09:10:00',
  },
  {
    id: 2,
    name: 'Hannah Reed',
    email: 'hannah.reed@innovate.co',
    subject: 'Roadmap question',
    message:
      'Could you share the planned timeline for analytics and reporting modules in Project Beta? We are preparing our internal migration plan.',
    status: 'Replied',
    receivedAt: '2024-06-05T16:40:00',
  },
  {
    id: 3,
    name: 'Victor Hale',
    email: 'victor.hale@logistics.io',
    subject: 'Integration feedback',
    message:
      'The beta webhook payload format works well, but we need clearer documentation for retry semantics and error codes.',
    status: 'New',
    receivedAt: '2024-06-05T11:25:00',
  },
  {
    id: 4,
    name: 'Marta Zielinska',
    email: 'marta.zielinska@betaproject.io',
    subject: 'Staging environment issue',
    message:
      'We noticed intermittent 503 responses on the beta staging API between 2 AM and 4 AM UTC. Can you confirm if maintenance is scheduled?',
    status: 'Replied',
    receivedAt: '2024-06-04T13:55:00',
  },
  {
    id: 5,
    name: 'Jonas Park',
    email: 'jonas.park@retailhub.com',
    subject: 'User roles in beta',
    message:
      'Is role-based access control expected in the next beta release? We need separate permissions for support and operations teams.',
    status: 'New',
    receivedAt: '2024-06-03T10:05:00',
  },
];
