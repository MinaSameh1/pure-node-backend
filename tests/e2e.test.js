import test from 'node:test';
import assert from 'node:assert';
import * as http from 'http';

test('e2e', async (t) => {
  t.before(async () => {
    return new Promise((resolve, reject) => {
      const options = {
        'method': 'POST',
        'hostname': 'localhost',
        'port': 8000,
        'path': '/book',
        'headers': {
          'Content-Type': 'application/json'
        },
        'maxRedirects': 20
      };

      const req = http.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function (chunk) {
          const body = Buffer.concat(chunks);
          console.log(body.toString());
          resolve()
        });

        res.on("error", function (error) {
          console.error(error);
          reject(error)
        });
      });

      const postData = JSON.stringify({
        "title": "test",
        "author": "node test",
        "isbn": Math.floor(Math.random() * 1000000000000),
        "avaliable_quantity": Math.random() * 100,
        "shelf_location": "5a"
      });

      req.write(postData);

      req.end();
    })
  })

  await t.test('Get Request', async (t) => {
    http.get('http://localhost:8000/book', res => {
      let rawData = ''

      res.on('data', chunk => {
        rawData += chunk
      })

      res.on('end', () => {
        const response = JSON.parse(rawData)
        assert.notStrictEqual(response.total, 0)
        assert.notStrictEqual(response.pages, 0)
        assert.notStrictEqual(response.data, [])
        assert.notStrictEqual(response.data.length, 0)
      })

    })
  })
});
