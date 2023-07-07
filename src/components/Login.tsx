import { OAuthPopup, TAuthTokenPayload, useOAuth2 } from "@/shared/useoath2/index";
import { useEffect, useRef, useState } from "react";



// Login component
const Login = (props : {authorizeUrl : string, clientId : string, callbackUrl : string }) => 
{
  const [accessToken, setAccessToken] = useState("");

  const { data, loading, error, getAuth, logout } = useOAuth2({
    authorizeUrl: props.authorizeUrl,
    clientId: props.clientId,
    redirectUri: props.callbackUrl,
    scope: "",
    responseType: "code",
    exchangeCodeForTokenServerURL: props.callbackUrl,
    onSuccess: (payload) => console.log("Login success", JSON.stringify(payload)),
    onError: (error_) => console.log("Error", error_)
  });

  const isLoggedIn = Boolean(data?.access_token); // or whatever...

  if (error) {
    return <div className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20">{error}</div>;
  }

  if (loading) {
    return <div className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20">Loading...</div>;
  }

  if (isLoggedIn) {
    return (
      <div>
        <button className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20" onClick={logout}>Logout</button>
      </div>
    )
  }

  return (
    <button className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20" type="button" onClick={() => getAuth()}>
      Login
    </button>
  );
};

export default Login;