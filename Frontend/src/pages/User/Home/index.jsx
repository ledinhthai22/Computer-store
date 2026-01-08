import Suggestion from "../../../components/user/product/Suggestion";
import Slideshow from "../../../components/user/product/SlideShow";
import TopNew from "../../../components/user/product/TopNew";
export default function Home(){
    return(
        <div>
            <div className="max-w-[80%] mx-auto">
                <Slideshow />
                <TopNew />
                <Suggestion />
            </div>
        </div>
    );
}