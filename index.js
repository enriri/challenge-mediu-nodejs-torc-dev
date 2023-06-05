var https = require("https");
const { createHash } = require("crypto");
var fs = require("fs");

https.get("https://coderbyte.com/api/challenges/json/age-counting", (resp) => {
  let data = "";
  let organizedDt = [];

  resp.setEncoding("utf-8");
  resp.on("data", (chunk) => {
    data += chunk;
  });

  resp.on("end", () => {
    const dt = JSON.parse(data);

    let i = 0;

    const delimetedDt = dt.data.match(/[^,]+/g);

    while (i < delimetedDt.length) {
      const obj = {
        key: delimetedDt[i].match(/=(\w+)/)[1],
        age: delimetedDt[i + 1].match(/=(\w+)/)[1],
      };

      if (parseInt(obj.age) > 32) organizedDt.push(obj);
      i += 2;
    }

    const sha = createHash(`sha256`)
      .update(JSON.stringify(organizedDt))
      .digest(`hex`);

    fs.writeFile(
      sha + `.txt`,
      `Number of results: ${organizedDt.length} ` + JSON.stringify(organizedDt),
      () => {
        console.log(`done`);
      }
    );
  });
});
