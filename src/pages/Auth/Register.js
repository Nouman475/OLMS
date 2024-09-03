import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "config/firebase";
import { Link } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthContext } from "contexts/AuthContext";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [state, setState] = useState(initialState);

  const { dispatch } = useAuthContext();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const addToDB = async (user) => {
    let userData = {
      fullName: state.fullName,
      email: state.email,
      uid: user.uid,
      dateCreated: serverTimestamp(),
      isActive: true,
      role:"student"
    };
    try {
      await setDoc(doc(firestore, "users", user.uid), userData);
      dispatch({ type: "SET_LOGGED_IN", payload: { user: userData } });
      console.log(userData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let { fullName, email, password, confirmPassword } = state;

    fullName = fullName.trim();

    if (fullName.length < 3) {
      return window.toastify("Please enter your full name", "error");
    }
    if (!window.isEmail(email)) {
      return window.toastify("Please enter a valid email address", "error");
    }
    if (password.length < 6) {
      return window.toastify("Password must be at least 6 chars.", "error");
    }
    if (confirmPassword !== password) {
      return window.toastify("Passwords don't match", "error");
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        addToDB(user);
        console.log(userCredential);
        window.toastify("Registration success", "success");
      })
      .catch((error) => {
        console.error("error", error);
        switch (error.code) {
          case "auth/email-already-in-use":
            window.toastify("Email address already in use", "error");
            break;
          default:
            window.toastify("Something went wrong", "error");
            break;
        }
      });
  };

  return (
    <div style={{ height: "69vh" }} id="login-page">
      <div className="login-container">
        <h2>Register</h2>
        <form>
          <input
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            name="fullName"
            required
          />
          <input
            onChange={handleChange}
            type="email"
            placeholder="Email"
            name="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            required
          />
          <button type="submit" onClick={handleSubmit}>
            Register
          </button>
        </form>
        <Link to="/auth/login">Already registered? Login here</Link>
      </div>
    </div>
  );
}
