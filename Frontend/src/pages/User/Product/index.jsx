import { Link } from "react-router";
import Suggestion from "../../../components/user/Suggestion";
export default function UserProduct(){
    return(
        <div className="p-6 max-w-[80%] mx-auto ">
            <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>
            <Suggestion />
        </div>
    );
}