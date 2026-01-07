import { FaSortDown } from "react-icons/fa";
export default function About(){
    return(
        <div>
            <div className="max-w-[80%] mx-auto bg-white mb-50">
                <details className="group py-3 border-b">
                    <summary className=" list-none flex items-center cursor-pointer font-semibold">
                        1. Chính sách mua hàng  <FaSortDown className="group-open:rotate-270"/>
                    </summary>
                    <li>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia architecto culpa cupiditate aliquid cum unde tempore? Facilis vero odit commodi!
                    </li>
                    <li>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia architecto culpa cupiditate aliquid cum unde tempore? Facilis vero odit commodi!
                    </li>
                    <li>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia architecto culpa cupiditate aliquid cum unde tempore? Facilis vero odit commodi!
                    </li>
                </details>
                <details className="group py-3 border-b">
                    <summary className="list-none flex items-center cursor-pointer font-semibold">
                        2. Chính sách trả hàng  <FaSortDown className="group-open:rotate-270" />
                    </summary>
                    <li>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia architecto culpa cupiditate aliquid cum unde tempore? Facilis vero odit commodi!
                    </li>
                    <li>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia architecto culpa cupiditate aliquid cum unde tempore? Facilis vero odit commodi!
                    </li>
                    <li>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia architecto culpa cupiditate aliquid cum unde tempore? Facilis vero odit commodi!
                    </li>
                </details>
            </div>
        </div>
    );
}