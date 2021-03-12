import React from "react";
import firebase from "../firebase";
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'


function HomePage() {
    const db = firebase.firestore()
    const [link, setLink] = React.useState("")
    //const [myuser, setMyUser] = React.useState("")
    //const [bio, setBio] = React.useState("")
    //const [showName, setShowName] = React.useState("")
    var provider = new firebase.auth.TwitterAuthProvider();
    function SignInWithTwitter(){
        firebase.auth().signInWithPopup(provider).then(function(result){
            var bio = (result.additionalUserInfo.profile.description);
            var myuser = (result.additionalUserInfo.username);
            var showName = (result.user.displayName);
            localStorage.setItem("username", myuser);
            localStorage.setItem("showName", showName);
            localStorage.setItem("bio", bio)
            }).then(() => {
                var username = localStorage.getItem("username")
                db.collection("Users").doc(username).set({
                    bio: localStorage.getItem("bio"),
                    name: localStorage.getItem("showName"),
                    requests: [],
                    bookings: [],
                    username: username, 
                    link: link,
                }).then(store.addNotification({
                    title: "Account Created Successfully!",
                    message: "redirecting to home page",
                    type: "success",
                    insert: "top",
                    container: "top-left",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
            })).then(window.location.href = "/home")
            })}
    return(
        <div>
            <ReactNotification />
        <div className="content-start text-white font-mono text-left">
            <h1 className="m-10 text-2xl"><span className="p-2 bg-gray-900">Dream.Call</span></h1>
            <p className="ml-10 text-xl  text-black">asking for meetings over twitter DMs sucks 😡</p>
            <p className="ml-10 text-xl  text-black">if you follow someone and they follow you back, you can send them a meeting request and book a 15-min meeting with them &#128512;</p>
            <br/>
            <br/>
            <div className="">
                <input className="ml-10 w-80 h-14 border p-2 text-black" placeholder="calendly link" onChange={e => setLink(e.target.value)} type="link"></input>
            </div>
            <button onClick={SignInWithTwitter} className="mt-5 ml-10 h-14"><span className="font-bold lowercase p-4 bg-blue-400">Get in with Twitter</span></button>
        </div>
        </div>
    )
}

export default HomePage;