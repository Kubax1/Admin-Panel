import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar/Sidebar.jsx';
import './Dashboard.scss';
import { BarChart } from '@mantine/charts';
import { Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { FiDollarSign, FiUsers } from 'react-icons/fi';
import { useProject } from '../../context/ProjectContext.jsx';
import {
  mockBetaChartData,
  mockBetaRevenue,
  mockBetaUserCount,
} from '../../data/projectMockData.js';
import { countUsers, countUsersByMonth } from '../Users/UsersActions.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const emptyChartData = MONTH_NAMES.map((month) => ({ month, Users: 0 }));

const mapUsersByMonth = (apiData) => {
  const countsByMonth = Object.fromEntries(
    (apiData ?? []).map(([month, total]) => [Number(month), Number(total)])
  );

  return MONTH_NAMES.map((month, index) => ({
    month,
    Users: countsByMonth[index + 1] ?? 0,
  }));
};

const Dashboard = () => {
  const { isMockProject } = useProject();
  const [userCount, setUserCount] = useState(0);
  const [chartData, setChartData] = useState(emptyChartData);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    if (isMockProject) {
      setUserCount(mockBetaUserCount);
      setChartData(mockBetaChartData);
      setRevenue(mockBetaRevenue);
      return;
    }

    countUsers().then((count) => setUserCount(count ?? 0));
    countUsersByMonth().then((data) => setChartData(mapUsersByMonth(data)));
    setRevenue(50000);
  }, [isMockProject]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <div className="stats-row">
          <Card shadow="md" padding="xl" radius="md" withBorder className="stat-card">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <ThemeIcon size={64} radius="md" variant="light" color="blue">
                <FiUsers size={32} />
              </ThemeIcon>

              <Stack gap={6} align="flex-end">
                <Text size="sm" c="dimmed" fw={600}>
                  TOTAL USERS
                </Text>
                <Text className="value">{userCount.toLocaleString()}</Text>
              </Stack>
            </Group>
          </Card>

          <Card shadow="md" padding="xl" radius="md" withBorder className="stat-card stat-card--revenue">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <ThemeIcon size={64} radius="md" variant="light" color="green">
                <FiDollarSign size={32} />
              </ThemeIcon>
              <Stack gap={6} align="flex-end">
                <Text size="sm" c="dimmed" fw={600}>
                  TOTAL REVENUE
                </Text>
                <Text className="value">
                 {revenue.toLocaleString()} PLN
                </Text>
              </Stack>
            </Group>
          </Card>
        </div>

        <div className="content">
          <div className="chart">
            <BarChart
              h={450}
              data={chartData}
              dataKey="month"
              series={[{ name: 'Users', color: 'blue.6' }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
