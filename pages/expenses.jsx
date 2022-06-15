// ! Imports
import { db } from "../firebase-config";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../Contexts/AuthContext";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Expenses.module.css";
// Date Picker Tutorial: https://www.youtube.com/watch?v=OpaT8jLB-hc
import { Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { fontSize } from "@mui/system";
import { Dropdown, Selection } from "react-dropdown-now";
import "react-dropdown-now/style.css";

// !                                                 //
// ! Main Component Function                         //
// !                                                 //

export const Expenses = (props) => {
  // ! States & Refs
  const [newName, setNewName] = useState("");
  const [newBusiness, setNewBusiness] = useState("");
  const [selectedNewDate, setSelectedNewDate] = useState(null);
  const [newType, setNewType] = useState(null);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [userExpenses, setUserExpenses] = useState([]);
  const [modalActive, setModalActive] = useState(true);
  console.log(selectedNewDate);

  // @ BAD: I've moved the collection ref below into specific functions because currentUser.uid is not defined at load yet when not logged in. (e.g. log out) -> needs to be done better
  // const userExpensesCollectionRef = collection(
  //   db,
  //   "users",
  //   currentUser.uid,
  //   "userExpenses"
  // );

  // ! handle function when User presses the Logout Button
  async function handleLogout() {
    setError("");
    try {
      await logout();
      console.log("Signout succesful");
      router.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  // ! Fetch all the expenses docs from the user's UserExpenses Collection (on Page load, when adding an expense or deleting)
  async function fetchFireStoreCollectionData() {
    // don't load if there is no current user // might not be necessary
    if (!currentUser) return;

    // define the collection ref
    const userExpensesCollectionRef = collection(
      db,
      "users",
      currentUser.uid,
      "userExpenses"
    );

    // retrieving Data
    // Note: This could be done server sided but we need to figure out how to get access to the currentUser.uid on the server side in order to get the docs initially
    const fireBaseResponse = await getDocs(userExpensesCollectionRef);
    const fbExpenseData = fireBaseResponse.docs.map((el) => {
      return { ...el.data(), id: el.id };
    });

    // Setting state with data from Firebase
    if (fbExpenseData.length > 0) {
      setUserExpenses([...fbExpenseData]);
    } else {
      return;
    }
  }

  // ! Fetch all the expenses docs from the user's UserExpenses Collection (on Page load, when adding an expense or deleting)
  async function handleAddExpenseButton() {
    // define collection ref
    const userExpensesCollectionRef = collection(
      db,
      "users",
      currentUser.uid,
      "userExpenses"
    );

    // add a document to the collection
    await addDoc(userExpensesCollectionRef, {
      business: newBusiness,
      name: newName,
      type: newType,
    });

    // fetch data again in order to set state and re-render the page
    await fetchFireStoreCollectionData();

    // change state of modal in order to close the modal
    setModalActive(false);
  }

  // ! Open the modal when the user clicks on the "add expense" button
  function handleToggleModalButton() {
    setModalActive(true);
    // add event listener
  }

  // ! Delete an expense when the user clicks on the appropriate button of each expense
  async function handleDeleteButton(docRef) {
    // delete the doc
    await deleteDoc(doc(db, "users", currentUser.uid, "userExpenses", docRef));
    // Fetch all the data again and set state in order to re-render the page
    await fetchFireStoreCollectionData();
  }

  // ! Get the data on initial Page load or redirect the user when not logged in
  useEffect(() => {
    // check if there is a current user (which means a user is logged in)
    if (currentUser) {
      console.log("signed In");
    } else if (currentUser == null) {
      // redirect the user if not logged in
      router.push("/login");
    }
    fetchFireStoreCollectionData();
    // eslint-disable-next-line
  }, [currentUser]);

  // ! Detect a click outside the modal box and close the modal
  const refOne = useRef();
  useEffect(() => {
    // handler function for the eventlistener below
    let handler = (e) => {
      // if refOne (which is the white modal box) is different from where was clicked (e.target - somewhere outside the modal box)
      if (!refOne.current.contains(e.target)) {
        // deactivated this for now since it should not trigger while selecting a date or selecting an option
        // setModalActive(false);
      }
    };

    // add eventlistener
    document.addEventListener("mousedown", handler);

    // remove eventlistener to clean up
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // !                                                 //
  // ! JSX                                             //
  // !                                                 //

  if (!currentUser) {
    // if user is signed out or still being checked: don't render anything yet
    return null;
  }

  return (
    <div className="main">
      {/* Nav goes here */}
      <div className={styles.expenses__ctn}>
        <button onClick={handleLogout}>logout</button>
        {error && <p>{error}</p>}
        <p>Email: </p>
        {currentUser && <p>{currentUser.email}</p>}
        <Link href="/update-profile"> Update your email and password </Link>;
        <h1>Expenses</h1>
        {/* // ! Menu Bar with Search and adding expenses */}
        <div className={styles.expenses__menuBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
          />
          <button
            className={styles.toggleModalBtn}
            onClick={handleToggleModalButton}
          >
            Add Expense
          </button>
          <div className={styles.filterBtn}>Filter</div>
        </div>
        {/* // ! Column Headers */}
        <div className={styles.oneExpense__ctn}>
          <h3>Name</h3>
          <h3>Business</h3>
          <h3>ID</h3>
          <h3>Type</h3>
          <h3>Delete?</h3>
        </div>
        {/* // ! Individual Expenses */}
        {userExpenses.map((expense, index) => {
          return (
            <div key={expense.id} className={styles.oneExpense__ctn}>
              <p>{expense.name}</p>
              <p>{expense.business}</p>
              <p>{expense.id}</p>
              <p>{expense.type}</p>
              <div className={styles.column}>
                <button
                  onClick={() => {
                    handleDeleteButton(expense.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* // ! Popup Modal to add an expense */}

      <div
        className={styles.modal__ctn}
        style={{ visibility: !modalActive ? "hidden" : "visible" }}
      >
        <div className={styles.modal__card__ctn} ref={refOne}>
          <h1>Hi!</h1>
          <div className={styles.modal__card__form}>
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
            <Dropdown
              placeholder="Select an option"
              className={styles.dropDownList}
              options={["one", "two", "three"]}
              value="one"
              onChange={(value) => console.log("change!", value)}
              onSelect={(value) => setNewType(value.value)} // always fires once a selection happens even if there is no change
              onClose={(closedBySelection) =>
                console.log("closedBySelection?:", closedBySelection)
              }
              onOpen={() => console.log("open!")}
            />
            ;
            <Stack
              spacing={1}
              sx={{
                width: "250px",
                fontSize: "14px",
                // padding: "11px 20px 12px",
                // border: "1px solid #4e5d7833",
                borderRadius: "4px",
                fontWeight: "500",
              }}
            >
              <DatePicker
                label="Date Picker"
                renderInput={(params) => <TextField {...params} />}
                value={selectedNewDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                }}
              ></DatePicker>
            </Stack>
            <button
              className={styles.addButton}
              onClick={() => {
                handleAddExpenseButton();
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// !                                                 //
// ! Server Side Rendering                           //
// !                                                 //

/*
//  PROBLEM: This is running server side. This means I don't have access to the User id  yet. Need to research how to do this. 
//  For now, I'm moving the retrieval of the API data into the react component. This might already be the proper solution.
export const getServerSideProps = async (pageContext) => {
  
  return {
    props: {
      fbExpenseData: fbExpenseData,
    },
  };
};
*/

export default Expenses;
