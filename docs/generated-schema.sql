\encoding UTF8

DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS chapter;

CREATE TABLE book (
  id SERIAL PRIMARY KEY,
  book_id INT NOT NULL,
  book_name VARCHAR(200) NOT NULL
);

CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  book_id INT NOT NULL,
  chapter_number INT NOT NULL,
  chapter_title VARCHAR(200) NOT NULL,
  word_count INT NOT NULL
);

INSERT INTO book (book_id, book_name) VALUES (1, 'Alices Adventures in Wonderland, by Lewis Carroll');
INSERT INTO chapters (book_id, chapter_number, chapter_title, word_count) VALUES
((1, '1', 'CHAPTER I.
Down the Rabbit-Hole', '2188',
(1, '2', 'CHAPTER II.
The Pool of Tears', '2101',
(1, '3', 'CHAPTER III.
A Caucus-Race and a Long Tale', '1704',
(1, '4', 'CHAPTER IV.
The Rabbit Sends in a Little Bill', '2618',
(1, '5', 'CHAPTER V.
Advice from a Caterpillar', '2188',
(1, '6', 'CHAPTER VI.
Pig and Pepper', '2595',
(1, '7', 'CHAPTER VII.
A Mad Tea-Party', '2289',
(1, '8', 'CHAPTER VIII.
The Queen’s Croquet-Ground', '2489',
(1, '9', 'CHAPTER IX.
The Mock Turtle’s Story', '2274',
(1, '10', 'CHAPTER X.
The Lobster Quadrille', '2032',
(1, '11', 'CHAPTER XI.
Who Stole the Tarts?', '1880',
(1, '12', 'CHAPTER XII.
Alice’s Evidence', '2107';

