const axios = require("axios");
const pdfParse = require("pdf-parse");

const extractTextFromUrl = async (url) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const data = await pdfParse(response.data);
  return data.text;
};

module.exports = { extractTextFromUrl };
