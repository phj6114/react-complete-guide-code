import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const Login = (props) => {
  //useState 선언
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  //리듀서 함수
  const emailReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      //이 리턴부분을 리듀서에서 스냅샷이라고 한다
      return { value: action.val, isValid: action.val.includes("@") };
    }

    if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: state.value.includes("@") };
    }
  };
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });

  //useEffect를 사용하면 함수를 언제실행할 지 제어가능하다
  //useEffect는 모든 컴포넌트가 재평가된 후에 실행된다
  //useEffect는 의존성이 변경될 때 실행되는데 최초 화면 로딩 시 한번은 꼭 실행된다. 의존성이 없었으므로!
  //useEffect는 두개의 인자를 받는다. 첫 번째는 함수이며 두 번째는 의존성을 보관하는 배열이다
  //useEffect는 사이드 이펙트를 처리하기 위해 사용한다 - 예) http 요청

  //디바운싱 : 사용자가 타이핑을 적극적으로 하다가 일시중지 했을 때 유효성 체크

  useEffect(() => {
    console.log("called 1st useEffect");

    return () => {
      console.log("cleanup 1st useEffect");
    };
  }, [enteredPassword]);

  /*useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity!");
      setFormIsValid(
        enteredEmail.includes("@") && enteredPassword.trim().length > 6
      );
    }, 500);

    return () => {
      console.log("CALLED CLEAN UP FUNCTION !!");
      clearTimeout(identifier);
    };
  }, [enteredEmail, enteredPassword]);*/

  const emailChangeHandler = (event) => {
    //setEnteredEmail(event.target.value);
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    setFormIsValid(emailState.isValid && enteredPassword.trim().length > 6);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const validateEmailHandler = () => {
    //setEmailIsValid(emailState.isValid);
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
