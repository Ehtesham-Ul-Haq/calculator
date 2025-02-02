import Script from "next/script";

const AdsterraBanner = () => {
  return (
    <div>
      {/* Adsterra Script */}
      <Script
        strategy="afterInteractive"
        async
        data-cfasync="false"
        src="//pl25751111.profitablecpmrate.com/ce6719f2a85ba1d667d67997aa08266d/invoke.js"
      />
      
      {/* Ad Container */}
      <div id="container-ce6719f2a85ba1d667d67997aa08266d"></div>
    </div>
  );
};

export default AdsterraBanner;
