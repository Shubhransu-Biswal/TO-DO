import React, { useState, useEffect } from "react";

import CourseGoalList from "./components/CourseGoals/CourseGoalList/CourseGoalList";
import CourseInput from "./components/CourseGoals/CourseInput/CourseInput";
import "./App.css";

const App = () => {
  const [listFromFirebase, setListFromFirebase] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // For first time opening the app it will get data from backend
  useEffect(() => {
    const initialResponse = async () => {
      setIsLoading(true);
      const receiveResponse = await fetch(
        "https://react-data-36aa6-default-rtdb.firebaseio.com/toDo.json"
      );
      const data = await receiveResponse.json();
      setListFromFirebase((recentVal) => {
        const updatedArr = [];
        for (let key in data) {
          updatedArr.unshift({
            text: data[key].goals,
            id: data[key].id,
            fireKey: key,
          });
        }
        return updatedArr;
      });
      setIsLoading(false);
    };
    initialResponse();
  }, []);

  // This state keep track of local storage
  const [i, setI] = useState(1);

  // this will add goal
  const addGoalHandler = (enteredText) => {
    // This async function will do both post and get request and store the values like , text , id , firekey in listFromfirebase state
    const sendData = async () => {
      setIsLoading(true);
      // this is the post request
      await fetch(
        "https://react-data-36aa6-default-rtdb.firebaseio.com/toDo.json",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goals: enteredText,
            id: `m${
              localStorage.getItem("value") ? localStorage.getItem("value") : i
            }`,
          }),
        }
      );
      // this is the get request
      const receiveResponse = await fetch(
        "https://react-data-36aa6-default-rtdb.firebaseio.com/toDo.json"
      );
      const data = await receiveResponse.json();
      setListFromFirebase((recentVal) => {
        const updatedArr = [];
        for (let key in data) {
          updatedArr.unshift({
            text: data[key].goals,
            id: data[key].id,
            fireKey: key,
          });
        }
        return updatedArr;
      });
      setIsLoading(false);
    };

    sendData();

    // This below here will set the id to localstorage
    setI((rec) => {
      localStorage.setItem("value", rec + 1);

      let index = localStorage.getItem("value");
      return Number(index) + 1;
    });
  };

  // This will delete from screen as well as backend
  const deleteItemHandler = (goalId) => {
    setListFromFirebase((prevList) => {
      const updatedGoals = prevList.filter((goal) => goal.id !== goalId);
      const deletionIndex = prevList.find((goal) => goalId === goal.id);

      const sendDeleteReq = async () => {
        // this is the delete method for backend
        await fetch(
          `https://react-data-36aa6-default-rtdb.firebaseio.com/toDo/${deletionIndex.fireKey}.json`,
          {
            method: "DELETE",
          }
        );
      };
      sendDeleteReq();
      return updatedGoals;
    });
  };

  let content = (
    <p style={{ textAlign: "center", color: "white" }}>
      No goals found. Maybe add one?
    </p>
  );

  if (isLoading) {
    content = <p style={{ textAlign: "center", color: "white" }}>Loading...</p>;
  }

  if (listFromFirebase.length > 0) {
    content = (
      <CourseGoalList
        items={listFromFirebase}
        onDeleteItem={deleteItemHandler}
      />
    );
  }

  return (
    <div className="mainBack">
      <div className="containGoals">
        <section id="goal-form">
          <CourseInput onAddGoal={addGoalHandler} loading={isLoading} />
        </section>
        <section id="goals">{content}</section>
      </div>
    </div>
  );
};

export default App;
