import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

// The primary brand color for a professional look
const PRIMARY_COLOR = "#004085"; // A deep, professional blue
const ACCENT_COLOR = "#28a745"; // A subtle green for total/success
const BORDER_COLOR = "#e9ecef";
const TEXT_COLOR = "#343a40";

const InvoicePDF = forwardRef(({ user, logoUrl }, ref) => {
  const invoiceRef = useRef();
  const [activeParcel, setActiveParcel] = useState(null);

  // Allow parent to trigger .download(parcel)
  useImperativeHandle(ref, () => ({
    async download(parcel) {
      console.log("📦 [InvoicePDF] download() called with:", parcel);
      if (!parcel) {
        console.log("❌ [InvoicePDF] No parcel data passed");
        return;
      }
      setActiveParcel(parcel); // update invoice data
      // Add a slight delay to ensure React has finished rendering the new data
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (!invoiceRef.current) {
        console.log("❌ [InvoicePDF] invoiceRef not mounted");
        return;
      }
      await handleDownloadPDF(parcel);
    },
  }));

  // Generate PDF inside an iframe (isolates Tailwind/oklch issues)
  const handleDownloadPDF = async (parcel) => {
    try {
      console.log("🧾 [InvoicePDF] Generating PDF for:", parcel.trackingId);

      // Create isolated iframe
      const iframe = document.createElement("iframe");
      document.body.appendChild(iframe);
      // Hide the iframe completely off-screen
      iframe.style.position = "absolute";
      iframe.style.top = "-9999px";
      iframe.style.left = "-9999px";
      iframe.style.width = "800px"; // Arbitrary large width for canvas rendering
      iframe.style.height = "1000px";

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      // Write the content, including the cloned invoice element
      iframeDoc.write("<!DOCTYPE html><html><head></head><body></body></html>");
      iframeDoc.body.appendChild(invoiceRef.current.cloneNode(true));
      iframeDoc.close();

      const element = iframeDoc.body.children[0];
      const canvas = await html2canvas(element, {
        scale: 2, // High-quality rendering
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`Invoice_${parcel.trackingId || "Parcel"}.pdf`);

      document.body.removeChild(iframe);
      console.log("✅ [InvoicePDF] PDF saved successfully");
    } catch (error) {
      console.error("❌ [InvoicePDF] Error generating invoice:", error);
    }
  };

  useEffect(() => {
    if (activeParcel) {
      console.log("🔁 [InvoicePDF] Active parcel updated:", activeParcel.trackingId);
    }
  }, [activeParcel]);

  if (!activeParcel) return null;

  // Helper function for currency formatting (assuming Bangladeshi Taka ৳)
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  return (
    <div
      ref={invoiceRef}
      style={{
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
        width: "750px", // Slightly wider for a professional document feel
        backgroundColor: "#ffffff",
        color: TEXT_COLOR,
        border: "1px solid " + BORDER_COLOR,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)", // More subtle shadow
        padding: "40px",
        fontFamily: "Helvetica, Arial, sans-serif", // Professional font stack
        fontSize: "14px", // Slightly larger base font
        lineHeight: "1.5",
      }}
    >
      {/* --- Header --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "3px solid " + PRIMARY_COLOR, // Stronger border for header
          paddingBottom: "15px",
          marginBottom: "25px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Team ParcelX Logo"
              style={{ height: "70px", width: "auto" }}
            />
          )}
          <div>
            <h1
              style={{
                margin: "0",
                color: PRIMARY_COLOR,
                fontSize: "26px",
                fontWeight: "700",
              }}
            >
              ParcelX
            </h1>
            <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#6c757d" }}>
              Suite-A, B-5 (5th Floor), Navana Rahim Ardent,
              <br />
              185, Shahid Syed Nazrul Islam Sharani, Dhaka
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right", color: TEXT_COLOR }}>
          <h2
            style={{
              margin: "0 0 10px 0",
              color: PRIMARY_COLOR,
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            TAX INVOICE
          </h2>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>
            <strong style={{ minWidth: "80px", display: "inline-block" }}>
              Invoice ID:
            </strong>{" "}
            <span style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
              #{activeParcel._id?.slice(-6).toUpperCase() || "INV001"}
            </span>
          </p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>
            <strong style={{ minWidth: "80px", display: "inline-block" }}>
              Date:
            </strong>{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* --- Sender & Receiver Details --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
          gap: "30px",
        }}
      >
        {/* Sender */}
        <div style={{ width: "50%" }}>
          <h4
            style={{
              margin: "0 0 8px 0",
              fontSize: "15px",
              color: TEXT_COLOR,
              backgroundColor: BORDER_COLOR,
              padding: "5px 10px",
              borderRadius: "4px",
            }}
          >
            Sender Details (Billed To)
          </h4>
          <div style={{ paddingLeft: "10px" }}>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: PRIMARY_COLOR }}>Name:</strong>{" "}
              {activeParcel.senderName || "N/A"}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: PRIMARY_COLOR }}>Contact:</strong>{" "}
              {activeParcel.senderContact || "N/A"}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: PRIMARY_COLOR }}>Address:</strong>{" "}
              {activeParcel.senderAddress || "N/A"}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: PRIMARY_COLOR }}>District:</strong>{" "}
              {activeParcel.senderDistrict || "N/A"}
            </p>
          </div>
        </div>

        {/* Receiver */}
        <div style={{ width: "50%" }}>
          <h4
            style={{
              margin: "0 0 8px 0",
              fontSize: "15px",
              color: TEXT_COLOR,
              backgroundColor: BORDER_COLOR,
              padding: "5px 10px",
              borderRadius: "4px",
            }}
          >
            Receiver Details (Ship To)
          </h4>
          <div style={{ paddingLeft: "10px" }}>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: PRIMARY_COLOR }}>Name:</strong>{" "}
              {activeParcel.receiverName || "N/A"}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: PRIMARY_COLOR }}>Contact:</strong>{" "}
              {activeParcel.receiverContact || "N/A"}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: PRIMARY_COLOR }}>Address:</strong>{" "}
              {activeParcel.receiverAddress || "N/A"}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: PRIMARY_COLOR }}>District:</strong>{" "}
              {activeParcel.receiverDistrict || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* --- Parcel Info Table --- */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: PRIMARY_COLOR,
              color: "#ffffff",
              fontWeight: "600",
            }}
          >
            <th
              style={{
                border: "1px solid " + PRIMARY_COLOR,
                padding: "10px",
                textAlign: "left",
                borderTopLeftRadius: "5px",
              }}
            >
              Description
            </th>
            <th
              style={{
                border: "1px solid " + PRIMARY_COLOR,
                padding: "10px",
                textAlign: "center",
              }}
            >
              Tracking ID
            </th>
            <th
              style={{
                border: "1px solid " + PRIMARY_COLOR,
                padding: "10px",
                textAlign: "center",
              }}
            >
              Qty
            </th>
            <th
              style={{
                border: "1px solid " + PRIMARY_COLOR,
                padding: "10px",
                textAlign: "right",
                borderTopRightRadius: "5px",
              }}
            >
              Amount (৳)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                border: "1px solid " + BORDER_COLOR,
                padding: "10px",
                textAlign: "left",
              }}
            >
              {activeParcel.title || "Standard Parcel Delivery Service"}
              <div style={{ fontSize: "11px", color: "#6c757d", marginTop: "3px" }}>
                Parcel weight and dimensions as per manifest.
              </div>
            </td>
            <td
              style={{
                border: "1px solid " + BORDER_COLOR,
                padding: "10px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {activeParcel.trackingId}
            </td>
            <td
              style={{
                border: "1px solid " + BORDER_COLOR,
                padding: "10px",
                textAlign: "center",
              }}
            >
              1
            </td>
            <td
              style={{
                border: "1px solid " + BORDER_COLOR,
                padding: "10px",
                textAlign: "right",
              }}
            >
              {formatCurrency(activeParcel.deliveryCost)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* --- Cost Summary --- */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "40%", minWidth: "250px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid " + BORDER_COLOR,
              fontSize: "14px",
            }}
          >
            <strong>Subtotal:</strong>
            <span>৳ {formatCurrency(activeParcel.deliveryCost)}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid " + BORDER_COLOR,
              fontSize: "14px",
            }}
          >
            <strong>VAT/Tax:</strong>
            <span>৳ 0.00</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              marginTop: "10px",
              backgroundColor: ACCENT_COLOR, // Highlight total
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            <strong>Total Paid:</strong>
            <span>৳ {formatCurrency(activeParcel.deliveryCost)}</span>
          </div>
        </div>
      </div>

      {/* --- Footer with QR Code and Notes --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "2px solid " + PRIMARY_COLOR,
        }}
      >
        <div style={{ fontSize: "12px", color: "#6c757d" }}>
          <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: TEXT_COLOR }}>
            Payment Status: PAID
          </p>
          <p style={{ margin: 0 }}>
            Thank you for choosing **Team ParcelX**. Your support is highly appreciated.
          </p>
          <p style={{ margin: "5px 0 0 0" }}>
            **Visit:** www.teamparcelx.com | **Email:** info@teamparcelx.com
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <QRCodeCanvas
            value={`https://teamparcelx.com/track/${activeParcel.trackingId || ""}`}
            size={80} // Slightly larger QR code
            bgColor="#ffffff"
            fgColor={PRIMARY_COLOR} // Use brand color for QR
          />
          <p
            style={{
              fontSize: "11px",
              margin: "5px 0 0 0",
              fontWeight: "600",
              color: PRIMARY_COLOR,
            }}
          >
            Scan to Track
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoicePDF;