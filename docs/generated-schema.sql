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

INSERT INTO book (book_id, book_name) VALUES (1, 'Alice\'s Adventures in Wonderland, by Lewis Carroll');
INSERT INTO chapters (book_id, chapter_number, chapter_title, word_count, body) VALUES
((1, '1', 'undefined', '5', 'undefined'),
(2, '2', 'undefined', '6', 'undefined'),
(3, '3', 'undefined', '8', 'undefined'),
(4, '4', 'undefined', '9', 'undefined'),
(5, '5', 'undefined', '6', 'undefined'),
(6, '6', 'undefined', '5', 'undefined'),
(7, '7', 'undefined', '5', 'undefined'),
(8, '8', 'undefined', '5', 'undefined'),
(9, '9', 'undefined', '6', 'undefined'),
(10, '10', 'undefined', '5', 'undefined'),
(11, '11', 'undefined', '6', 'undefined'),
(12, '12', 'undefined', '4', 'undefined');

