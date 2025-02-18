const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".jpg": "image/jpg",
  ".png": "image/png",
  ".js": "application/javascript",
};

const server = http.createServer((req, res) => {
  const filePath = req.url === "/" ? "/index.html" : req.url;
  const fullPath = path.join(PUBLIC_DIR, filePath);

  // Determine the content type based on the file extension
  const ext = path.extname(fullPath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File not found (404)
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(
          "<h1>404 Not Found</h1><p>The requested file was not found on this server.</p>"
        );
      } else {
        // Server error
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(
          "<h1>500 Internal Server Error</h1><p>Something went wrong.</p>"
        );
      }
    } else {
      // File found, serve it
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Static file server is running at http://localhost:${PORT}`);
});
