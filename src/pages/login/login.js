import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import "./login.css";
import Header from "../../components/header/header";

const firebaseConfig = {
  apiKey: "AIzaSyD6xgrttBIm9vw07xRltKsqHZNpS1jJ8xw",
  authDomain: "taistat-f0e1d.firebaseapp.com",
  projectId: "taistat-f0e1d",
  storageBucket: "taistat-f0e1d.firebasestorage.app",
  messagingSenderId: "196742294604",
  appId: "1:196742294604:web:715fe57bf6471221b898e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL path
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("loggedInUserId");
    // Redirect only if user is logged in and is currently on the login page
    if (user && location.pathname === "/login") {
      navigate("/Userdash");
    }
  }, [navigate, location.pathname]); // Depend on location.pathname

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          localStorage.setItem("loggedInUserId", user.uid);
          localStorage.setItem("userData", JSON.stringify(userDoc.data()));
          navigate("/Userdash");
        } else {
          setMessage("User not found in database.");
        }
      } else {
        // Sign up logic
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Save user data in Firestore
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          gender: formData.gender,
          email: formData.email,
        };

        await setDoc(doc(db, "users", user.uid), userData);

        setMessage("Account created successfully. Please login.");
        setIsLogin(true); // Switch to login form
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isLogin ? "Member Login" : "Sign Up"}</h2>
          {message && <p className="auth-message">{message}</p>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} />
                <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} />
                <select name="gender" required onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </>
            )}
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
            <button type="submit" className="auth-button auth-login-btn">
              {isLogin ? "LOGIN" : "SIGN UP"}
            </button>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Create your Account" : "Login here"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
