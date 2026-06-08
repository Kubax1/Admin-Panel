import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar/Sidebar.jsx';
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Pagination,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FiEdit2, FiFilter, FiSearch, FiTrash2, FiUserPlus } from 'react-icons/fi';
import './Users.scss';
import { useProject } from '../../context/ProjectContext.jsx';
import { mockBetaUsers } from '../../data/projectMockData.js';
import { addUser, deleteUser, getUsers, updateUser } from './UsersActions.js';

const emptyFormValues = {
  name: '',
  email: '',
  password: '',
  role: 'USER',
};

const getUserValidationSchema = (mode) =>
  Yup.object({
    name: Yup.string().trim().min(2, 'Name is required').required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password:
      mode === 'add'
        ? Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
        : Yup.string(),
    role: Yup.string().oneOf(['USER', 'ADMIN'], 'Role is required').required('Role is required'),
  });

const Users = () => {
  const { isMockProject } = useProject();
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState(emptyFormValues);
  const [search, setSearch] = useState('');
  const [dateSort, setDateSort] = useState('none');
  const [page, setPage] = useState(1);

  const loadUsers = async () => {
    if (isMockProject) {
      setUserList(mockBetaUsers.map((user) => ({ ...user })));
      return;
    }

    const data = await getUsers();
    setUserList(data ?? []);
  };

  useEffect(() => {
    loadUsers();
    setPage(1);
    setSearch('');
    setDateSort('none');
    setFormInitialValues(emptyFormValues);
    setModalMode(null);
    setEditingUserId(null);
  }, [isMockProject]);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    const filtered = userList.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        String(user.id).includes(query);

      return matchesSearch;
    });

    if (dateSort === 'none') {
      setFilteredUsers(filtered);
      return;
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = dayjs(a.createdAt ?? a.create_date).valueOf();
      const dateB = dayjs(b.createdAt ?? b.create_date).valueOf();
      return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredUsers(sorted);
  }, [userList, search, dateSort]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
  const rangeStart = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + pageSize, filteredUsers.length);

  const closeModal = () => {
    setFormInitialValues(emptyFormValues);
    setModalMode(null);
    setEditingUserId(null);
  };

  const openAddModal = () => {
    setFormInitialValues(emptyFormValues);
    setEditingUserId(null);
    setModalMode('add');
  };

  const handleEdit = (user) => {
    setFormInitialValues({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditingUserId(user.id);
    setModalMode('edit');
  };

  const handleDelete = async (id) => {
    if (isMockProject) {
      setUserList((prev) => prev.filter((user) => user.id !== id));
      return;
    }

    const result = await deleteUser(id);
    if (result !== undefined) {
      await loadUsers();
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const userData = {
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role,
    };

    if (isMockProject) {
      if (modalMode === 'add') {
        const nextId = userList.length
          ? Math.max(...userList.map((user) => user.id)) + 1
          : 1;

        setUserList((prev) => [
          ...prev,
          {
            id: nextId,
            ...userData,
            createdAt: dayjs().format('YYYY-MM-DD'),
          },
        ]);
      }

      if (modalMode === 'edit') {
        setUserList((prev) =>
          prev.map((user) =>
            user.id === editingUserId ? { ...user, ...userData } : user
          )
        );
      }

      closeModal();
      setSubmitting(false);
      return;
    }

    let result;

    if (modalMode === 'add') {
      result = await addUser({
        ...userData,
        password: values.password,
      });
    }

    if (modalMode === 'edit') {
      result = await updateUser(editingUserId, userData);
    }

    if (result !== undefined) {
      await loadUsers();
      closeModal();
    }

    setSubmitting(false);
  };

  const rows = paginatedUsers.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Text size="xs">{user.id}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs" fw={500}>{user.name}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">{user.email}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs">{user.role}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs">{dayjs(user.createdAt ?? user.create_date).format('DD.MM.YYYY')}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={4} wrap="nowrap" className="users-actions">
          <Tooltip label="Edit">
            <ActionIcon
              size="sm"
              variant="light"
              color="blue"
              aria-label="Edit user"
              onClick={() => handleEdit(user)}
            >
              <FiEdit2 size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              size="sm"
              variant="light"
              color="red"
              aria-label="Delete user"
              onClick={() => handleDelete(user.id)}
            >
              <FiTrash2 size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="users">
      <Sidebar />
      <div className="usersMain">
        <Group justify="space-between" align="center" className="users-header">
          <div>
            <h1>Users</h1>
            <Text c="dimmed" size="sm">
              View and manage all registered users.
            </Text>
          </div>
          <Button
            leftSection={<FiUserPlus size={16} />}
            onClick={openAddModal}
          >
            Add user
          </Button>
        </Group>

        <Group className="users-toolbar" wrap="nowrap">
          <TextInput
            className="users-search"
            placeholder="Search users by name, email or role..."
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
            className="users-date-filter"
            data={[
              { value: 'none', label: 'No filter' },
              { value: 'desc', label: 'Created date (newest)' },
              { value: 'asc', label: 'Created date (oldest)' },
            ]}
            value={dateSort}
            onChange={(value) => {
              setDateSort(value);
              setPage(1);
            }}
            allowDeselect={false}
          />
        </Group>

        <Modal
          opened={modalMode !== null}
          onClose={closeModal}
          title={modalMode === 'edit' ? 'Edit user' : 'Add user'}
        >
          <Formik
            initialValues={formInitialValues}
            validationSchema={getUserValidationSchema(modalMode)}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form>
                <TextInput
                  label="Name"
                  name="name"
                  mb="md"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                />
                <TextInput
                  label="Email"
                  name="email"
                  mb="md"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                />
                {modalMode === 'add' && (
                  <TextInput
                    label="Password"
                    name="password"
                    type="password"
                    mb="md"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && errors.password}
                  />
                )}
                <Select
                  label="Role"
                  data={['USER', 'ADMIN']}
                  mb="lg"
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  onBlur={() => handleBlur({ target: { name: 'role' } })}
                  error={touched.role && errors.role}
                />
                <Group justify="flex-end">
                  <Button variant="default" type="button" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {modalMode === 'edit' ? 'Save changes' : 'Add user'}
                  </Button>
                </Group>
              </Form>
            )}
          </Formik>
        </Modal>

        <div className="users-table-wrapper">
          <Table.ScrollContainer minWidth={700}>
            <Table
              highlightOnHover
              horizontalSpacing="sm"
              verticalSpacing="xs"
              className="users-table"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Create date</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </div>

        <Group justify="space-between" align="center" className="users-footer">
          <Text size="xs" c="dimmed">
            Showing {rangeStart} to {rangeEnd} of {filteredUsers.length} users
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

export default Users;
