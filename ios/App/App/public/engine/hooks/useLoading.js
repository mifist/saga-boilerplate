import { useState } from "react";

const useLoading = (action) => {
  const [loading, setLoading] = useState(false);
  const doAction = (...args) => {
    setLoading(true);
    return action(...args).finally(() => setLoading(false));
  };
  return [doAction, loading];
};

export default useLoading;

/** 
 *Example:

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  const fetchDevs = async () => {
    console.log("this might take some time....");
    await delay(4000);
    console.log("Done!");
  };

  const [getDev, isLoadingDev] = useLoading(fetchDevs);

  useEffect(() => {
    getDev();
  }, []);'
  
  {isLoadingDev ? "Loading Devs..." : `View Devs`}

*/