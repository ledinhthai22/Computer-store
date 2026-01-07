import Header from "../components/user/Header";
import NavBar from "../components/user/NavBar";
import Footer from "../components/user/Footer";
import { ToastProvider } from "../contexts/ToastContext";
import { Outlet } from "react-router-dom";
export default function UserLayout(){
        return(
            <ToastProvider>
                <Header/>
                <NavBar/>
                <Outlet/>
                <Footer/>
            </ToastProvider>
        )
}