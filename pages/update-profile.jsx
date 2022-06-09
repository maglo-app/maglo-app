import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
import Link from "next/link";

export const UpdateProfile = (props) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { newEmail, newPassword, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    // create some promises for updating
    const promises = [];
    setLoading(true);
    setError("");
    //////////////

    if (emailRef.current.value !== currentUser.email) {
      promises.push(newEmail(emailRef.current.value));
    }
    // check if a password was typed in:
    if (passwordRef.current.value) {
      promises.push(newPassword(passwordRef.current.value));
    }
    // promise.all
    Promise.all(promises)
      .then(() => {
        console.log("Succesfully updated");
        router.push("/expenses");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <h1>Update Profile</h1>
      {currentUser && currentUser.email}
      {error && <h3>{error}</h3>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-Mail"
          ref={emailRef}
          id="email"
          required
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="Leave blank to keep"
          ref={passwordRef}
          id="password"
        />
        <input
          type="password"
          placeholder="Leave Blank to keep the same"
          ref={passwordConfirmRef}
          id="password-confirm"
        />
        <button disabled={loading} type="submit" className="w-100">
          Update
        </button>
      </form>
      <p>Want to cancel?</p>
      <Link href="/expenses">
        <p className="Link">Cancel</p>
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

export default UpdateProfile;
