import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";

export const Login = (props) => {
  // ! Refs and State
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //   const navigate = useNavigate();

  // ! Handle Submit Button
  async function handleSubmit(e) {
    e.preventDefault();

    // try catch for signup
    try {
      setError("");
      setLoading(true); // disable the button when signup up a user so they don't acceidentally create multiple accounts
      await login(emailRef.current.value, passwordRef.current.value);
      console.log("succesfully logged in");
      <Link href="/expenses"> </Link>;
      // Add the user to to the database either here or in the Authcontroller. Probably in the auth provider.
    } catch (err) {
      setError("Failed to sign in");
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <div>
      <h1>Login</h1>
      {currentUser && currentUser.email}
      {error && <h3>{error}</h3>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-Mail"
          ref={emailRef}
          id="email"
          //   onChange={(event) => {
          //     setNewName(event.target.value);
          //   }}
        />
        <input
          type="password"
          placeholder="Your password"
          ref={passwordRef}
          id="password"
          //   onChange={(event) => {
          //     setNewName(event.target.value);
          //   }}
        />

        <button disabled={loading} type="submit" className="w-100">
          Click to Login
        </button>
      </form>
      <p>Need an account?</p>
      <Link href="/signup"> Signup </Link>;<p>Forgot password?</p>
      <Link href="/forgot-password"> Forgot </Link>;
    </div>
  );
};

export const getServerSideProps = async (pageContext) => {
  return {
    props: {},
  };
};

export default Login;
