import { useState, useEffect } from 'react'
import './App.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { Card } from 'antd';

export default function App() {
const [posts, setPosts] = useState([]);
const [country, setCountry] = useState([]);
const [latitude, setLatitude] = useState(0);
const [longitude, setLongitude] = useState(0);
const [showMap, setShowMap] = useState(false);

const { Meta } = Card;

const fetchIP  = async () => {
  try {
    const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
    const data = await res.json();
    setPosts(data);
  } catch (err) {
    console.log(err);
  }
}

const fetchAddCountry = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,capital,timezones,altSpellings");
  const data = await res.json();
  setCountry(data);
}

useEffect(() => {
  fetchIP()}, [])

useEffect(() => {
  fetchAddCountry()}, [])

// useEffect(() => {
//   if (signal) {
//     fetchAddCountry();
//   }
// }, [signal]);

const filteredArray = country.filter((item) => item.altSpellings.includes(posts.location?.country))

const date = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate(),
  new Date().getHours(),
  new Date().getMinutes()
);
const todayResult = date.toLocaleDateString("en-GB", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const fetchCoordinates = () => {
  setTimeout (() => {
  setLatitude(posts.location.lat);
  setLongitude(posts.location.lng);
  setShowMap(true);
  }, 1000)
}
console.log(longitude,latitude);
  return (
    <>
    <div className="container" style={{display: "flex", height: "100vh", justifyContent: "center", alignItems: "center"}}>
      <div className="container2" style={{display: "flex", flexDirection: "column"}}>
    <Card
    hoverable
    className="ipCard"
    style={{width: 300, background: "rgb(49 48 48 / 75%)", color: "white", margin: "5%"}}
    >
    <h1>Your IP Address is: <br/> {posts.ip} </h1>
    </Card>

    {filteredArray.map((item, index) =>
        <Card
        key={index}
        hoverable
        className="countryCard"
        style={{width: 350, background: "rgb(49 48 48 / 75%)", color: "white", margin: "5%"}}
    cover={<img src={item.flags.svg} alt={item.name.common}/>}
    >
    <Meta style={{color: "white"}} title={item.name.common} description={
      <>
      Capital: {item.capital} <br/> Current Date and Time: {todayResult}
    </>  
    }
      />
    </Card>
    )}
    </div>
{/* // Map */}
{fetchCoordinates()}
{showMap &&
(<MapContainer center={[latitude, longitude]} zoom={13} className="map" scrollWheelZoom={false} style={{height: "400px",width: "25%", borderStyle: "solid", borderColor: "black", margin: "5%", borderRadius: "20px"}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          What are you doing here??? 
        </Popup>
      </Marker>
    </MapContainer>)}
    </div>
    </>
  )
}
