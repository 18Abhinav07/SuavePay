import React, { useState, useEffect } from 'react';
import { initSilk } from '@silk-wallet/silk-wallet-sdk';
import { motion } from 'framer-motion';


/**
 * SuavePayApp component handles the main functionality of the SuavePay application.
 * It integrates with the Silk Wallet for authentication and manages user registration,
 * login, payment processing, and transaction history fetching.
 *
 * @component
 * @example
 * return (
 *   <SuavePayApp />
 * )
 *
 * @returns {JSX.Element} The rendered SuavePayApp component.
 *
 * @function
 * @name SuavePayApp
 *
 * @description
 * - Initializes the Silk Wallet.
 * - Manages state for wallet details, user authentication, and transactions.
 * - Handles user registration and login.
 * - Processes payments and fetches transaction history.
 *
 * @async
 * @function checkUserExists
 * @param {string} walletAddr - The wallet address to check in the database.
 * @returns {Promise<void>} Sets the state to indicate if the user is new or existing.
 *
 * @async
 * @function handleSilkLogin
 * @returns {Promise<void>} Logs in the user using Silk Wallet and sets the wallet details.
 *
 * @async
 * @function handleRegister
 * @param {Event} e - The form submission event.
 * @returns {Promise<void>} Registers a new user.
 *
 * @async
 * @function handleLogin
 * @param {Event} e - The form submission event.
 * @returns {Promise<void>} Logs in an existing user.
 *
 * @async
 * @function handlePayment
 * @param {Event} e - The form submission event.
 * @returns {Promise<void>} Processes a payment transaction.
 *
 * @async
 * @function fetchTransactions
 * @returns {Promise<void>} Fetches the transaction history for the logged-in user.
 *
 * @useEffect
 * @description
 * - Prompts Silk Wallet login when the component mounts.
 *
 * @state {Object} walletDetails - The wallet address and email of the user.
 * @state {boolean} isNewUser - Indicates if the user is new.
 * @state {string} password - The password entered by the user.
 * @state {string} confirmPassword - The password confirmation entered by the user.
 * @state {boolean} isSilkLoggedIn - Indicates if the user is logged in with Silk Wallet.
 * @state {boolean} isLoggedIn - Indicates if the user is logged in.
 * @state {string} amount - The payment amount entered by the user.
 * @state {string} receiverWalletAddress - The receiver's wallet address entered by the user.
 * @state {string} receiverEmail - The receiver's email entered by the user.
 * @state {Array} transactions - The transaction history of the user.
 */
const SuavePayApp = () => {
  const silk = initSilk();
  const [walletDetails, setWalletDetails] = useState({ walletAddr: '', email: '' });
  const [isNewUser, setIsNewUser] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSilkLoggedIn, setSilkLoggedIn] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [amount, setAmount] = useState('');
  const [receiverWalletAddress, setReceiverWalletAddress] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [transactions, setTransactions] = useState([]);


  const checkUserExists = async (walletAddr) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/check-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: walletAddr }),
      });
      const data = await response.json();
      setIsNewUser(!data.exists);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const handleSilkLogin = async () => {
    try {
      await silk.login();
      const accounts = await silk.request({ method: 'eth_requestAccounts' });
      const walletAddr = accounts[0];
      const email = await silk.requestEmail();
      setWalletDetails({ walletAddr, email });
      localStorage.setItem('walletAddress', walletAddr);
      localStorage.setItem('email', email);
      setSilkLoggedIn(true);
      await checkUserExists(walletAddr);
    } catch (error) {
      console.error('Silk Wallet login failed:', error);
      alert('Silk Wallet login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: walletDetails.email, walletAddress: walletDetails.walletAddr, password }),
      });
      const data = await response.json();
      alert(data.message);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: walletDetails.walletAddr, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        setIsLoggedIn(true);
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          senderWalletAddress: walletDetails.walletAddr,
          receiverWalletAddress,
          senderEmail: walletDetails.email,
          receiverEmail,
        }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/transactions/${walletDetails.walletAddr}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    handleSilkLogin();
  }, []);

  const inputClasses = "w-full p-3 mb-4 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-300 font-sans placeholder-amber-400";
  const buttonClasses = "w-full p-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center py-10 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-amber-800 mb-2 font-serif">SuavePay</h1>
        <p className="text-amber-600 text-lg">Seamless payments, every time</p>
      </motion.div>

      {!isLoggedIn && isSilkLoggedIn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {isNewUser ? (
            <div className="bg-white rounded-xl shadow-xl p-8 mb-6 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-semibold text-amber-800 mb-6 font-serif">Create Account</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg mb-4">
                  <p className="text-amber-700 mb-2">Wallet Address: <span className="font-mono text-sm">{walletDetails.walletAddr}</span></p>
                  <p className="text-amber-700">Email: {walletDetails.email}</p>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClasses}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={inputClasses}
                />
                <button
                  type="submit"
                  className={`${buttonClasses} bg-amber-600 text-white hover:bg-amber-700`}
                >
                  Register
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-xl p-8 mb-6 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-semibold text-amber-800 mb-6 font-serif">Welcome Back</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg mb-4">
                  <p className="text-amber-700 mb-2">Wallet Address: <span className="font-mono text-sm">{walletDetails.walletAddr}</span></p>
                  <p className="text-amber-700">Email: {walletDetails.email}</p>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClasses}
                />
                <button
                  type="submit"
                  className={`${buttonClasses} bg-amber-600 text-white hover:bg-amber-700`}
                >
                  Login
                </button>
              </form>
            </div>
          )}
        </motion.div>
      )}

      {isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-amber-800 mb-6 font-serif">
              Welcome, {walletDetails.email}
            </h2>

            <div className="mb-8 p-6 bg-amber-50 rounded-xl">
              <h3 className="text-xl font-semibold text-amber-800 mb-4 font-serif">Make a Payment</h3>
              <form onSubmit={handlePayment} className="space-y-4">
                <input
                  type="text"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className={inputClasses}
                />
                <input
                  type="text"
                  placeholder="Receiver Wallet Address"
                  value={receiverWalletAddress}
                  onChange={(e) => setReceiverWalletAddress(e.target.value)}
                  required
                  className={inputClasses}
                />
                <input
                  type="email"
                  placeholder="Receiver Email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  required
                  className={inputClasses}
                />
                <button
                  type="submit"
                  className={`${buttonClasses} bg-amber-600 text-white hover:bg-amber-700`}
                >
                  Send Payment
                </button>
              </form>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-amber-800 font-serif">Transaction History</h3>
                <button
                  onClick={fetchTransactions}
                  className={`${buttonClasses} bg-amber-500 text-white hover:bg-amber-600 px-6`}
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((tx, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-amber-50 border border-amber-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-amber-800"><span className="font-medium">Amount:</span> {tx.amount}</p>
                        <p className="text-amber-800"><span className="font-medium">Date:</span> {new Date(tx.timestamp).toLocaleString()}</p>
                        <p className="text-amber-700 font-mono text-sm truncate"><span className="font-medium">From:</span> {tx.senderWalletAddress}</p>
                        <p className="text-amber-700 font-mono text-sm truncate"><span className="font-medium">To:</span> {tx.receiverWalletAddress}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-amber-600 py-4">No transactions found.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default SuavePayApp;
