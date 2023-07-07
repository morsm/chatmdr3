import { useEffect, useRef, useState } from "react";
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import Script from 'next/script';
import * as dotenv from "dotenv";

declare function closePopup(accessToken: any, idToken: any, state: any ): any;

// Callback for login page. Gets called for token exchange

interface TokenParams
{
    id_token: string,
    access_token: string,
    state: string
}

export const getServerSideProps: GetServerSideProps<TokenParams> = async (context) =>
{
    const isCodeFlow = (context.query.code as string) || false;
    const isTokenFlow = (context.query.access_token as string) || false;

    if (! (isCodeFlow || isTokenFlow))
    {
        console.log("/callback not called for either code or access flow")
    }

    // Get environment variables
    dotenv.config();

    var props: TokenParams = { id_token: "", access_token: "", state: context.query.state as string };

    if (isCodeFlow)
    {
        const authHeaderBase64 = Buffer.from(`${process.env.AWS_COGNITO_CLIENT}:${process.env.AWS_COGNITO_CLIENT_SECRET}`).toString("base64");
        const callbackUrl = encodeURI(process.env.OAUTH2_CALLBACK_URL as string);
        
        var res = await fetch(
            process.env.AWS_TOKEN_URL as string,
            { 
                method: "POST", 
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${authHeaderBase64}`
                },
                body: `grant_type=authorization_code&redirect_uri=${callbackUrl}&code=${isCodeFlow}&client_id=${process.env.AWS_COGNITO_CLIENT}`
            }
        );

        if (res.ok)
        {
            const data = await res.json();

            props.id_token = data?.id_token;
            props.access_token = data?.access_token;
        }
        else
        {
            const body = await res.text();
            console.log(`Error in code flow: ${res.status} (${res.statusText}), body: ${body}`);
        }
    }

    const retVal: GetServerSidePropsResult<TokenParams> = { props: props};
    return retVal;
}

export default function Callback(params: TokenParams) {
    const [accessToken, setAccessToken] = useState("");
    const [idToken, setIdToken] = useState("");
  
    const ref = useRef();

    if (params.access_token && (! accessToken) ) 
    {
        setIdToken(params.id_token);
        setAccessToken(params.access_token);

        // State change will trigger a re-render

    }
    else
    if (accessToken) return(<Script src="/loginComplete.js" onLoad={ () => closePopup(accessToken, idToken, params.state) }/>)
    else return (
      <main className="overflow-hidden w-full h-screen relative flex">
        <div className="dark hidden flex-shrink-0 bg-gray-900 md:flex md:w-[260px] md:flex-col">
          <div className="flex h-full min-h-0 flex-col ">
            <p>Error logging in</p>
          </div>
        </div>
      </main>
    );
  }
  