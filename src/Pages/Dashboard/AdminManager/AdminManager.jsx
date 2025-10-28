import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const AdminManager = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔍 Fetch users only when a search is made
  const { data: users = [], isFetching, isError } = useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const { data } = await axiosSecure.get(`/users/search?query=${searchQuery}`);
      return data.data || [];
    },
    enabled: !!searchQuery,
  });

  // 🔁 Handle Role Change
  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const result = await Swal.fire({
      title: `Change Role`,
      text: `Are you sure you want to make this user '${newRole}'?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axiosSecure.patch(`/users/${id}/role`, { role: newRole });

        if (data.success) {
          Swal.fire("Success", data.message, "success");
          queryClient.invalidateQueries(["searchUsers", searchQuery]);
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        console.error("Error changing role:", error);
        Swal.fire("Error", "Server error while updating role.", "error");
      }
    }
  };

  // 🔎 Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm.trim());
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">👑 Admin Management</h2>

      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {isFetching && (
        <div className="text-center py-4">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}

      {isError && (
        <div className="text-center text-error font-semibold">
          Failed to fetch users.
        </div>
      )}

      {!isFetching && users.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200 text-sm font-semibold uppercase text-gray-700">
                <th>Name</th>
                <th>Email</th>
                <th>UID</th>
                <th>Role</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.email}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.uid || "—"}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin"
                          ? "badge-success"
                          : "badge-neutral"
                      } font-semibold`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleRoleChange(user._id, user.role)}
                      className={`btn btn-sm ${
                        user.role === "admin"
                          ? "btn-error"
                          : "btn-success"
                      } text-white`}
                    >
                      {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isFetching && users.length === 0 && searchQuery && (
        <p className="text-center text-gray-500 mt-4">
          No users found for "<strong>{searchQuery}</strong>".
        </p>
      )}

      {!searchQuery && (
        <p className="text-center text-gray-400 mt-6">
          Start by typing a user’s name or email to manage their role.
        </p>
      )}
    </div>
  );
};

export default AdminManager;
