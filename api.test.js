/*
Jest tests for API endpoints in server.js
*/

const request = require('supertest');
const server = require('./server');

// Test to check if all articles are returned sorted by date
describe('GET /articles', () => {
  test('should return all articles sorted by date', async () => {
    const response = await request(server).get('/articles');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    const dates = response.body.map(article => article.date);
    expect(dates).toEqual(dates.sort().reverse());
    expect(typeof response.body[0].date).toBe('string');
  });
});

// Test to check if articles are returned by category
describe('GET /articles/category/:category', () => {
  test('should return articles by category', async () => {
    const response = await request(server).get('/articles');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].category).toBe('Constitucional');
  });
});

// Test to check if articles are returned by keyword search
describe('GET /articles/search/:keyword', () => {
  test('should return articles by keyword', async () => {
    const response = await request(server).get('/articles/search/lorem');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    const hasKeyword = response.body.every(article => {
      return article.title.toLowerCase().includes('lorem') || article.content.toLowerCase().includes('lorem');
    });
    expect(hasKeyword).toBe(true);
  });
});

// Test to check if error is returned when an invalid category is requested
describe('GET /articles/category/:category', () => {
  it('should return an error message with the invalid category when an invalid category is provided', async () => {
    const invalidCategory = 'invalidCategory';
    const response = await request(server).get(`/articles/category/${invalidCategory}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(`Invalid category: ${invalidCategory}`);
  });
});
