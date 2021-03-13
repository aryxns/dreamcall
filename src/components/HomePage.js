import React from "react";
import firebase from "../firebase";
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'


function HomePage() {
    const [link, setLink] = React.useState("")
    const [myuser, setMyUser] = React.useState("")
    const [bio, setBio] = React.useState("")
    const [cansignin, setCansignIn] = React.useState(false)
    const [showName, setShowName] = React.useState("")
    function SignInWithTwitter(){
        var provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
            var bio = (result.additionalUserInfo.profile.description);
            var myuser = (result.additionalUserInfo.username);
            var displayName = (result.user.displayName);
            console.log(myuser, bio, displayName)
            setMyUser(myuser)
            setBio(bio)
            setShowName(displayName)
            localStorage.setItem("username", String(myuser))
        }).catch((error) => {
            // Handle Errors here.
            var errorMessage = error.message;
            console.log(errorMessage)
            // The email of the user's account used.
            // The firebase.auth.AuthCredential type that was used.
            // ...
          }).then(() => setCansignIn(true)).then(
            store.addNotification({
                title: "Twitter Verified!",
                message: "Click GET IN to start calling",
                type: "success",
                insert: "top",
                container: "top-left",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
          )}
    
    function Login() {
        var provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
            const db = firebase.firestore()
            var myuser = (result.additionalUserInfo.username);
            const mydata = db.collection("Users")
            mydata.get().then((querySnapshot) => {
                const tempDoc = querySnapshot.docs.map((doc) => {
                    return doc.data().username
                })
                console.log(tempDoc)
                if (tempDoc.includes(myuser) === true) {
                    localStorage.setItem("username", myuser)
                    window.location.href = "/home"
                } else {
                    store.addNotification({
                        title: "Account Dosen't Exists!",
                        message: "Please verify twitter and create an account",
                        type: "danger",
                        insert: "top",
                        container: "top-left",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 5000,
                          onScreen: true
                        }
                      })
                }
            })
            //localStorage.setItem("username", String(myuser))
        })   
    }

    function CreateAccount() {
        const db = firebase.firestore()
        const username = String(myuser)
        console.log(link)
        console.log(bio)
        console.log(showName)
        var docData = {
            username: username,
            bio: bio,
            name: showName,
            bookings: [],
            requests: [],
            link: link,}
        db.collection("Users").doc(username).set(docData).then(() => console.log("Account Done!")).then(
            store.addNotification({
                title: "Account Created!",
                message: "Redirecting to home page",
                type: "success",
                insert: "top",
                container: "top-left",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
        ).then(window.location.href = "/home")
        }
    var loginButton;
    if (cansignin === false) {
    loginButton = null;
    } else {
    loginButton =<button onClick={CreateAccount} className="mt-5 ml-10 h-14"><span className="font-bold lowercase p-4 bg-green-400">GET IN</span></button>;
    }

    return(
        <div>
            <ReactNotification />
        <div className="content-start text-white font-mono text-left">
            <div className="m-10 text-2xl"><span className="p-2 bg-gray-900">Dream.Call</span><button onClick={Login} className="ml-10 underline text-black">LOGIN</button></div>
            <p className="ml-10 text-xl  text-black">asking for meetings over twitter DMs sucks 😡</p>
            <p className="ml-10 text-xl  text-black">if you follow someone and they follow you back, you can send them a meeting request and book a 15-min meeting with them &#128512;</p>
            <br/>
            <br/>
            <div className="">
                <input className="ml-10 w-80 h-14 border p-2 text-black" placeholder="calendly link" onChange={e => setLink(e.target.value)} type="link"></input>
            </div>
            <button onClick={SignInWithTwitter} className="mt-5 ml-10 h-14"><span className="font-bold lowercase p-4 bg-blue-400">verify twitter</span></button>
            {loginButton}
        </div>
        </div>
    )
}

export default HomePage;
