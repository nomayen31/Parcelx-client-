import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "./UseAxiosSecure";
import UseAuth from "./UseAuth";

const useUserRole = () => {
  const { user, loading: authLoading } = UseAuth();
  const axiosSecure = UseAxiosSecure();

  // Fetch user role using email from user object
  const {
    data: role = "user",
    isLoading: roleLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !authLoading && !!user?.email, // only run when email exists
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/role?email=${user.email}`);
      return data.role || "user";
    },
    staleTime: 5 * 60 * 1000, // cache role for 5 minutes
  });

  return { role, roleLoading, isError, refetch };
};

export default useUserRole;
