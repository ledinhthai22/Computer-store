import Header from "../components/user/Header";
import NavBar from "../components/user/NavBar";
import Footer from "../components/user/Footer";
import { Outlet } from "react-router-dom";
export default function UserLayout(){
        return(
            <>
                <Header/>
                <NavBar/>
                <Outlet/>
                <Footer/>
            </>
        )
}