import { createContext, useContext } from "react";

const PermissionContext = createContext({ userPermissions: [], isSuperAdmin: false });

export function PermissionProvider({ children, value }) {
  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissions() {
  const ctx = useContext(PermissionContext);
  const can = (permKey) => {
    if (ctx.isSuperAdmin) return true;
    return ctx.userPermissions?.includes(permKey) ?? false;
  };
  return { ...ctx, can };
}
