import React from "react";
import firebase from "../firebase";
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

function Requests() {
    const [requests, setRequests] = React.useState([])
    const username = localStorage.getItem('username')

    function acceptRequest(arg) {
        const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
        const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
        const db = firebase.firestore()
        db.collection("Users").doc(arg).update({
            bookings: arrayUnion(username)
        }).then(db.collection("Users").doc(username).update({
            requests: arrayRemove(arg)
        })).then(store.addNotification({
            title: "Request Accepted!",
            message: "We'll share your calendly link with this user",
            type: "success",
            insert: "top",
            container: "top-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          })).then(fetchData)
    }

    function denyRequest(arg) {
        const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
        const db = firebase.firestore()
        db.collection("Users").doc(username).update({
            requests: arrayRemove(arg)
        }).then(store.addNotification({
            title: "Request Denied!",
            message: "Don't worry, the requester won't know you denied their call",
            type: "danger",
            insert: "top",
            container: "top-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          })).then(fetchData)
    }

    const fetchData = async() => {
        const db = firebase.firestore()
        const data = db.collection("Users").doc(username)
        data.get().then(function(doc){setRequests(doc.data().requests)})
      }

    React.useEffect(() => {
        const fetchData = async() => {
          const db = firebase.firestore()
          const data = db.collection("Users").doc(username)
          data.get().then(function(doc){setRequests(doc.data().requests)})
        }
        fetchData()
      }, [username])
    return(
        <div>
            <ReactNotification/>
            <div className="content-start m-10 text-white font-mono text-left">
            <a href="/home" className="text-2xl"><span className="bg-gray-900 p-2">Dream Call</span></a>
            </div>
            <div className="content-start text-left w-80 m-10 ml-10">
            <a href="/home" className="text-black text-xl"><span className="p-1">Home</span></a>
            <a href="/requests" className="ml-10 text-black text-xl"><span className="bg-gray-200 p-1">Requests</span></a>
            <a href="/bookings" className="ml-10 text-black text-xl"><span className="p-1">Bookings</span></a>
            </div> 
            <div className="content-start m-10 text-white font-mono text-left">
            <h1 className="mt-10 text-2xl text-black">Your Requests</h1>
            <p className="mt-3 text-black text-sm text-gray-400">don't see anything here? wait for sometime to receive requests</p>
            </div>
                {requests.map(request => (
                    <div className="font-mono m-10 h-32 bg-gray-100 shadow-xl">
                    <div className="content-start text-left"><h1 className="m-3 pt-3 font-bold text-lg">{request} has requested you for a call.</h1></div>
                    <button className="ml-2 float-left text-white shadow-xl bg-green-400 p-2" onClick={() => acceptRequest(request)}>accept</button>
                    <button className="ml-2 float-left bg-red-400 shadow-xl shadow-green text-white p-2" onClick={() => denyRequest(request)}>deny</button>
                    </div>
                ))}
        </div>
    )
}

export default Requests;