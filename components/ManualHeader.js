import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function ManualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  /**
   * @note : useEffect()
   * no dependecy array:run anytime something re-renders
   * CAREFUL with this !! Because then you can get circular render
   * blank dependency array,run once on load
   * blank dependency array, (if react strict mode is on then run twice in development mode)
   * dependencies in the array,run anytime something change in dependencies array and first renderes
   */
  useEffect(() => {
    if (isWeb3Enabled) return;
    // console.log("Hi");
    // console.log(isWeb3Enabled);
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found!");
      }
    });
  }, []);

  return (
    <>
      {account ? (
        <div>
          connected to {account.slice(0, 4) + "..." + account.slice(-4)}
        </div>
      ) : (
        <div>
          <button
            onClick={async () => {
              await enableWeb3();
              if (typeof window !== "undefined") {
                window.localStorage.setItem("connected", "injected");
              }
            }}
            disabled={isWeb3EnableLoading}
          >
            connect
          </button>
        </div>
      )}
    </>
  );
}
