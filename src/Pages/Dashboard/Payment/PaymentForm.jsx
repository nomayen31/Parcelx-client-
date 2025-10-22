import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getNames, getCode } from "country-list";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import { FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = UseAxiosSecure();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = UseAuth();

  // --- Form states ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [postalCode, setPostalCode] = useState("");
  const [countries, setCountries] = useState([]);

  // --- UI states ---
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  // --- Fetch parcel data ---
  const { data: parcelData, isLoading, error } = useQuery({
    queryKey: ["parcel", id],
    enabled: Boolean(id),
    queryFn: async () => (await axiosSecure.get(`/parcels/${id}`)).data,
  });

  const amountBDT = parcelData?.data?.deliveryCost ?? 0;

  // Pre-fill dropdown + email from auth
  useEffect(() => setCountries(getNames()), []);
  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.displayName) setName((prev) => prev || user.displayName);
  }, [user?.email, user?.displayName]);

  // --- Handle Payment ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!amountBDT || Number(amountBDT) <= 0) {
      setErrorMsg("No amount due for this parcel.");
      toast.error("No amount due for this parcel.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMsg("Payment form is not ready. Please try again.");
      toast.error("Payment form is not ready. Please try again.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccess(false);

    try {
      const amountInSmallestUnit = Math.round(Number(amountBDT) * 100);

      // 1) Create PaymentIntent on backend (attach parcelId + payerEmail in metadata)
      const intentRes = await axiosSecure.post("/create-payment-intent", {
        amountInCents: amountInSmallestUnit,
        parcelId: id,
        payerEmail: email,
      });

      const clientSecret = intentRes?.data?.clientSecret;
      if (!clientSecret) throw new Error("Missing client secret from server.");

      // 2) Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name,
              email,
              address: {
                country: getCode(country) || "BD",
                postal_code: postalCode || undefined,
              },
            },
          },
        }
      );

      if (stripeError) throw stripeError;

      // 3) Finalize on server (records payment + marks parcel Paid)
      if (paymentIntent?.status === "succeeded") {
        await axiosSecure.post("/payments/confirm", {
          parcelId: id,
          paymentIntentId: paymentIntent.id,
          amountInCents: amountInSmallestUnit,
          currency: "usd", // switch consistently if you use BDT on server
          payer: {
            name,
            email,
            country: getCode(country) || "BD",
            postal_code: postalCode || undefined,
          },
        });

        setSuccess(true);

        // Refresh React Query caches so lists reflect "Paid"
        queryClient.invalidateQueries({ queryKey: ["parcels"] });
        queryClient.invalidateQueries({ queryKey: ["parcel", id] });

        // SweetAlert success with Transaction ID + Go to My Parcels
        const result = await Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          html: `
            <div style="text-align:left">
              <p><strong>Transaction ID:</strong></p>
              <p><code style="user-select:all">${paymentIntent.id}</code></p>
              <p style="margin-top:8px"><strong>Amount:</strong> ৳${amountBDT}</p>
            </div>
          `,
          confirmButtonText: "Go to My Parcels",
          confirmButtonColor: "#16a34a",
          showCancelButton: true,
          cancelButtonText: "Close",
        });

        if (result.isConfirmed) {
          navigate("/dashboard/myParcels");
        }
      } else if (paymentIntent?.status === "processing") {
        const msg = "Your payment is processing. Please wait.";
        setErrorMsg(msg);
        toast.info(msg);
      } else {
        const msg = "Payment did not complete. Please try again.";
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err) {
      // Bubble up more helpful server messages (404/400)
      const msg = err?.response?.data?.message || err.message || "Payment failed. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Loading & Error States ---
  if (isLoading)
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-gray-600">Loading parcel...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-red-600">Failed to load parcel.</p>
      </div>
    );

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-10">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Secure Payment</h2>
        <p className="text-sm text-gray-600 mb-8">
          You’re paying for parcel{" "}
          <span className="font-semibold">{id}</span>. Amount:{" "}
          <span className="font-semibold">৳{amountBDT}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Name --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* --- Email --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* --- Billing Address --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Billing Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  placeholder="e.g., 1260"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* --- Card Details --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#34495e",
                      fontFamily:
                        "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#e74c3c", iconColor: "#e74c3c" },
                    complete: { color: "#27ae60" },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>

          {/* --- Messages --- */}
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              <strong>Success!</strong> Payment completed.
            </div>
          )}

          {/* --- Submit --- */}
          <button
            type="submit"
            disabled={!stripe || submitting}
            className={`w-full py-3 text-lg font-bold rounded-xl shadow-md transition duration-300 ${
              submitting
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {submitting ? "Processing..." : `Pay Now (৳${amountBDT})`}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            <FaLock className="inline-block mr-1" /> Powered by Stripe. Your payment is secure.
          </p>
        </form>
      </div>

      {/* --- Toast Container --- */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default PaymentForm;
