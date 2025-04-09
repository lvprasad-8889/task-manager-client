// socket.js
import { io } from "socket.io-client";
import useStore from "./useStore";

let state = useStore.getState();
let connect = !state.isAuthenticated || !state.user.id;
let socket;

let prod = process.env.NODE_ENV !== 'development';
if (!connect) {
  socket = io(prod ? "wss://task-managers-server-12a74ec3356d.herokuapp.com/" : "http://localhost:3000"); // Replace with your backend URL
}

export default socket;
