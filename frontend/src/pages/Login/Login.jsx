import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, Button, Card, Stack, Text, TextInput, Title } from '@mantine/core';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FiLock, FiMail } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import { login } from '../Users/UsersActions.js';
import './Login.scss';

const initialValues = {
  email: '',
  password: '',
};

const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');

    const result = await login(values.email.trim(), values.password);

    if (result?.token) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid email or password');
    }

    setSubmitting(false);
  };

  return (
    <div className="login">
      <Card shadow="md" padding="xl" radius="md" withBorder className="login-card">
        <Stack gap="lg">
          <div className="login-header">
            <img src={logo} alt="logo" className="login-logo" />
            <Title order={2}>Admin Panel</Title>
            <Text c="dimmed" size="sm">
              Sign in to manage your dashboard 09.02
            </Text>
          </div>

          {error && (
            <Alert color="red" variant="light">
              {error}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <TextInput
                  label="Email"
                  name="email"
                  mb="md"
                  leftSection={<FiMail size={16} />}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                />
                <TextInput
                  label="Password"
                  name="password"
                  type="password"
                  mb="lg"
                  leftSection={<FiLock size={16} />}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                />
                <Button type="submit" fullWidth loading={isSubmitting}>
                  Sign in
                </Button>
              </Form>
            )}
          </Formik>
        </Stack>
      </Card>
    </div>
  );
};

export default Login;
