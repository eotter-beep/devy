enumerate(".devy", { type: "devy-code", debugger: memoryview });
const langFile = fetch("./lang.js").then(response => response.text());
const tokenizeFile = fetch("./tokenize.js").then(response => response.text());
