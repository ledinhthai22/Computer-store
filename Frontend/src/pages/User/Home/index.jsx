import HomeProduct from "../../../components/user/product/HomeProduct";
import Slideshow from "../../../components/user/product/SlideShow";
import TopNew from "../../../components/user/product/TopNew";
import BestSeller from "../../../components/user/product/BestSeller";

export default function Home(){
    return(
        <div className="bg-stone-100 min-h-screen">
            <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 pt-4 pb-8 lg:pt-8 lg:pb-12 flex flex-col gap-4 lg:gap-8">
                <section>
                    <Slideshow />
                </section>

                <section>
                    <BestSeller />
                </section>
                
                <section>
                    <TopNew />
                </section>
                
                <section>
                    <HomeProduct />
                </section>
            </div>
        </div>
    );
}