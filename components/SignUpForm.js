import { useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import axios from "axios";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [managerId, setManagerId] = useState("");
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const validateManagerId = async (id, retry = true) => {
    // Basic numeric check
    if (!/^\d+$/.test(id)) {
      return { isValid: false, warning: null, error: "FPL Manager ID must be a numeric value" };
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/fpl/entry/${id}`, {
        timeout: 5000,
      });
      console.log("API Response:", response.data);
      return { isValid: true, warning: null, error: null };
    } catch (err) {
      console.error("Validation Error Details:", {
        message: err.message,
        response: err.response ? err.response.data : null,
        status: err.response ? err.response.status : null,
      });

      // Retry once after a delay
      if (retry) {
        console.log("Retrying API request after delay...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return await validateManagerId(id, false);
      }

      if (err.response && err.response.status === 404) {
        return { isValid: false, warning: null, error: "Invalid FPL Manager ID. Please ensure it exists." };
      } else if (err.code === "ECONNREFUSED") {
        return {
          isValid: false,
          warning: "Unable to validate Manager ID: Proxy server is not running. Please contact support.",
          error: null,
        };
      } else if (err.code === "ETIMEDOUT") {
        return {
          isValid: false,
          warning: "Unable to validate Manager ID: Request timed out. Please try again later.",
          error: null,
        };
      }

      return {
        isValid: false,
        warning: "Unable to validate Manager ID due to API issues. Please try again later.",
        error: null,
      };
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setWarning(null);

    // Validate username
    if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) {
      setError("Username must be 3-15 characters long and contain only letters, numbers, or underscores");
      return;
    }

    // Validate Manager ID
    const { isValid, warning, error: validationError } = await validateManagerId(managerId);
    if (!isValid) {
      if (validationError) setError(validationError);
      if (warning) setWarning(warning);
      return;
    }
    if (warning) {
      setWarning(warning);
    }

    try {
      // Check if username is already taken
      const usernameRef = doc(db, "usernames", username);
      const usernameSnap = await getDoc(usernameRef);
      if (usernameSnap.exists()) {
        setError("Username is already taken");
        return;
      }

      // Check if Manager ID is already in use
      const managerIdRef = doc(db, "managerIds", managerId);
      const managerIdSnap = await getDoc(managerIdRef);
      if (managerIdSnap.exists()) {
        setError("This FPL Manager ID is already in use by another account.");
        return;
      }

      console.log("Attempting to sign up with email:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed up successfully with UID:", user.uid);

      await new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser && currentUser.uid === user.uid) {
            console.log("Auth state confirmed for UID:", currentUser.uid);
            unsubscribe();
            resolve(currentUser);
          }
        }, (err) => {
          console.error("Auth state error:", err);
          reject(err);
        });
      });

      console.log("Saving user data to Firestore...");
      // Save user data in the users collection
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username,
        managerId,
        createdAt: new Date().toISOString(),
        wallet: 0,
      });

      // Save username-to-UID mapping
      await setDoc(doc(db, "usernames", username), {
        uid: user.uid,
      });

      // Save Manager ID-to-UID mapping
      await setDoc(doc(db, "managerIds", managerId), {
        uid: user.uid,
      });

      console.log("User data saved to Firestore successfully");
      alert("Signed up successfully!");
    } catch (err) {
      console.error("Sign-up error:", err.message);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="max-w-md mx-auto p-4 bg-light-gray rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-forest-green">Sign Up</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-2 border border-light-gray rounded focus:outline-none focus:ring-2 focus:ring-vibrant-magenta placeholder-light-gray"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-2 border border-light-gray rounded focus:outline-none focus:ring-2 focus:ring-vibrant-magenta placeholder-light-gray"
        required
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username (3-15 characters)"
        className="w-full p-2 mb-2 border border-light-gray rounded focus:outline-none focus:ring-2 focus:ring-vibrant-magenta placeholder-light-gray"
        required
      />
      <div className="relative">
        <input
          type="text"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          placeholder="FPL Manager ID (e.g., 123456)"
          className="w-full p-2 mb-2 border border-light-gray rounded focus:outline-none focus:ring-2 focus:ring-vibrant-magenta placeholder-light-gray"
          required
        />
        <a
          href="/find-fpl-id"
          className="absolute right-2 top-2 text-sm text-forest-green hover:underline"
        >
          How to find your Manager ID?
        </a>
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-forest-green text-white rounded hover:bg-opacity-90 transition"
      >
        Sign Up
      </button>
      {error && <p className="text-vibrant-magenta mt-2">{error}</p>}
      {warning && <p className="text-yellow-500 mt-2">{warning}</p>}
    </form>
  );
}