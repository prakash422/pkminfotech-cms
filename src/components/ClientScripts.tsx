"use client"

import Script from "next/script"

export default function ClientScripts() {
  return (
    <Script 
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3361406010222956" 
      strategy="afterInteractive" 
      crossOrigin="anonymous"
    />
  )
}
