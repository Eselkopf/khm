import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const port = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.join(__dirname, 'dist')

function getContentType(filePath) {
  const ext = path.extname(filePath)
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8'
    case '.js':
      return 'application/javascript; charset=utf-8'
    case '.css':
      return 'text/css; charset=utf-8'
    case '.svg':
      return 'image/svg+xml'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.json':
      return 'application/json; charset=utf-8'
    default:
      return 'application/octet-stream'
  }
}

const server = http.createServer((request, response) => {
  let requestedPath = request.url.split('?')[0]
  if (requestedPath === '/') requestedPath = '/index.html'

  const filePath = path.join(distDir, requestedPath)

  fs.readFile(filePath, (error, data) => {
    if (error) {
      // SPA fallback to index.html
      const indexPath = path.join(distDir, 'index.html')
      fs.readFile(indexPath, (idxErr, idxData) => {
        if (idxErr) {
          response.statusCode = 404
          response.end('Resource not found!')
          return
        }
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.end(idxData)
      })
      return
    }
    response.setHeader('Content-Type', getContentType(filePath))
    response.end(data)
  })
})

server.listen(port, () => {
  console.log(`Server started at ${port}`)
})