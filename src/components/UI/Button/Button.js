import React from "react";
import styles from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      type={props.type}
      className={styles.button}
      onClick={props.onClick}
      disabled={props.loading}
    >
      {props.children}
    </button>
  );
};

export default Button;
