import { useLayoutEffect, useState } from "react";
/* 
Update isMobile state when the window is resized
Update isMobile state when the component mounts and determine whether the user is on a mobile device by checking the user agent string and the window width
Return isMobile state as an object
*/
export default function useDeviceDetect() {
  const [isMobile, setMobile] = useState(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth || screen.width;
      setMobile(width < 800);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const userAgent = typeof window.navigator === "undefined"
      ? ""
      : navigator.userAgent;

    let mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );

    if (!mobile) {
      const width = window.innerWidth || screen.width;
      mobile = width < 800;
    }

    setMobile(mobile);
  }, []);

  return { isMobile };
}