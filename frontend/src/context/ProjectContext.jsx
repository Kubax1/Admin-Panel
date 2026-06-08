import { createContext, useContext, useState } from 'react';

const PROJECT_STORAGE_KEY = 'selectedProject';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [selectedProject, setSelectedProjectState] = useState(
    () => localStorage.getItem(PROJECT_STORAGE_KEY) || 'alpha'
  );

  const setSelectedProject = (value) => {
    if (!value) return;
    setSelectedProjectState(value);
    localStorage.setItem(PROJECT_STORAGE_KEY, value);
  };

  const isMockProject = selectedProject === 'beta';

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject, isMockProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }

  return context;
}
