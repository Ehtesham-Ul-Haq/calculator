import Script from "next/script";
import { useEffect } from "react";

const AdsterraBanner = () => {
  useEffect(() => {
    window.atOptions = {
      key: "4708cf0c1a8875deb6d6645665bcb8eb",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };
  }, []);

  return (
    <div>
      {/* Adsterra Ad Script */}
      <Script
        strategy="afterInteractive"
        src="//www.highperformanceformat.com/4708cf0c1a8875deb6d6645665bcb8eb/invoke.js"
      />
      
      {/* Ad Container */}
      <div id="container-4708cf0c1a8875deb6d6645665bcb8eb"></div>
    </div>
  );
};

export default AdsterraBanner;
