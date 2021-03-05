import React from "react";
import firebase from "../firebase";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

function Bookings() {
    const username = localStorage.getItem('username')
    const [bookings, setBookings] = React.useState([])
    //const [link, setLink] = React.useState("")
    //console.log(link)

    function getUserData(arg) {
        const db = firebase.firestore();
        const data = db.collection("users").doc(arg)
        data.get().then(function(doc){window.location = doc.data().link})
    }

    React.useEffect(() => {
        const fetchData = async() => {
          const db = firebase.firestore()
          const data = db.collection("users").doc(username)
          data.get().then(function(doc){setBookings(doc.data().bookings)})
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
            <a href="/requests" className="ml-10 text-black text-xl"><span className="p-1">Requests</span></a>
            <a href="/bookings" className="ml-10 text-black text-xl"><span className="bg-gray-200 p-1">Bookings</span></a>
            </div> 
            <div className="content-start text-white font-mono text-left">
            <h1 className="ml-10 text-2xl text-black">Bookings</h1>
            <p className="mt-3 text-black text-sm text-gray-400 ml-10">When people accept your meeting requests, you'll see links to book meetings on this page.</p>
            </div>
            <div className="mt-10 content-start mx-auto text-black font-mono text-left">
                {bookings.map(booking => (
                    <button onClick={() => getUserData(booking)} className="bg-gray-50 underline p-2 text-lg ml-10">Yay! <span className="text-blue-600">{booking}</span> has accepted your request, click here to book a meeting now.</button>
                ))}
            </div>
        </div>
    )
}

export default Bookings;