import React from "react";
import firebase from "../firebase";
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import axios from 'axios';

function Main() {
    const username = localStorage.getItem('username')
    console.log(username)
    const [name, setName] = React.useState("")
    const [eligible, setEligible] = React.useState("N")
    const [userlist, setUserlist] = React.useState([])
    const twitter = "https://twitter.com/"
    console.log(eligible)

    function testing(arg){
      const body = {source: username, target: String(arg)}
      axios.post('https://dcappapi.vercel.app/api/query', body)
      .then(res => {
        if (res.data === "successful!") {
          setEligible("Y")
          sendRequest(arg)
        }
      })
    }

    function sendRequest(arg) {
      if (eligible === "Y") {
        const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
        const db = firebase.firestore()
        db.collection("Users").doc(arg).update({
            requests: arrayUnion(username)
        }).then(store.addNotification({
            title: "Request Sent!",
            message: "check your meetings page for updates",
            type: "success",
            insert: "top",
            container: "top-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          }))
      }
    }

    React.useEffect(() => {
        const fetchData = async() => {
          const db = firebase.firestore()
          const data = db.collection("Users").doc(username)
          data.get().then(function(doc){setName(doc.data().name)})
        }
        fetchData()
      }, [username])
      React.useEffect(() => {
        const getUsers = async() => {
          const db = firebase.firestore()
          const data = await db.collection("Users").get()
          setUserlist(data.docs.map(doc => doc.data()))
        }
        getUsers()
      }, [])
    return(
        <div>
            <ReactNotification/>
            <div className="content-start m-10 text-white font-mono text-left">
            <a href="/home" className="text-2xl"><span className="bg-gray-900 p-2">Dream Call</span></a>
            </div>
        <div className="content-start text-left ml-10">
            <a href="/home" className="text-black text-xl"><span className="bg-gray-100  focus:border-blue-300 p-1">Home</span></a>
            <a href="/requests" className="ml-10 text-black text-xl"><span className="p-1  focus:border-blue-300">Requests</span></a>
            <a href="/bookings" className="ml-10 text-black text-xl"><span className="p-1  focus:border-blue-300">Bookings</span></a>
        </div>    
        <div className="content-start m-10 text-white font-mono text-left">
            <h1 className="mt-10 text-2xl text-black">Welcome {name}!</h1>
            <p className="mt-3 text-black text-lg">Explore a few profiles below and book your first call today :)</p>
        </div>
        {userlist.map(user => (
          <div>
          <div className="p-3 content-start rounded-sm font-mono m-10 mb-0 text-left bg-gray-100 shadow-xl border-2 text-black">
          <h1 className="text-xl">{user.name} (<a className="text-blue-900" href={twitter.concat(user.username)}>@{user.username}</a>)</h1>
          </div>
            <div className="p-3 content-start m-10 mt-0 rounded-sm font-mono text-left bg-gray-100 shadow-xl border-2 text-black">
                <h1 className="text-sm text-gray-900">{user.bio}</h1>
                <button className="mt-3 p-1 focus:border-white-300 border rounded-sm bg-blue-400" onClick={() => testing(user.username)}><span className="text-white">request call</span></button>
            </div>
            </div>
        ))}
        </div>
    )
}

export default Main;