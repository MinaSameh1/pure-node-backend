import test from 'node:test';
import assert from 'node:assert';
import { bookRepository } from '../src/db/book.repository.js'
import * as service from '../src/api/book/book.service.js'
import { HttpError } from '../src/utils/error.util.js';

const items = [
  { id: 1, title: 'test' },
  { id: 2, title: 'test' },
]

// mock the repository
bookRepository.findAll = test.mock.fn(async () => { return items });
bookRepository.findOneById = test.mock.fn(async (id) => { return items.find(item => item.id === id)});

test('book service', async (t) => {

  await t.test('getBooks', async (t) => {
    const books = await service.getAllBooks();
    assert.strictEqual(books.length > 0, true);
    assert.strictEqual(bookRepository.findAll.mock.calls.length, 1)
  });

  await t.test('getBook', async (t) => {
    const book = await service.getBookById(1);
    assert.strictEqual(book.id, 1);
    assert.strictEqual(bookRepository.findOneById.mock.calls.length, 1)
  });

  await t.test('should throw on Invalid ID', async () => {
    assert.rejects(async () => { return await service.getBookById(5); }, HttpError)
    assert.strictEqual(bookRepository.findOneById.mock.calls.length, 2)
  });

  test.mock.reset()
});
