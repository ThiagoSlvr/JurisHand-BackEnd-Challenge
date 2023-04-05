# The purpose of this code is to connect to a RESTful API that provides legal article data stored in a MySQL database. 
# The script retrieves this data, performs some analysis on it, and creates a CSV report containing information such as the number of articles by category, 
# number of articles by author, and the average number of words per article for each category and author. 
# The report is then saved with the current date and time as the filename.
# The report in its entirety has the following information:
# Autor, Artigos totais do Autor, Artigos Trabalhistas do autor, Artigos Tributários do autor, Artigos Comerciais do autor, Artigos Penais do autor, Artigos Constitucionais do autor, Artigos Civis do autor, Média total de palavras do autor, Média de palavras de artigos Trabalhistas do autor, Média de palavras de artigos Tributários do autor, Média de palavras de artigos Comerciais do autor, Média de palavras de artigos Penais do autor, Média de palavras de artigos Constitucionais do autor, Média de palavras de artigos Civis do autor


import requests
import csv
from datetime import datetime
from operator import add
import math

# Define the base URL of the API
base_url = 'http://localhost:3000'

# Define the categories of articles
categories = ['Trabalhista', 'Tributário', 'Comercial', 'Penal', 'Constitucional', 'Civil']
categories_plural = ['Trabalhistas', 'Tributários', 'Comerciais', 'Penais', 'Constitucionais', 'Civis']

# Define a function to retrieve all articles from the API
def get_all_articles():
    url = base_url + '/articles'
    response = requests.get(url)
    return response.json()

# Define a function to calculate the number of articles by category for a given author
def get_articles_by_category(author, articles):
    count_by_category = {category: 0 for category in categories}
    for article in articles:
        if article['author'] == author:
            count_by_category[article['category']] += 1
    return list(count_by_category.values())

# Define a function to calculate the number of articles by author for a given category
def get_articles_by_author(category, articles):
    count_by_author = {}
    for article in articles:
        if article['category'] == category:
            if article['author'] not in count_by_author:
                count_by_author[article['author']] = 1
            else:
                count_by_author[article['author']] += 1
    return list(count_by_author.values())

# Define a function to calculate the average number of words by article for a given author and category
def get_average_words(author, articles, category=''):
    word_counts = []
    for article in articles:
        if category != '':
            if article['author'] == author and article['category'] == category:
                content = article['content']
                words = content.split()
                word_count = len(words)
                word_counts.append(word_count)
        else:
            if article['author'] == author:
                content = article['content']
                words = content.split()
                word_count = len(words)
                word_counts.append(word_count)
    if len(word_counts) == 0:
        return 0
    else:
        return int(sum(word_counts) / len(word_counts))

# Updates the average value given a new value and the current average and count.
def add_avg(avg, n, l):
    if n != 0:
        l += 1
        avg = (avg + ((n-avg) / l))
    return avg, l


# Retrieve all articles from the API
articles = get_all_articles()

# Create the CSV report
with open(f'relatório_{datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)

    # Write the header row
    header_row = ['Autor']
    header_row.append('Artigos totais do Autor')
    for category in categories_plural:
        header_row.append(f'Artigos {category} do autor')
    header_row.append('Média total de palavras do autor')
    for category in categories_plural:
        header_row.append(f'Média de palavras de artigos {category} do autor')
    writer.writerow(header_row)

    # Write the data rows
    total_row = [0]*14
    avg_len = [0]*7
    for author in sorted(set([article['author'] for article in articles])):
        row = [author]
        articles_by_category = get_articles_by_category(author, articles)
        row += articles_by_category
        row.insert(1, (sum(articles_by_category)))
        for category in categories:
            row.append(get_average_words(author, articles, category))
        row.insert(8, (get_average_words(author, articles)))
        total_row[:7] = list(map(add, total_row[:7], row[1:8]))
        total_row[7:], avg_len = (zip(*map(add_avg, total_row[7:], row[8:], avg_len)))
        writer.writerow(row)
    total_row[7:] = list(map(math.floor, total_row[7:]))
    total_row.insert(0, 'Total')
    writer.writerow(total_row)