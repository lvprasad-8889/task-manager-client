// socket.js
import { io } from "socket.io-client";
import useStore from "./useStore";

let state = useStore.getState();
let connect = state.isAuthenticated;
let socket;

let prod = process.env.NODE_ENV !== "development";
socket = io(
  prod
    ? "wss://task-manager-server-fg2v.onrender.com/"
    : "http://localhost:3000"
); // Replace with your backend URL

export default socket;
