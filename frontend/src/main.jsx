import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css';
import {
  Button,
  createTheme,
  MantineProvider,
  Modal,
  Select,
  Table,
  TextInput,
} from '@mantine/core';
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Users from './pages/Users/Users.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Login from './pages/Login/Login.jsx';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute.jsx';
import { ProjectProvider } from './context/ProjectContext.jsx';
import '@mantine/charts/styles.css';
import './index.scss';
const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    dark: [
      '#f5f5f5',
      '#d4d4d4',
      '#a8a8a8',
      '#7a7a7a',
      '#696969',
      '#575757',
      '#464646',
      '#343434',
      '#232323',
      '#111111',
    ],
  },
  components: {
    Modal: Modal.extend({
      defaultProps: {
        overlayProps: {
          backgroundOpacity: 0.65,
          blur: 4,
        },
      },
      styles: {
        content: {
          backgroundColor: '#343434',
          border: '1px solid #575757',
        },
        header: {
          backgroundColor: '#343434',
          borderBottom: '1px solid #575757',
        },
        title: {
          color: '#ffffff',
          fontWeight: 600,
        },
        close: {
          color: '#d4d4d4',
        },
      },
    }),
    TextInput: TextInput.extend({
      styles: {
        input: {
          backgroundColor: '#232323',
          borderColor: '#575757',
          color: '#ffffff',
        },
        label: {
          color: '#d4d4d4',
        },
      },
    }),
    Select: Select.extend({
      styles: {
        input: {
          backgroundColor: '#232323',
          borderColor: '#575757',
          color: '#ffffff',
        },
        label: {
          color: '#d4d4d4',
        },
        dropdown: {
          backgroundColor: '#343434',
          borderColor: '#575757',
        },
        option: {
          color: '#ffffff',
        },
      },
    }),
    Table: Table.extend({
      defaultProps: {
        highlightOnHoverColor: 'dark.6',
      },
    }),
    Button: Button.extend({
      styles: {
        root: {
          '&[data-variant="default"]': {
            backgroundColor: '#464646',
            color: '#ffffff',
            border: '1px solid #575757',
          },
        },
      },
    }),
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/contact",
    element: (
      <ProtectedRoute>
        <Contact />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark" forceColorScheme="dark">
      <ProjectProvider>
        <RouterProvider router={router} />
      </ProjectProvider>
    </MantineProvider>
  </StrictMode>,
)
