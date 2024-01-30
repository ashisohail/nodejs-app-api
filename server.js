const fs = require("fs/promises");
const http = require("http");
// const url = require("url");

const server = http.createServer((request, response) => {
  const { method, url } = request;

  //Get Method
  if (method === "GET" && url === "/") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;
    response.write(JSON.stringify({ message: "Hello world!" }));
    response.end();
  }
  if (method === "GET" && url === "/recipies") {
    fs.readFile("./db.json", "utf8").then((recipies) => {
      const parsedRecipies = JSON.parse(recipies);
      response.setHeader("Content-Type", "application/json");
      response.statusCode = 200;
      response.write(JSON.stringify({ recipies: parsedRecipies }));
      response.end();
    });
  }

  //Post Method
  if (method === "POST" && url === "/recipies") {
    let body = "";
    request.on("data", (packet) => {
      body += packet.toString();
    });
    request.on("end", () => {
      const newRecipie = JSON.parse(body);

      console.log("newRecipie", newRecipie);

      fs.readFile("./db.json", "utf-8")
        .then((recipies) => {
          const parsedRecipies = JSON.parse(recipies);
          parsedRecipies.recipies.push(newRecipie);
          fs.writeFile("./db.json", JSON.stringify(parsedRecipies));
        })
        .then(() => {
          response.statusCode = 201;
          response.setHeader("Content-Type", "application/jason");
          response.write(JSON.stringify({ recipies: newRecipie }));
          response.end();
        });
    });
  }
});

server.listen(5000, (err) => {
  if (err) console.log(err);
  else console.log("Server is running on PORT 5000.");
});
