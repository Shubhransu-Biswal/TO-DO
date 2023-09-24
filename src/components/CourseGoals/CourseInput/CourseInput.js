import React, { useState } from "react";

import Button from "../../UI/Button/Button";
import styles from "./CourseInput.module.css";

const CourseInput = (props) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isValid, setIsValid] = useState(true);

  const goalInputChangeHandler = (event) => {
    if (event.target.value.trim().length > 0) {
      setIsValid(true);
    }
    setEnteredValue(event.target.value);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    if (enteredValue.trim().length === 0) {
      setIsValid(false);
      return;
    } else {
      props.onAddGoal(enteredValue);
      // setEnteredValue("");
    }
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <div
        className={`${styles["form-control"]} ${!isValid && styles.invalid} `}
      >
        <label>Daily Tasks</label>
        <input
          type="text"
          onChange={goalInputChangeHandler}
          // value={enteredValue}
        />
      </div>
      <Button type="submit" loading={props.loading}>
        Add Task
      </Button>
    </form>
  );
};

export default CourseInput;
