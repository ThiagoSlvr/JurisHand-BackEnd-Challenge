# Jurishand Backend Challenge

This project my submssion for the Jurishand Backend Challenge, which consists of creating a RESTful API that provides information about articles related to law and generating reports based on this data.

# Part 1: Database and API

Relevant files:

- server.js
- schema.sql
- .env.example

## Description

The server allows users to retrieve all articles sorted by publication date, filter articles by category, search articles by a keyword in the title or content, retrieve articles by ID and search articles by specific authors.

## Requirements

- Node.js (version 14 or higher)
- Express.js (already in the package.json)
- dotenv (already in the package.json)
- MySQL (already in the package.json)

## Installation

1. Clone this repository
2. Install dependencies by running `npm install`
3. Create the MySQL database. 
4. Create a MySQL table and populate it by running the `schema.sql` script in your MySQL server. Example: 'source /path/to/schema.sql;'
5. Create a `.env` file based on the `.env.example` file and fill it with your MySQL server credentials.
6. Start the server by running `npm start`

## API Usage

Once the server is running, you can access the API endpoints using your browser at http://localhost:3000/articles

Examples: 

- http://localhost:3000/articles
- http://localhost:3000/articles/41
- http://localhost:3000/articles/search/risus
- http://localhost:3000/articles/category/Civil
- http://localhost:3000/articles/author/Igor%20Batista

Here are the available endpoints:

#### Query parameters

- `id`: find a specific article by its ID.
- `author`: filter articles by author name.
- `search`: filter articles by a keyword in the content or title.
- `category`: filter articles by category. Possible values: Trabalhista, Tributário, Comercial, Penal, Constitucional, Civil.

### GET /articles

Returns a list with every single of article

### GET /articles/:id

Returns a single article with the specified ID.

### GET /articles/author/:author

Generates a CSV report with information about the number of articles and average word count by category and author.

### GET /articles/search/:keyword

Returns a list of articles with the search keyword in the title or content of the article.

### GET /articles/category/:category

Returns a list of articles from that category.

## Database schema

The database has a single table called `articles` with the following columns:

| Column           | Type        |
|------------------|-------------|
| id               | INT         |
| title            | VARCHAR(255)|
| author           | VARCHAR(255)|
| content          | TEXT        |
| publication_date | DATE        |
| category         | VARCHAR(255)|


# Part 2: Python reports

Relevant files:

- report_generator.py

## Description

This script connects to the RESTful API, the script retrieves data, performs some analysis on it, and creates a CSV report containing information such as the number of articles by category, number of articles by author, and the average number of words per article for each category and author. The report is then saved with the current date and time as the filename.

## Requirements

- Python 3.x
- requests

## Usage

1. Clone the repository or download the `report_generator.py` file.
2. Install the required package by running the command `pip install requests`.
3. Make sure that the API server is running.
4. Run the script using the command `python3 report_generator.py`.
5. The report will be saved as a CSV file with the current date and time as the filename.

## Report Information

The report in its entirety has the following information:

- Autor
- Artigos totais do Autor
- Artigos Trabalhistas do autor
- Artigos Tributários do autor
- Artigos Comerciais do autor
- Artigos Penais do autor
- Artigos Constitucionais do autor
- Artigos Civis do autor
- Média total de palavras do autor
- Média de palavras de artigos Trabalhistas do autor
- Média de palavras de artigos Tributários do autor
- Média de palavras de artigos Comerciais do autor
- Média de palavras de artigos Penais do autor
- Média de palavras de artigos Constitucionais do autor
- Média de palavras de artigos Civis do autor

The whole report is in author alphabetical order, and the last line is the ‘Total’ line, which displays the Total of each column, for example: Artigos totais, Artigos Trabalhistas totais, Artigos Tributários totais, ...

After trying various other formats, I found that despite this report seeming like a lot at first, once you get to know the format, I found it to be the best format that I tried, by being very fast to find the relevant data that you may be searching for if you know where to look.


# Part 3: Testing and documentation

Relevant files:

- api.test.js
- test_report.py

## Description

These codes are a tests suites for the API endpoints defined in server.js and testing the functions in the report_generator.py file. The 'api.test.js' file test suite uses supertest to simulate HTTP requests and jest as the testing framework to verify that the server responds with the expected data for each endpoint. The 'test_report.py' file uses Pytest to test the functions of the report_generator.py file to verify if it returns the expected data for each function.

## Requirements

### api.test.js

- Jest (already in the package.json)
- supertest (already in the package.json)

### test_report.py

- Pytest

## Usage

### api.test.js

1. In this test make sure that the server is NOT currently running.
2. To run the tests, simply execute 'npm test'. Jest will automatically run all the tests in the project.

### test_report.py

1. In this one make sure that the server IS currently running.
2. To run the tests, simply execute 'pytest'. Pytest will automatically run all the tests in the project.


# Credits

This project was developed by Thiago Chim Silvera as a solution for the Jurishand Backend Challenge.
