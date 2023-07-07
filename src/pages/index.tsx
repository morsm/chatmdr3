import { useEffect, useRef, useState, useCallback } from "react";
import Login from "@/components/Login";
import Chat from "@/components/Chat";
import MobileSiderbar from "@/components/MobileSidebar";
import Sidebar from "@/components/Sidebar";
import type { InferGetStaticPropsType, GetStaticProps, GetStaticPropsResult } from 'next';
import * as dotenv from "dotenv";

type LoginUrls =
{
  authorizeUrl: string,
  clientId: string,
  callbackUrl: string
}

// Server-side code to get references to AWS login pages
export const getStaticProps: GetStaticProps<LoginUrls> = () => 
{
  // Get  environment variables
  dotenv.config();

  const loginUrls : LoginUrls = {
      authorizeUrl: process.env.AWS_LOGIN_URL as string,
      clientId: process.env.AWS_COGNITO_CLIENT as string,
      callbackUrl: process.env.OAUTH2_CALLBACK_URL as string
  };

  return {props: loginUrls };
}

export default function Home(loginUrls : InferGetStaticPropsType<typeof getStaticProps>) {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
 
  const ref = useRef();

  const toggleComponentVisibility = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const clearChat = async (e: any) => {
      if (ref.current) ref.current.log();
  };


  return (
    <main className="overflow-hidden w-full h-screen relative flex">
      {isComponentVisible ? (
        <div>
          <Login authorizeUrl={loginUrls.authorizeUrl} clientId={loginUrls.clientId} callbackUrl={loginUrls.callbackUrl} />
          <MobileSiderbar toggleComponentVisibility={toggleComponentVisibility} />
        </div>
      ) : null}
      <div className="dark hidden flex-shrink-0 bg-gray-900 md:flex md:w-[260px] md:flex-col">
        <div className="flex h-full min-h-0 flex-col ">
          <Login authorizeUrl={loginUrls.authorizeUrl} clientId={loginUrls.clientId} callbackUrl={loginUrls.callbackUrl} />
          <Sidebar onNewChat={clearChat} />
        </div>
      </div>
      <Chat ref={ref} toggleComponentVisibility={toggleComponentVisibility} />
    </main>
  );
}
