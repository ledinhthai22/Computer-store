import SideBar from "../components/user/ui/SideBar";
import { Outlet } from "react-router-dom";
import { ToastProvider } from "../contexts/ToastContext";

export default function ProfileLayout() {
    return (
        <ToastProvider>
            <div className="flex min-h-screen bg-gray-50">
                <div className="flex-shrink-0">
                    <SideBar />
                </div>
                <main className="flex-1 bg-white min-h-screen border-l border-gray-200">
                    
                    <div className="p-8 w-full max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}