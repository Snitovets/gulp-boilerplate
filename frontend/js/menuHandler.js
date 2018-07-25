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
