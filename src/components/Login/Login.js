import React, { useContext } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { userContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const history = useHistory();
    const location = useLocation();
    const {from} = location.state || {pathname: '/'};

    if(firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
    const handleGoogleSignIn = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    const {displayName, email} = result.user;
    const signedInUser = {displayName, email}
    setLoggedInUser(signedInUser);
    console.log(signedInUser);
    history.replace(from);
  }).catch((error) => {
    console.log(error.message);
  });
}
const handleFacebookSignIn = () => {
  var fbProvider = new firebase.auth.FacebookAuthProvider();
    firebase.auth()
    .signInWithPopup(fbProvider)
    .then((result) => {
  var credential = result.credential;
  var user = result.user;
  var accessToken = credential.accessToken;
  console.log(user);
})
.catch((error) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
  console.log('error', credential, email, errorCode, errorMessage);
});
}
const handleGithubSignIn = () => {
  var ghProvider = new firebase.auth.GithubAuthProvider();
  firebase
  .auth()
  .signInWithPopup(ghProvider)
  .then((result) => {
    var credential = result.credential;
    var token = credential.accessToken;
    var user = result.user;
    console.log(user);
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    console.log(email, errorCode, errorMessage, credential);
  });
}
  const handleSubmit = (e) => {
    if (loggedInUser.email && loggedInUser.password) {
      firebase.auth().createUserWithEmailAndPassword(loggedInUser.email, loggedInUser.password)
      .then((userCredential) => {
      var user = userCredential.user;
    })
    .catch((error) => {
      const newUser = {...loggedInUser};
      newUser.error = error.message;
      setLoggedInUser(newUser);
    });
    }
    e.preventDefault();
  }
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const passwordValid = e.target.value.length > 5;
      const passwordNumbValid = /\d{1}/.test(e.target.value);
      isFieldValid = passwordValid && passwordNumbValid;
    }
    if (isFieldValid) {
      const newUser = {...loggedInUser};
      newUser[e.target.name] = e.target.value;
      setLoggedInUser(newUser);
    }
  }
    return (
        <div style={{textAlign: 'center'}}>
            <h1>This is Login</h1>
            <button onClick={handleGoogleSignIn}>Google Sign In</button>
            <br/>
            <button onClick={handleFacebookSignIn}>Facebook Sign In</button>
            <br/>
            <button onClick={handleGithubSignIn}>Github Sign In</button>

            <h2>Login Form</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" onBlur={handleBlur} name="name" placeholder="Enter your Name"/>
              <br/>
              <input type="text" onBlur={handleBlur} required name="email" placeholder="Enter your Email"/>
              <br/>
              <input type="password" onBlur={handleBlur} required name="password" placeholder="Enter your password"/>
              <br/>
              <input type="submit" value="Submit"/>
            </form>
            
            <h2 style={{color: 'red'}}>{loggedInUser.error}</h2>
        </div>
    );
};

export default Login;