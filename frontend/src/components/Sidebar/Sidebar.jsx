import { useProject } from '../../context/ProjectContext.jsx';
import { useState } from 'react';
import {
  FaUsers,
  FaFileAlt,
  FaEnvelope,
} from 'react-icons/fa';
import { MdDashboard, MdOutlineLogout } from 'react-icons/md';
import { Select } from '@mantine/core';
import { Link, useLocation } from 'react-router';
import './Sidebar.scss';
import logo from '../../assets/logo.png';
import { logout } from '../../pages/Users/UsersActions.js';

const projects = [
  { value: 'alpha', label: 'Project Alpha' },
  { value: 'beta', label: 'Project Beta' },
];

const data = [
  { label: 'Dashboard', icon: MdDashboard },
  { label: 'Users', icon: FaUsers },
  { label: 'Contact', icon: FaEnvelope },
];

export function Sidebar() {
  const location = useLocation();
  const { selectedProject, setSelectedProject } = useProject();

  const links = data.map((item) => {
    const Icon = item.icon;
    const path = `/${item.label.toLowerCase()}`;

    return (
      <Link
        className="link"
        data-active={location.pathname === path || undefined}
        key={item.label}
        to={path}
      >
        <Icon className="linkIcon" />
        <span>{item.label}</span>
      </Link>
    );
  });

  return (
    <div className="navbar">
      <div className="navbarMain">
        <div className="header">
          <img src={logo} alt="logo" className="logo" />
          <h3 className="headerTitle">Admin Panel</h3>
        </div>

        <div className="projectSelect">
          <Select
            label="Project"
            placeholder="Select project"
            data={projects}
            value={selectedProject}
            onChange={setSelectedProject}
            allowDeselect={false}
          />
        </div>

        {links}
      </div>

      <div className="footer">
        <button type="button" className="link" onClick={logout}>
          <MdOutlineLogout className="linkIcon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}