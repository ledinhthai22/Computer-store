import Suggestion from "../../../components/user/product/Suggestion";
import Slideshow from "../../../components/user/product/SlideShow";
import TopNew from "../../../components/user/product/TopNew";

export default function Home(){
    return(
        <div className="bg-stone-200 min-h-screen py-4">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex flex-col gap-4">
                <section>
                    <Slideshow />
                </section>
                
                <section>
                    <TopNew />
                </section>
                
                <section>
                    <Suggestion />
                </section>
            </div>
        </div>
    );
}