import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import CountryList from 'country-list';
import { FaCcVisa, FaRegCreditCard, FaLock, FaMicrochip } from 'react-icons/fa';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

// Manual mapping of country names to ISO 3166-1 alpha-2 country codes
const countryCodeMapping = {
  "Afghanistan": "AF",
  "Albania": "AL",
  "Algeria": "DZ",
  "Andorra": "AD",
  "Angola": "AO",
  "Antigua and Barbuda": "AG",
  "Argentina": "AR",
  "Armenia": "AM",
  "Australia": "AU",
  "Austria": "AT",
  "Azerbaijan": "AZ",
  "Bahamas": "BS",
  "Bahrain": "BH",
  "Bangladesh": "BD",
  "Barbados": "BB",
  "Belarus": "BY",
  "Belgium": "BE",
  "Belize": "BZ",
  "Benin": "BJ",
  "Bhutan": "BT",
  "Bolivia": "BO",
  "Bosnia and Herzegovina": "BA",
  "Botswana": "BW",
  "Brazil": "BR",
  "Brunei Darussalam": "BN",
  "Bulgaria": "BG",
  "Burkina Faso": "BF",
  "Burundi": "BI",
  "Cabo Verde": "CV",
  "Cambodia": "KH",
  "Cameroon": "CM",
  "Canada": "CA",
  "Central African Republic": "CF",
  "Chad": "TD",
  "Chile": "CL",
  "China": "CN",
  "Colombia": "CO",
  "Comoros": "KM",
  "Congo (Congo-Brazzaville)": "CG",
  "Congo (Democratic Republic of the Congo)": "CD",
  "Costa Rica": "CR",
  "Croatia": "HR",
  "Cuba": "CU",
  "Cyprus": "CY",
  "Czech Republic": "CZ",
  "Denmark": "DK",
  "Djibouti": "DJ",
  "Dominica": "DM",
  "Dominican Republic": "DO",
  "Ecuador": "EC",
  "Egypt": "EG",
  "El Salvador": "SV",
  "Equatorial Guinea": "GQ",
  "Eritrea": "ER",
  "Estonia": "EE",
  "Eswatini": "SZ",
  "Ethiopia": "ET",
  "Fiji": "FJ",
  "Finland": "FI",
  "France": "FR",
  "Gabon": "GA",
  "Gambia": "GM",
  "Georgia": "GE",
  "Germany": "DE",
  "Ghana": "GH",
  "Greece": "GR",
  "Grenada": "GD",
  "Guatemala": "GT",
  "Guinea": "GN",
  "Guinea-Bissau": "GW",
  "Guyana": "GY",
  "Haiti": "HT",
  "Honduras": "HN",
  "Hungary": "HU",
  "Iceland": "IS",
  "India": "IN",
  "Indonesia": "ID",
  "Iran": "IR",
  "Iraq": "IQ",
  "Ireland": "IE",
  "Israel": "IL",
  "Italy": "IT",
  "Jamaica": "JM",
  "Japan": "JP",
  "Jordan": "JO",
  "Kazakhstan": "KZ",
  "Kenya": "KE",
  "Kiribati": "KI",
  "Korea (North)": "KP",
  "Korea (South)": "KR",
  "Kuwait": "KW",
  "Kyrgyzstan": "KG",
  "Laos": "LA",
  "Latvia": "LV",
  "Lebanon": "LB",
  "Lesotho": "LS",
  "Liberia": "LR",
  "Libya": "LY",
  "Liechtenstein": "LI",
  "Lithuania": "LT",
  "Luxembourg": "LU",
  "Madagascar": "MG",
  "Malawi": "MW",
  "Malaysia": "MY",
  "Maldives": "MV",
  "Mali": "ML",
  "Malta": "MT",
  "Marshall Islands": "MH",
  "Mauritania": "MR",
  "Mauritius": "MU",
  "Mexico": "MX",
  "Micronesia": "FM",
  "Moldova": "MD",
  "Monaco": "MC",
  "Mongolia": "MN",
  "Montenegro": "ME",
  "Morocco": "MA",
  "Mozambique": "MZ",
  "Myanmar": "MM",
  "Namibia": "NA",
  "Nauru": "NR",
  "Nepal": "NP",
  "Netherlands": "NL",
  "New Zealand": "NZ",
  "Nicaragua": "NI",
  "Niger": "NE",
  "Nigeria": "NG",
  "North Macedonia": "MK",
  "Norway": "NO",
  "Oman": "OM",
  "Pakistan": "PK",
  "Palau": "PW",
  "Panama": "PA",
  "Papua New Guinea": "PG",
  "Paraguay": "PY",
  "Peru": "PE",
  "Philippines": "PH",
  "Poland": "PL",
  "Portugal": "PT",
  "Qatar": "QA",
  "Romania": "RO",
  "Russia": "RU",
  "Rwanda": "RW",
  "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC",
  "Samoa": "WS",
  "San Marino": "SM",
  "Sao Tome and Principe": "ST",
  "Saudi Arabia": "SA",
  "Senegal": "SN",
  "Serbia": "RS",
  "Seychelles": "SC",
  "Sierra Leone": "SL",
  "Singapore": "SG",
  "Slovakia": "SK",
  "Slovenia": "SI",
  "Solomon Islands": "SB",
  "Somalia": "SO",
  "South Africa": "ZA",
  "South Sudan": "SS",
  "Spain": "ES",
  "Sri Lanka": "LK",
  "Sudan": "SD",
  "Suriname": "SR",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Syria": "SY",
  "Taiwan": "TW",
  "Tajikistan": "TJ",
  "Tanzania": "TZ",
  "Thailand": "TH",
  "Timor-Leste": "TL",
  "Togo": "TG",
  "Tonga": "TO",
  "Trinidad and Tobago": "TT",
  "Tunisia": "TN",
  "Turkey": "TR",
  "Turkmenistan": "TM",
  "Tuvalu": "TV",
  "Uganda": "UG",
  "Ukraine": "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  "Uruguay": "UY",
  "Uzbekistan": "UZ",
  "Vanuatu": "VU",
  "Vatican City": "VA",
  "Venezuela": "VE",
  "Vietnam": "VN",
  "Yemen": "YE",
  "Zambia": "ZM",
  "Zimbabwe": "ZW"
};


const CardDemo = ({ cardDetails, isFlipped, setIsFlipped }) => {
  const { number, expiry, cvc, name, postalCode } = cardDetails;

  const cardStyle = {
    background: 'linear-gradient(135deg, #e0e0e0 0%, #b0b0b0 25%, #d0d0d0 50%, #b0b0b0 75%, #e0e0e0 100%)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  };

  const AngularOverlay = () => (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full" style={{
        background: 'repeating-linear-gradient(45deg, rgba(255,255,255,.2) 0px, rgba(255,255,255,.2) 1px, transparent 1px, transparent 100px)',
        transform: 'scale(2)',
      }}></div>
    </div>
  );

  return (
    <div className="perspective-1000 w-full h-64 md:h-72 my-8">
      <div
        className={`relative w-full h-full duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="absolute backface-hidden w-full h-full p-6 rounded-xl shadow-2xl text-white font-sans"
          style={cardStyle}
        >
          <AngularOverlay />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xl font-light tracking-wider text-gray-800">Visa</span>
              <span className="text-sm font-light text-gray-800">GOLD</span>
            </div>
            <div className="w-10 h-8 bg-gray-300 rounded-md shadow-inner mb-4 flex items-center justify-center border border-gray-400">
              <FaMicrochip className="text-gray-600 text-xl" />
            </div>
            <p className={`text-2xl font-mono tracking-wider text-gray-900 drop-shadow-md`}>
              4242 4242 4242 4242
            </p>
            <div className="flex justify-between items-center text-sm font-semibold mt-auto">
              <div className="flex flex-col text-gray-800">
                <span className="text-xs opacity-80">Cardholder</span>
                <span className="uppercase tracking-wider font-bold">{name || 'CARDHOLDER'}</span>
              </div>
              <div className="flex flex-col text-right text-gray-800">
                <span className="text-xs opacity-80">Expires</span>
                <span className="tracking-wider font-bold">{expiry}</span>
              </div>
            </div>
            <div className="absolute bottom-4 right-6 text-5xl font-bold"></div>
          </div>
        </div>

        <div
          className="absolute backface-hidden w-full h-full p-6 rounded-xl shadow-2xl text-white rotate-y-180 font-sans"
          style={cardStyle}
        >
          <AngularOverlay />
          <div className="relative z-10">
            <div className="w-full h-12 bg-gray-900 mt-6 -mx-6 shadow-lg"></div>
            <div className="mt-8 flex flex-col">
              <p className="text-xs text-gray-700 text-right mb-1 italic">Authorized Signature</p>
              <div className="w-full h-10 bg-white text-gray-900 flex items-center justify-end pr-4 rounded border-dashed border-gray-400 border shadow-inner">
                <span className="font-mono text-lg font-bold">{cvc}</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-700 font-light">
              <p>Security Notice: This card is for demonstration purposes only. All transactions require verification.</p>
              <p className='mt-2'>**Billing Address:** {cardDetails.country} - {cardDetails.postalCode}</p>
            </div>
            <div className="absolute bottom-4 right-6 text-5xl font-bold opacity-70"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [countries, setCountries] = useState([]);

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12 / 34');
  const [cardCVC, setCardCVC] = useState('567');
  const [cardName, setCardName] = useState('Nomayen Hossain');
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh'); // Default to Bangladesh country name
  const [postalCode, setPostalCode] = useState('1260');
  const [email, setEmail] = useState('');
  const { id } = useParams();

  const { data: parcelData } = useQuery({
    queryKey: ['parcel', id],
    queryFn: async () => {
      const response = await UseAxiosSecure().get(`/parcels/${id}`);
      return response.data;
    },
    enabled: !!id, // Ensure query is only fired when 'id' is present
  });

  // Log the parcel data when it's fetched
  useEffect(() => {
    if (parcelData) {
      console.log('Parcel Data:', parcelData);
    }
  }, [parcelData]);

  useEffect(() => {
    const countryData = CountryList.getNames();
    setCountries(countryData);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: cardName,
        email: email,
        address: {
          country: countryCodeMapping[selectedCountry] || "BD",
          postal_code: postalCode,
        }
      }
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    alert('Payment successful!');
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#34495e',
        fontFamily: 'system-ui, sans-serif',
        '::placeholder': { color: '#aab7c4' },
        margin: '10px 12px', // Use margin instead of padding
      },
      invalid: { color: '#e74c3c', iconColor: '#e74c3c' },
      complete: { color: '#27ae60' },
    },
    hidePostalCode: true,
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-800 transition duration-150 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        <div className="lg:order-2">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Live Card Preview ✨</h3>
          <p className="text-sm text-gray-600 mb-6">Enter details to see them appear. **Click the card to flip.**</p>
          <CardDemo 
            cardDetails={parcelData || {}}
            isFlipped={isFlipped} 
            setIsFlipped={setIsFlipped} 
          />
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100 lg:order-1">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
            Secure Payment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass} htmlFor="name-on-card">Name on Card</label>
              <input
                type="text"
                id="name-on-card"
                placeholder="Nomayen Hossain"
                className={inputClass}
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                onFocus={() => setIsFlipped(false)}
              />
            </div>
            
            <div>
              <label className={labelClass} htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <hr className="my-6 border-gray-200" />
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaRegCreditCard className="mr-2 text-indigo-600" /> Enter Card Information
            </h3>
            
            <div className="mt-4">
              <label className={labelClass} htmlFor="stripe-card-element">Card Number (Secure Input)</label>
              <div id="stripe-card-element" className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition duration-150 ease-in-out">
                <CardElement
                  options={cardElementOptions}
                  onChange={(e) => {
                    if (e.complete) {
                        setCardNumber('**** **** **** ' + (e.brand ? (e.brand === 'visa' ? '4242' : '0000') : '0000'));
                    } else {
                        setCardNumber('4242 4242 4242 4242'); 
                    }
                    if (e.focus === 'cvc') setIsFlipped(true); 
                  }}
                />
              </div>
            </div>
            
            <hr className="my-6 border-gray-200" />
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass} htmlFor="country">Country or Region</label>
                <select
                  id="country"
                  className={inputClass}
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  {countries.length > 0 ? (
                    countries.map((country, index) => (
                      <option key={index} value={country}>{country}</option>
                    ))
                  ) : (
                    <option value="">Loading countries...</option>
                  )}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="postal-code">Postal Code</label>
                <input
                  type="text"
                  id="postal-code"
                  placeholder="1260"
                  className={inputClass}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
                <span className="font-semibold">Error:</span> {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm" role="alert">
                <span className="font-semibold">Success!</span> Payment was processed successfully.
              </div>
            )}

            <button
              type="submit"
              disabled={!stripe || loading}
              className={`w-full py-3 text-lg font-bold rounded-xl shadow-md transition duration-300 ease-in-out ${
                loading
                  ? 'bg-indigo-300 text-white cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
              } disabled:opacity-50`}
            >
              {loading ? 'Processing Payment...' : `Pay Now (৳${parcelData?.data?.deliveryCost})`}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              <FaLock className="inline-block mr-1 text-green-500" /> Powered by Stripe. Your payment information is secure.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
