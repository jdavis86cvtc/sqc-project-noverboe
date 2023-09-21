/***********************************************************
NOTE: If Git reports a fatal error saying either "LF will be
replaced by CRLF" or "CRLF would be replaced by LF", then
the line endings in the specified file (such as
"data/book.html") don't match your local Git repository.
You'll need to change the line endings in the specified file
to CRLF (carriage-return \r, line feed \n) or LF (line feed,
\n) in your text editor and resave the file.

This happens because Windows uses CRLF and macOS/Linux use
LF to indicate the end of the file, and Git doesn't want to
accidentally corrupt a binary file mislabelled as a text
file.
***********************************************************/

// Dependencies ////////////////////////////////////////////
import { strict as assert } from 'node:assert'
import { closeSync, openSync, readFileSync, writeFileSync }
  from 'node:fs'
import { parse } from 'node-html-parser'

// This module uses the CommonJS module format, so we need
// to import it differently.
import pkg from 'svgoban'
const { serialize } = pkg

// Configuration ///////////////////////////////////////////
const srcPath = 'data/AlicesAdventuresInWonderlandLewisCarroll.htm'
const dstPath = 'docs/generated-schema.sql'
const chapterIds = [
  'Down the Rabbit-Hole',
  'The Pool of Tears',
  'A Caucus-Race and a Long Tale',
  'The Rabbit Sends in a Little Bill',
  'Advice from a Caterpillar',
  'Pig and Pepper',
  'A Mad Tea-Party',
  'The Queen\'s Croquet-Ground',
  'The Mock Turtle\'s Story',
  'The Lobster Quadrille',
  'Who Stole the Tarts?',
  'Alice\'s Evidence'
]

const sqlHeader = `\\encoding UTF8

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

INSERT INTO chapters (title, body) VALUES
`

const gobanConfig = {
  size: 19,
  theme: 'classic',
  coordSystem: 'A1',
  noMargin: false,
  hideMargin: false
}

// Utility functions ///////////////////////////////////////
const extractTitle = function (root, id) {
  const chapterElement = root.querySelector(`#${id}`);
  const title = chapterElement.querySelector('h2');
  return title
}

const extractBody = function (root, id, pruneChildrenSelector) {
  const bodyNode = root.querySelector(`#${id} .divBody`)

  if (pruneChildrenSelector) {
    const children = bodyNode.querySelectorAll(pruneChildrenSelector)
    children.forEach((child) => {
      child.remove()
    })
  }

  const calculateWordCount = (text) => {
    const words = text.split(/\s+/); // Split text by whitespace
    return words.length;
  };

  // The <img> tags point to the wrong directory, so we
  // need to change them here.
  bodyNode.querySelectorAll('img').forEach(
    (image) => {
      const oldSrc = image.getAttribute('src')
      const oldSrcTokens = oldSrc.split('/')
      const newSrc = `/images/book/${oldSrcTokens[oldSrcTokens.length - 1]}`
      image.setAttribute('src', newSrc)
    }
  )

  // Return HTML with the line endings normalized to Unix.
  bodyNode.innerHTML = bodyNode.innerHTML.replaceAll('\r\n', '\n')
  bodyNode.innerHTML = bodyNode.innerHTML.trim()
  return bodyNode
}

const extractMoves = function (output, player, moveSrc) {
  // Remove newline.
  const withDots = moveSrc.trim()

  // Remove periods.
  const clean = withDots.replaceAll('.', '')

  const lines = clean.split(', ')
  let currentLetter

  // Skip the first token.
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].indexOf(' ') >= 0) {
      const tokens = lines[i].split(' ')
      currentLetter = tokens[0]
      output[currentLetter + tokens[1]] = player
    } else {
      // The line only contains a number.
      output[currentLetter + lines[i]] = player
    }
  }
}

// Conversion //////////////////////////////////////////////
const src = readFileSync(srcPath, 'utf8')
const domRoot = parse(src)

// Remove pageNum nodes
const pageNums = domRoot.querySelectorAll('.pageNum')
pageNums.forEach(
  (element) => element.remove()
)

// Extract guide chapters.
const chapters = []

chapterIds.forEach((id, index) => {
  // Extract the title and body
  const titleElement = extractTitle(domRoot, id);
  const bodyElement = extractBody(domRoot, id);

  // Extract text content and calculate word count
  const chapterTitle = titleElement.text.trim();
  const chapterBody = bodyElement.text.trim();
  const wordCount = calculateWordCount(chapterBody);

  chapters.push({
    chapter_number: index + 1, // Chapter numbers start from 1
    chapter_title: chapterTitle,
    word_count: wordCount,
    body: chapterBody
  });
});

// Output the data as SQL.
const fd = openSync(dstPath, 'w')
writeFileSync(fd, sqlHeader)

// Insert chapter data
chapters.forEach((chapter, index) => {
  const { chapter_number, chapter_title, word_count, body } = chapter;
  const value = `(${index + 1}, '${chapter_number}', '${chapter_title}', '${word_count}', '${body}')`;
  if (index === 0) {
    writeFileSync(fd, `(${value}`);
  } else {
    writeFileSync(fd, `,\n${value}`);
  }
});


writeFileSync(fd, ';\n\n')

closeSync(fd)
