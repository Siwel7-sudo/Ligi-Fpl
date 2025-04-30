import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("User logged in:", currentUser.email);
      } else {
        console.log("No user logged in");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-soft-teal flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-forest-green mb-6">Welcome to FPL League App</h1>
      <p className="text-lg text-light-gray mb-8">
        Join or create monetized Fantasy Premier League competitions and win big!
      </p>
      {user ? (
        <div className="text-center">
          <p className="text-xl text-forest-green mb-4">
            Welcome, {user.email}!
          </p>
          <button
            onClick={() => auth.signOut()}
            className="p-2 bg-vibrant-magenta text-white rounded hover:bg-opacity-80 transition"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <LoginForm />
          <SignUpForm />
        </div>
      )}
    </div>
  );
}