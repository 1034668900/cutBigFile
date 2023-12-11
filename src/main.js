import { cutFile } from "./cutFile.js";
const inputFile = document.querySelector('input[type="file"]');

inputFile.onchange = async (e) => {
  const file = e.target.files[0];
  console.time("cutFileTime");
  const chunks = await cutFile(file);
  console.timeEnd("cutFileTime");
  console.log(chunks, "main");
};
