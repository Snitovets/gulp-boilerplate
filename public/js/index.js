document.addEventListener("DOMContentLoaded", cookieChecker);

function cookieChecker() {
  switch (getCookie("lang")) {
    case "en":
      toEnglish();
      break;
    case "ru":
      toRussian();
      break;
    case "ua":
      toUkrainian();
      break;
    default:
      toEnglish();
      break;
  }
}

function getCookie(name) {
  var matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    expires: -1
  });
}

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

document.addEventListener("DOMContentLoaded", menuHandler);

let btn = {};
let languages = ["en", "ru", "ua"];

function menuHandler() {
  btn.lang = document.getElementsByClassName("btn-lang")[0];
  btn.droplist = document.getElementsByClassName("btn-lang-droplist")[0];

  document.onclick = e => {
    btn.target = e.target;

    if (
      btn.target.classList.contains("btn-lang") &&
      !btn.target.classList.contains("active")
    ) {
      btn.lang.classList.add("active");

      let droplist = languages
        .map(item => {
          if (item !== getCookie("lang")) return item;
          else return;
        })
        .filter(Boolean)
        .sort();

      let ul = document.createElement("ul");
      ul.className = "lang-list";

      for (let i = 0; i < droplist.length; i++) {
        let li = document.createElement("li");
        li.className = droplist[i];
        li.textContent = droplist[i].toUpperCase();
        ul.appendChild(li);
      }

      btn.droplist.appendChild(ul);
    } else {
      btn.lang.classList.remove("active");
      btn.droplist.removeChild(btn.droplist.firstChild);
    }

    if (btn.target.classList == "en") {
      toEnglish();
    } else if (btn.target.classList == "ru") {
      toRussian();
    } else if (btn.target.classList == "ua") {
      toUkrainian();
    }
  };
}
