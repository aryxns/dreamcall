import './App.css';
import HomePage from "./components/HomePage";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from "./components/Main";
import Requests from "./components/Requests";
import Bookings from "./components/Book";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Switch>
        <Route path="/" component={HomePage} exact/>
        <Route path="/home" component={Main} />
        <Route path="/requests" component={Requests} />
        <Route path="/bookings" component={Bookings} />
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
