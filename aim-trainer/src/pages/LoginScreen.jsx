import React, { useState, useEffect } from "react";
// ===== ICON IMPORTS =====
// Icons from lucide-react for visual elements
import {
  User,        // Icon for username input
  Lock,        // Icon for password input
  LogIn,       // Icon for login button
  UserPlus,    // Icon for register button
  ShieldAlert, // Icon for error messages
  CheckCircle2, // Icon for password criteria met
  XCircle,     // Icon for password criteria not met
  Shuffle,     // Icon for random username generator button
  Eye,         // Icon for show password
  EyeOff,      // Icon for hide password
} from "lucide-react";

// ===== LOGIN SCREEN COMPONENT =====
// This component handles user authentication (login and registration)
// Users can create new accounts or login to existing accounts
// Displays password strength requirements during registration
const LoginScreen = ({ theme, onLoginSuccess }) => {
  // ===== INPUT STATE =====
  // username: Stores the username/callsign entered by user
  const [username, setUsername] = useState("");
  // password: Stores the password entered by user
  const [password, setPassword] = useState("");
  // isRegistering: Boolean to toggle between login and registration modes
  const [isRegistering, setIsRegistering] = useState(false);
  // error: Stores error messages to display to user
  const [error, setError] = useState("");
  // successMessage: Stores success messages after registration
  const [successMessage, setSuccessMessage] = useState("");
  // isLoadingName: Loading state for random username generator
  const [isLoadingName, setIsLoadingName] = useState(false);
  // showPassword: Boolean to toggle between showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // ===== PASSWORD STRENGTH STATE =====
  // Tracks which password criteria have been met during registration
  // UI uses this to show green/red checkmarks
  const [passCriteria, setPassCriteria] = useState({
    length: false,   // Password has 8+ characters
    symbol: false,   // Password contains special character (!@#$%^&*)
    number: false,   // Password contains a digit (0-9)
    upper: false,    // Password contains uppercase letter (A-Z)
  });

  // ===== PASSWORD CRITERIA CHECK EFFECT =====
  // Runs every time password changes
  // Validates password against all criteria and updates state
  useEffect(() => {
    setPassCriteria({
      length: password.length >= 8,                                    // Check minimum length
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),               // Check for special character
      number: /\d/.test(password),                                    // Check for number
      upper: /[A-Z]/.test(password),                                 // Check for uppercase letter
    });
  }, [password]);

  // ===== AUTHENTICATION HANDLER =====
  // Handles both login and registration logic
  // Validates input and manages localStorage for user data
  const handleAuth = () => {
    // Clear any previous messages
    setError("");
    setSuccessMessage("");

    // ===== REGISTRATION VALIDATION =====
    if (isRegistering) {
      // Check if all password criteria are met
      if (!Object.values(passCriteria).every(Boolean)) {
        setError("Security protocols not met.");
        return;
      }
      // Check if username is provided
      if (!username) {
        setError("Callsign required");
        return;
      }
    }

    // ===== BASIC VALIDATION =====
    // Check if both username and password are provided (applies to both login and register)
    if (!username || !password) {
      setError("Username and password required");
      return;
    }

    // Load existing user database from localStorage
    // Format: { username1: password1, username2: password2, ... }
    const usersDB = JSON.parse(
      localStorage.getItem("aimTrainer_users") || "{}"
    );

    // ===== REGISTRATION FLOW =====
    if (isRegistering) {
      // Check if username already exists
      if (usersDB[username]) {
        setError("Username already taken");
        return;
      }
      // Store new user credentials in database
      usersDB[username] = password;
      localStorage.setItem("aimTrainer_users", JSON.stringify(usersDB));

      // Reset to login mode after successful registration
      setIsRegistering(false);
      setSuccessMessage("Profile created successfully. Please authenticate.");
      setPassword("");  // Clear password field for login
    } 
    // ===== LOGIN FLOW =====
    else {
      // Check if user exists in database
      if (!usersDB[username]) {
        setError("User not found");
        return;
      }
      // Check if password matches stored password
      if (usersDB[username] !== password) {
        setError("Incorrect password");
        return;
      }
      // Successful login - call callback to navigate to menu
      onLoginSuccess(username);
    }
  };

  // ===== RANDOM USERNAME GENERATOR =====
  // Fetches a random username from external API or generates fallback
  // Used when user clicks the shuffle button during registration
  const generateRandomUsername = async (setInputCallback) => {
    try {
      // Fetch random user data from Random User API
      const res = await fetch("https://randomuser.me/api/?inc=login");
      const data = await res.json();
      // Extract and set the random username
      setInputCallback(data.results[0].login.username);
    } catch (err) {
      // Fallback if API fails - generate local username
      setInputCallback(`Operative_${Math.floor(Math.random() * 1000)}`);
    }
  };

  // ===== HANDLE GENERATE NAME BUTTON =====
  // Called when user clicks random username button
  // Sets loading state while fetching
  const handleGenName = async () => {
    setIsLoadingName(true);
    await generateRandomUsername(setUsername);
    setIsLoadingName(false);
  };

  // ===== PASSWORD CRITERION DISPLAY COMPONENT =====
  // Sub-component that displays a single password criterion with checkmark
  // met: Boolean indicating if criterion is satisfied
  // label: Text to display (e.g., "8+ Characters")
  const PasswordCriterion = ({ met, label }) => (
    <div
      className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${
        met ? theme.accentText : theme.textSec  // Green if met, gray if not
      }`}
    >
      {/* Show check icon if met, X icon if not */}
      {met ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {/* Make text bold if criterion is met */}
      <span className={met ? "font-bold" : ""}>{label}</span>
    </div>
  );

  // ===== RENDER =====
  return (
    <div
      className={`flex flex-col items-center justify-center h-full space-y-6 animate-fade-in px-4`}
    >
      {/* ===== TITLE AND BRANDING ===== */}
      <div className="text-center mb-4">
        <h1
          className={`text-6xl font-black text-transparent bg-clip-text bg-linear-to-r ${theme.titleGradient} tracking-tighter`}
        >
          AIM TRAINER
        </h1>
        <p className={`${theme.textSec} tracking-[0.5em] text-sm mt-2`}>
          SECURE ACCESS
        </p>
      </div>

      {/* ===== MAIN LOGIN/REGISTRATION PANEL ===== */}
      <div
        className={`${theme.panelBg} p-8 rounded-2xl shadow-2xl border ${theme.panelBorder} w-full max-w-sm relative overflow-hidden transition-colors duration-500`}
      >
        {/* ===== HEADER - CHANGES BASED ON MODE ===== */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-bold ${theme.textMain} flex items-center gap-2`}
          >
            {/* Show different icon and text based on login vs register mode */}
            {isRegistering ? (
              <UserPlus size={20} className={theme.accentText} />
            ) : (
              <LogIn size={20} className={theme.accentText} />
            )}
            {isRegistering ? "Register Agent" : "Agent Login"}
          </h2>
        </div>

        {/* ===== ERROR MESSAGE DISPLAY ===== */}
        {/* Shows only if error state is set */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-400 text-xs p-2 rounded flex items-center gap-2">
            <ShieldAlert size={14} /> {error}
          </div>
        )}

        {/* ===== SUCCESS MESSAGE DISPLAY ===== */}
        {/* Shows after successful registration */}
        {successMessage && (
          <div
            className={`mb-4 ${theme.accentBg}/10 border ${theme.accentBorder} ${theme.accentText} text-xs p-2 rounded flex items-center gap-2`}
          >
            <CheckCircle2 size={14} /> {successMessage}
          </div>
        )}

        {/* ===== INPUT FIELDS AND BUTTONS ===== */}
        <div className="space-y-4">
          
          {/* ===== USERNAME INPUT ===== */}
          <div>
            <label
              className={`block ${theme.textSec} mb-1 text-xs uppercase tracking-wide font-bold`}
            >
              Callsign
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User
                  className={`absolute left-3 top-3 ${theme.textSec}`}
                  size={16}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full ${theme.inputBg} ${theme.textMain} pl-10 pr-4 py-2.5 rounded-lg border ${theme.panelBorder} focus:${theme.accentBorder} focus:outline-none transition-colors text-sm`}
                  placeholder="Username"
                />
              </div>
              
              {/* ===== RANDOM USERNAME GENERATOR BUTTON ===== */}
              {/* Only shows during registration mode */}
              {isRegistering && (
                <button
                  onClick={handleGenName}
                  disabled={isLoadingName}
                  className={`${theme.inputBg} ${theme.textMain} px-3 rounded-lg border ${theme.panelBorder} transition-colors ${theme.accentBgHover} cursor-pointer`}
                  title="Generate Random Callsign"
                >
                  {/* Show spinner while loading */}
                  {isLoadingName ? (
                    <div
                      className={`animate-spin h-4 w-4 border-2 rounded-full border-t-transparent ${theme.accentBorder}`}
                    />
                  ) : (
                    <Shuffle size={16} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ===== PASSWORD INPUT ===== */}
          <div>
            <label
              className={`block ${theme.textSec} mb-1 text-xs uppercase tracking-wide font-bold`}
            >
              Passcode
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-3 ${theme.textSec}`}
                size={16}
              />
              <input
                type={showPassword ? "text" : "password"}  // Toggle between text and password input type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full ${theme.inputBg} ${theme.textMain} pl-10 pr-10 py-2.5 rounded-lg border ${theme.panelBorder} focus:${theme.accentBorder} focus:outline-none transition-colors text-sm`}
                placeholder="Password"
              />
              
              {/* ===== SHOW/HIDE PASSWORD BUTTON ===== */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-3 ${theme.textSec} ${theme.accentBgHover} hover:${theme.textMain} transition-colors cursor-pointer`}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* ===== PASSWORD STRENGTH CRITERIA ===== */}
            {/* Only shows during registration mode */}
            {isRegistering && (
              <div
                className={`mt-3 grid grid-cols-2 gap-2 ${theme.inputBg} p-2 rounded border ${theme.panelBorder}`}
              >
                <PasswordCriterion
                  met={passCriteria.length}
                  label="8+ Characters"
                />
                <PasswordCriterion
                  met={passCriteria.symbol}
                  label="Symbol (!@#)"
                />
                <PasswordCriterion
                  met={passCriteria.number}
                  label="Number (0-9)"
                />
                <PasswordCriterion
                  met={passCriteria.upper}
                  label="Uppercase (A-Z)"
                />
              </div>
            )}
          </div>

          {/* ===== SUBMIT BUTTON ===== */}
          {/* Text and styling changes based on login vs register mode */}
          {/* Button is disabled during registration if password criteria not met */}
          <button
            onClick={handleAuth}
            className={`w-full font-bold py-3 rounded-lg transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2 
                    ${theme.accentBg} ${theme.accentBgHover} text-white cursor-pointer
                    ${
                      isRegistering &&
                      !Object.values(passCriteria).every(Boolean)
                        ? "opacity-50 cursor-not-allowed"  // Disabled styling
                        : ""
                    }`}
            disabled={
              isRegistering && !Object.values(passCriteria).every(Boolean)
            }
          >
            {isRegistering ? "CREATE PROFILE" : "AUTHENTICATE"}
          </button>
        </div>

        {/* ===== MODE TOGGLE ===== */}
        {/* Allows user to switch between login and registration */}
        <div className={`mt-6 text-center border-t ${theme.panelBorder} pt-4`}>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");                // Clear error messages when switching modes
              setSuccessMessage("");        // Clear success messages when switching modes
            }}
            className={`text-xs ${theme.textSec} ${theme.accentBgHover} hover:${theme.textMain} underline decoration-slate-600 underline-offset-4 cursor-pointer`}
          >
            {isRegistering
              ? "Already have a profile? Login"
              : "Need credentials? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
