import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
import Link from "next/link";

export const ForgotPassword = (props) => {
  // Setup refs so we can get the information from the forms
  const emailRef = useRef();
  const { resetPassword, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // try catch for signup
    try {
      setMessage("");
      setError("");
      setLoading(true); // disable the button when signup up a user so they don't acceidentally create multiple accounts
      await resetPassword(emailRef.current.value);
      console.log("succesfully logged in");
      setMessage("Check Inbox for further instructions");
    } catch (err) {
      setError("Failed to reset password");
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <div>
      <h1>Password Reset</h1>
      {currentUser && currentUser.email}
      {message && <h3>{message}</h3>}
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
        <button disabled={loading} type="submit" className="w-100">
          Reset Password
        </button>
      </form>
      <p>Go back?</p>
      <Link href="/login">
        <p className="Link">Go back to Login</p>
      </Link>
      ;
    </div>
  );
};

export const getServerSideProps = (pageContext) => {
  return {
    props: {},
  };
};

export default ForgotPassword;
