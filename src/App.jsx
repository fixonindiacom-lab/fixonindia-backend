import './App.css'
import {RouterProvider} from "react-router-dom";
import router from "./Routes";
import WorkerLiveUpdater from './components/Maps/WorkerLiveUpdater';
import { useEffect } from "react";




function App() { 

    useEffect(() => {
    if (window.location.pathname === "/index.html") {
      // Redirect to the root URL
      window.location.href = "https://www.fixonindia.com/";
    }
  }, []);

  
  return (
    <>
       <WorkerLiveUpdater />
       <RouterProvider router={router}/>
       
    </>
  )
}

export default App
