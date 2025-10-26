import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import UseAuth from "../../../Hooks/UseAuth";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const PaymentHistory = () => {
  const { user, loading: authLoading } = UseAuth() || {};
  const axiosSecure = UseAxiosSecure();

  // Fetch payments data from backend
  const queryResult = useQuery({
    queryKey: ["payments", user?.email || "guest"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      console.log("Backend Response:", res.data);
      return res.data; // backend returns { success, total, data: [] }
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5,
  });

  // Extract query results
  const { data: paymentsData = {}, isLoading, isError } = queryResult;
  const payments = paymentsData?.data || [];

  // Prepare chart data
  const chartData = useMemo(() => {
    const map = {};
    payments.forEach((p) => {
      if (!p.createdAt) return;
      const date = new Date(p.createdAt).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
      });
      const amount = p.amount ? p.amount / 100 : 0;
      map[date] = (map[date] || 0) + amount;
    });
    return Object.entries(map).map(([date, total]) => ({
      date,
      total: Number(total.toFixed(2)),
    }));
  }, [payments]);

  // Loading states
  if (authLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Loading user info...</p>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 font-medium">
          ⚠️ Failed to load payment history.
        </p>
      </div>
    );

  return (
    <section className="container px-4 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-x-3">
          <h2 className="text-xl font-semibold text-gray-800">
            💳 Payment History
          </h2>
          <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
            {payments.length} Payments
          </span>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="mb-10 bg-gradient-to-br from-indigo-50 to-purple-50 border border-gray-200 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Payment Trend (৳)
          </h3>
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }} labelStyle={{ color: "#4f46e5", fontWeight: 600 }} formatter={(val) => [`৳${val.toFixed(2)}`, "Total Paid"]} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  activeDot={{ r: 7, stroke: "#4f46e5", strokeWidth: 3, fill: "#fff" }}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mb-10">
          No payment data available to show trend.
        </div>
      )}

      {/* Table */}
      <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Payment ID</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Parcel ID</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Currency</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Country</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr key={payment._id || payment.paymentIntentId} className="hover:bg-indigo-50 transition-colors duration-150">
                        <td className="px-4 py-4 text-sm text-gray-700">{payment.paymentIntentId}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{payment.parcelId}</td>
                        <td className="px-4 py-4 text-sm text-gray-800 font-semibold">{(payment.amount / 100).toFixed(2)}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 uppercase">{payment.currency}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{payment.country}</td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === "succeeded" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {payment.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">{new Date(payment.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-sm text-center text-gray-500">
                        No payment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentHistory;
