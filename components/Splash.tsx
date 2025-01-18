'use client'

import React, { useEffect } from "react";

import Spinner from "@/components/ui/Spinner";

type SplashProps = {
  handleReady: () => void;
};

export const Splash: React.FC<SplashProps> = ({ handleReady }) => {

  useEffect(() => {

    // Set a timeout to call handleReady after a few seconds (e.g., 3 seconds)
    const timer = setTimeout(() => {
      handleReady();
    }, 3000); // 3000 milliseconds = 3 seconds

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [handleReady]);


  return (
    <main className="w-full flex items-center justify-center bg-primary-200 p-4 bg-[length:auto_50%] lg:bg-auto bg-colorWash bg-no-repeat bg-right-top">
      <div className="flex flex-col gap-8 lg:gap-12 items-center max-w-full lg:max-w-3xl">
        <Spinner size='large' />
        <p>Please Wait...</p>
      </div>
    </main>
  );
};


export default Splash;
