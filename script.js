(function () {
  "use strict";

  // 2026 figures from the Doctor Taller ranking. Display strings match the article.
  var PLAYERS = [
    { name: "Konstantin Veretynskiy", meta: "Goalkeeper, Belarus", cm: 210, display: "6'10.7\"" },
    { name: "Kjell Scherpen", meta: "Goalkeeper, Netherlands", cm: 206, display: "6'9\"" },
    { name: "Isaak Touré", meta: "Center-back, France", cm: 206, display: "6'9\"" },
    { name: "Denys Tvardovskyi", meta: "Goalkeeper, Ukraine", cm: 206, display: "6'9\"" },
    { name: "Kyle Hudlin", meta: "Striker, England", cm: 206, display: "6'9\"" },
    { name: "Kevin Gadellaa", meta: "Goalkeeper, Netherlands", cm: 206, display: "6'9\"" },
    { name: "Florian Wiegele", meta: "Goalkeeper, Austria", cm: 205, display: "6'8.7\"" },
    { name: "Lucas Bergström", meta: "Goalkeeper, Finland", cm: 205, display: "6'8.7\"" },
    { name: "Pape Sy", meta: "Goalkeeper, Senegal", cm: 203, display: "6'8\"" },
    { name: "Dan Burn", meta: "Center-back, England", cm: 201, display: "6'7.1\"" }
  ];
  var PRO_AVERAGE = { name: "Average pro outfield player", meta: "For reference", cm: 181, display: "5'11.3\"" };

  var CM_PER_INCH = 2.54;
  var MIN_CM = 91;
  var MAX_CM = 244;
  var SCALE_MIN = 140; // bar widths start here so differences are visible
  var TIE_CM = 0.35;   // heights this close count as the same (covers rounding in the listed figures)

  var unit = "imperial";
  var userCm = null;

  var lineup = document.getElementById("lineup");
  var verdict = document.getElementById("verdict");
  var errorEl = document.getElementById("error");
  var feetEl = document.getElementById("feet");
  var inchesEl = document.getElementById("inches");
  var cmEl = document.getElementById("cm");

  function toFeetInches(cm) {
    var totalInches = cm / CM_PER_INCH;
    var feet = Math.floor(totalInches / 12);
    var inches = Math.round((totalInches - feet * 12) * 10) / 10;
    if (inches >= 12) { feet += 1; inches = 0; }
    return feet + "'" + (inches % 1 === 0 ? inches.toFixed(0) : inches.toFixed(1)) + "\"";
  }

  function inchesText(diffCm) {
    var inches = Math.round((diffCm / CM_PER_INCH) * 10) / 10;
    return (inches % 1 === 0 ? inches.toFixed(0) : inches.toFixed(1)) + (inches === 1 ? " inch" : " inches");
  }

  function widthFor(cm) {
    var max = Math.max(215, userCm || 0);
    var pct = ((cm - SCALE_MIN) / (max - SCALE_MIN)) * 100;
    return Math.max(4, Math.min(100, pct));
  }

  function buildRow(entry, rankText, extraClass) {
    var li = document.createElement("li");
    li.className = "row" + (extraClass ? " " + extraClass : "");

    var rank = document.createElement("span");
    rank.className = "rank";
    rank.textContent = rankText;
    li.appendChild(rank);

    var track = document.createElement("div");
    track.className = "track";

    var bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = widthFor(entry.cm) + "%";
    track.appendChild(bar);

    var label = document.createElement("div");
    label.className = "label";

    var name = document.createElement("span");
    name.className = "name";
    name.textContent = entry.name;
    var meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = entry.meta;
    name.appendChild(meta);

    var height = document.createElement("span");
    height.className = "height";
    height.textContent = entry.display + " ";
    var small = document.createElement("small");
    small.textContent = "(" + (entry.cm / 100).toFixed(2) + " m)";
    height.appendChild(small);

    label.appendChild(name);
    label.appendChild(height);
    track.appendChild(label);
    li.appendChild(track);
    return li;
  }

  function render() {
    lineup.innerHTML = "";
    var entries = PLAYERS.map(function (p, i) { return { data: p, rank: String(i + 1), cls: "" }; });
    entries.push({ data: PRO_AVERAGE, rank: "", cls: "reference" });

    if (userCm !== null) {
      // If you match a listed height, show it the same way the list does.
      var match = PLAYERS.concat([PRO_AVERAGE]).filter(function (p) { return Math.abs(p.cm - userCm) <= TIE_CM; })[0];
      var you = { name: "You", meta: "Your height", cm: userCm, display: match ? match.display : toFeetInches(userCm) };
      var r = rankInfo();
      var youRank = r.rank <= 10 ? (r.tied ? "T" + r.rank : String(r.rank)) : "";
      // Players at the same height are listed ahead of you.
      var insertAt = 0;
      while (insertAt < entries.length && entries[insertAt].data.cm >= userCm - TIE_CM) { insertAt++; }
      entries.splice(insertAt, 0, { data: you, rank: youRank, cls: "you" });
    }

    entries.forEach(function (e) {
      lineup.appendChild(buildRow(e.data, e.rank, e.cls));
    });
  }

  function rankInfo() {
    var ahead = PLAYERS.filter(function (p) { return p.cm > userCm + TIE_CM; }).length;
    var tied = PLAYERS.some(function (p) { return Math.abs(p.cm - userCm) <= TIE_CM; });
    return { rank: ahead + 1, tied: tied };
  }

  function updateVerdict() {
    var tallest = PLAYERS[0];
    var tenth = PLAYERS[PLAYERS.length - 1];
    var r = rankInfo();
    if (userCm > tallest.cm + TIE_CM) {
      verdict.textContent = "You'd be the tallest active pro in the world, " + inchesText(userCm - tallest.cm) + " taller than Konstantin Veretynskiy.";
    } else if (r.rank <= 10) {
      verdict.textContent = r.tied
        ? "You'd tie for number " + r.rank + " in the top 10."
        : "You'd make the top 10 at number " + r.rank + ".";
    } else {
      var msg = "You're " + inchesText(tenth.cm - userCm) + " short of the top 10";
      if (Math.abs(userCm - PRO_AVERAGE.cm) <= TIE_CM) {
        msg += ", right at the height of the average pro outfield player.";
      } else if (userCm > PRO_AVERAGE.cm) {
        msg += ", but taller than the average pro outfield player.";
      } else {
        msg += " and " + inchesText(PRO_AVERAGE.cm - userCm) + " below the average pro outfield player.";
      }
      verdict.textContent = msg;
    }
  }

  function readHeight() {
    if (unit === "imperial") {
      var feet = parseFloat(feetEl.value);
      var inches = inchesEl.value === "" ? 0 : parseFloat(inchesEl.value);
      if (isNaN(feet) || isNaN(inches) || inches < 0 || inches >= 12) return null;
      return (feet * 12 + inches) * CM_PER_INCH;
    }
    var cm = parseFloat(cmEl.value);
    return isNaN(cm) ? null : cm;
  }

  function compare() {
    var cm = readHeight();
    if (cm === null || cm < MIN_CM || cm > MAX_CM) {
      errorEl.textContent = unit === "imperial"
        ? "Enter a height between 3 and 8 feet, with inches from 0 to 11.9."
        : "Enter a height between 91 and 244 centimeters.";
      return;
    }
    errorEl.textContent = "";
    userCm = Math.round(cm * 10) / 10;
    render();
    updateVerdict();
  }

  function setUnit(next) {
    if (next === unit) return;
    var current = readHeight();
    unit = next;
    document.querySelectorAll(".unit").forEach(function (btn) {
      btn.setAttribute("aria-checked", String(btn.dataset.unit === unit));
    });
    document.getElementById("imperial-fields").hidden = unit !== "imperial";
    document.getElementById("metric-fields").hidden = unit !== "metric";
    if (current !== null && current >= MIN_CM && current <= MAX_CM) {
      if (unit === "metric") {
        cmEl.value = Math.round(current * 2) / 2;
      } else {
        var total = current / CM_PER_INCH;
        var f = Math.floor(total / 12);
        var i = Math.round((total - f * 12) * 2) / 2;
        if (i >= 12) { f += 1; i = 0; }
        feetEl.value = f;
        inchesEl.value = i;
      }
    }
    errorEl.textContent = "";
  }

  document.querySelectorAll(".unit").forEach(function (btn) {
    btn.addEventListener("click", function () { setUnit(btn.dataset.unit); });
  });
  document.getElementById("compare").addEventListener("click", compare);
  [feetEl, inchesEl, cmEl].forEach(function (el) {
    el.addEventListener("keydown", function (e) { if (e.key === "Enter") compare(); });
  });

  render();
})();
