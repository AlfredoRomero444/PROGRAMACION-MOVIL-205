import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavBarVisibilityContextType {
  // true mientras la barra de navegación fija debe estar oculta
  // (por ejemplo, mientras una pantalla muestra su logo de "cargando").
  navBarHidden: boolean;
  setNavBarHidden: (hidden: boolean) => void;
}

const NavBarVisibilityContext = createContext<NavBarVisibilityContextType>({
  navBarHidden: false,
  setNavBarHidden: () => {},
});

export function NavBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [navBarHidden, setNavBarHiddenState] = useState(false);

  const setNavBarHidden = useCallback((hidden: boolean) => {
    setNavBarHiddenState(hidden);
  }, []);

  return (
    <NavBarVisibilityContext.Provider value={{ navBarHidden, setNavBarHidden }}>
      {children}
    </NavBarVisibilityContext.Provider>
  );
}

export function useNavBarVisibility() {
  return useContext(NavBarVisibilityContext);
}
