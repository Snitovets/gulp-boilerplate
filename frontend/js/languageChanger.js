function toEnglish() {
  setCookie("lang", "en");
  btn.lang.className = "btn-lang en";
  btn.lang.textContent = "EN";
  document.title =
    "Poonkt · Cryptocurrency Exchange · Buy and Sell BTC, ETH, BCH, LTC";
  document.documentElement.lang = "en-US";
}

function toRussian() {
  setCookie("lang", "ru");
  btn.lang.className = "btn-lang ru";
  btn.lang.textContent = "RU";
  document.title =
    "Poonkt · Биржа Криптовалют · Купить или Продать BTC, ETH, BCH, LTC";
  document.documentElement.lang = "ru";
}

function toUkrainian() {
  setCookie("lang", "ua");
  btn.lang.className = "btn-lang ua";
  btn.lang.textContent = "UA";
  document.title =
    "Poonkt · Біржа Криптовалют · Купити або Продати BTC, ETH, BCH, LTC";
  document.documentElement.lang = "ua";
}
