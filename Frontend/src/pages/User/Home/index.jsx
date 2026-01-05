import Suggestion from "../../../components/user/Suggestion";
import Slideshow from "../../../components/user/SlideShow";
import TopNew from "../../../components/user/TopNew";
export default function Home(){
    return(
        <div className="bg-stone-200">
            <div className="max-w-[80%] mx-auto">
                <Slideshow />
                <TopNew />
                <Suggestion />
            </div>
        </div>
    );
}