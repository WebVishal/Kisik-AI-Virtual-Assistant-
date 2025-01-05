import VirtualAssistant from "@/components/shared/VirtualAssistant"


const Home = async () => {
    return (
        <>
            <section className="home">
                <h2 className="home-heading">
                    Kisik Virtual Teacher Assistant
                </h2>
                <div className="w-full mb-6 flex justify-center align-center">
                    <p className="text-white-600 mb-5 text-center w-[70%]">
                        Point the camera at the problem you&apos;re facing, and then press &quot;Show Me the Magic&quot; to analyze it. Wait for the solution to be generated!
                    </p>
                </div>
            </section>
            <div className="flex justify-center items-center w-full h-full">
                <VirtualAssistant />
            </div>
        </>
    )
}

export default Home