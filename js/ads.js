/* Google AdSense is the web-compatible equivalent of AdMob. */
const ADSENSE_CLIENT = "ca-pub-6100500969409412";
const NOTES_AD_SLOT = "2150901012";

function loadAdSense() {
  if (!ADSENSE_CLIENT || document.querySelector('script[data-adsense="notes"]')) return;

  const script = document.createElement("script");
  script.async = true;
  script.dataset.adsense = "notes";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

function renderNotesAd(containerId) {
  if (!ADSENSE_CLIENT || !NOTES_AD_SLOT) return;

  const container = document.getElementById(containerId);
  if (!container || container.querySelector("ins.adsbygoogle")) return;

  container.innerHTML = `
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="${ADSENSE_CLIENT}"
      data-ad-slot="${NOTES_AD_SLOT}"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>`;

  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.warn("The notes ad could not be rendered.", error);
  }
}

loadAdSense();
window.notesAds = { render: renderNotesAd };