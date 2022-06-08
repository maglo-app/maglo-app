import { useState } from "react";
import { useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
// import { Link, useNavigate } from "react-router-dom"; Before with React
import Link from "next/link";

export const Signup = (props) => {
  // ! definitions and imports

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser, addUserToFireStore } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //   const navigate = useNavigate(); Before with React

  // ! handle submit function
  async function handleSubmit(e) {
    e.preventDefault();

    // validation checks
    if (passwordRef.current.value !== passwordConfirmRef.current.value)
      return setError("Passwords don't match");

    // try catch for signup
    try {
      setError("");
      setLoading(true); // disable the button when signup up a user so they don't acceidentally create multiple accounts
      await signup(emailRef.current.value, passwordRef.current.value);
      console.log("succesfully signed up");

      await addUserToFireStore();
      console.log("user was added to firestore");

      <Link href="/expenses"> </Link>;
      //   navigate("/expenses");
    } catch (err) {
      setError("Failed to create an account");
      console.log(err);
    }
    setLoading(false);
  }

  // ! rendering jsx
  return (
    <div>
      <h1>Signup</h1>
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
        <input
          type="password"
          placeholder="password confirmation"
          ref={passwordConfirmRef}
          id="password-confirm"
          //   onChange={(event) => {
          //     setNewName(event.target.value);
          //   }}
        />
        <button disabled={loading} type="submit" className="w-100">
          Click to Signup
        </button>
      </form>
      <p>Already have an account?</p>
      <Link href="/login"> Login </Link>
      {/* <Link to="/login">Login</Link> Before with React */}
    </div>
  );
};

export const getServerSideProps = async (pageContext) => {
  return {
    props: {},
  };
};

export default Signup;
