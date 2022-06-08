import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../Contexts/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const Expenses = ({ fbExpenseData }) => {
  console.log("fbExpenseData");
  console.log(fbExpenseData);
  // ! States & Refs
  const [newName, setNewName] = useState("");
  const [newBusiness, setNewBusiness] = useState("");
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  console.log("Current User Email");
  console.log(currentUser);
  //   const [userData, setUserData] = useState({ expenses: [] });
  const [userExpenses, setUserExpenses] = useState([]);

  // ! handle Logout
  async function handleLogout() {
    setError("");
    try {
      await logout();
      console.log("Signout succesful");
      //   <Link href="/login"> </Link>;
      router.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  function handleLoad() {
    if (fbExpenseData.length > 0) {
      setUserExpenses([...fbExpenseData]);
    } else {
      return;
    }
  }

  // ! use effect to get the data from the api
  useEffect(() => {
    console.log("useState is running");
    // getExpenses();
    // getExpensesUser();
    handleLoad();
  }, []);

  // !    //
  // ! JSX
  // !    //
  return (
    <div className="Expenses__ctn">
      <button onClick={handleLogout}>logout</button>
      {error && <p>{error}</p>}
      <p>Email: </p>
      {/* <p>{currentUser.email}</p> */}
      <Link href="/update-profile"> Update your email and password </Link>;
      <h1>work with expenses</h1>
      {/* <AddExpense /> */}
      {/* <OneExpense /> */}
      <div>
        <input
          type="text"
          placeholder="Name"
          onChange={(event) => {
            setNewName(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="business"
          onChange={(event) => {
            setNewBusiness(event.target.value);
          }}
        />
        <input type="text" placeholder="type" />
        <input type="number" placeholder="price" />
        <button
          onClick={() => {
            // createExpense();
            // following was active:
            // createPersonalExpense();
            // getExpenses();
            // following was active:
            // getExpensesUser();
          }}
        >
          Submit Expense
        </button>
      </div>
      {/* <p>{userData.email}</p>
      <p>{userData.userID}</p> */}
      {/* {userData.expenses &&
        userData.expenses.map((expense, index) => {
          return (
            <div key={index}>
              <h3>{expense.name}</h3>
              <p>{expense.business}</p>
            </div>
          );
        })} */}
      {console.log("userExpenses")}
      {console.log(userExpenses)}
      {userExpenses.map((expense, index) => {
        return (
          <div key={index}>
            <h3>{expense.name}</h3>
            <p>{expense.business}</p>
          </div>
        );
      })}
      {/* was expenses before */}
    </div>
  );
};

// !           //
// ! ServerSide
// !           //

export const getServerSideProps = async (pageContext) => {
  // a sub collection from a specific user
  const userExpensesCollectionRef = collection(
    db,
    "users",
    "gDGFN9Zux1fVmJjMbbrDYwga3Ir1",
    "userExpenses"
  );
  // main
  const expensesCollectionRef = collection(db, "expenses");

  // get the data
  //   const fireBaseResponse = await getDocs(expensesCollectionRef);
  const fireBaseResponse = await getDocs(userExpensesCollectionRef);

  const fbExpenseData = fireBaseResponse.docs.map((el) => {
    return { ...el.data(), id: el.id };
  });
  console.log("fbExpenseData");
  console.log(fbExpenseData);
  //   console.log(fbExpenseData);
  //   const check = fireBaseResponse.data();

  return {
    props: {
      fbExpenseData: fbExpenseData,
    },
  };
};

export default Expenses;
