import { useState } from "react";
import { auth } from "../../utils/firebase";
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'


export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [error, setError] = useState<{ type: "login" | "register"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const db = getDatabase()
  // ✅ Login handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(null);
      sessionStorage.setItem("userId", auth.currentUser?.uid || "")
      const usersRef =  ref(db, `users/${auth.currentUser?.uid}`);
      get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          sessionStorage.setItem("name", data.name);
          toast.success("Successfully logged in")
          navigate("/dashboard")
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
     
      
      
    } catch (err: any) {
      setError({ type: "login", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register handler
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;
    const terms = form.get("terms");

    if (!name || !email || !password || !confirmPassword) {
      setError({ type: "register", message: "Please fill in all fields" });
      return;
    }
    if (password !== confirmPassword) {
      setError({ type: "register", message: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
        // ✅ Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        sessionStorage.setItem("userId", user.uid)
        // ✅ Save user info in Realtime Database
        const db = getDatabase();
        await set(ref(db, "users/" + user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          role: "user",
          createdAt: new Date().toISOString(),
        });
    
        setError(null);
        setActiveTab("login");
        setError({ type: "login", message: "✅ Registration successful! Please login." });
      } catch (err: any) {
        setError({ type: "register", message: err.message });
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-100 to-green-800">
      <div className="w-full max-w-md">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-inner">
            <button
              onClick={() => setActiveTab("login")}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
                activeTab === "login" ? "text-white bg-indigo-600" : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
                activeTab === "register" ? "text-white bg-indigo-600" : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to manage your inventory</p>
            </div>

            {error?.type === "login" && (
              <div className="mb-4 p-3 rounded-lg text-sm animate-fadeIn bg-red-50 text-red-600">
                {error.message}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${showLoginPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              {/* Remember me / Forgot */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" name="remember" className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 relative">
                  Forgot password?
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </a>
              </div>

              {/* ✅ Login Button with Spinner */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-lg transition ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button onClick={() => setActiveTab("register")} className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Register here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500 mt-2">Get started with your inventory management</p>
            </div>

            {error?.type === "register" && (
              <div className="mb-4 p-3 rounded-lg text-sm animate-fadeIn bg-red-50 text-red-600">
                {error.message}
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${showRegisterPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" name="terms" className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 ml-1">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* ✅ Register Button with Spinner */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-lg transition ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button onClick={() => setActiveTab("login")} className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
