import { useSelector } from "react-redux";

export const usePermission = () => {
  const userPermissions = useSelector((state) => state.auth.auth.permisos);
  const hasPermission = (permissionName) => {
    return userPermissions.some(
      (permission) => permission.name === permissionName
    );
  };

  return hasPermission;
};
