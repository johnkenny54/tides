import { hdom } from "@htmltools/hdom";

// Set path relative to root.
const reg = await navigator.serviceWorker.register("/js/sw.js");

console.log(reg);

const resp = await fetch(
  "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=20250801&end_date=20250831&station=9414816&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json",
);
console.log(await resp.json());

const b = hdom.getElement("body");
hdom.setElementText(b, "123");
