const fs = require("fs/promises");
const path = require("path");
const {markdownReader} = require("./markdown-reader");
const {buildPage} = require("./template");

const DST_FOLDER = './static-build/docs';
const SRC_FOLDER = './docs';
const APP_FOLDER = './app';
const DOC_NAME = 'index.html';

async function main() {
  await clearDSTFolder();
  const docs = await readDocs();
  return mapFormattedDocs(docs);
  // await writeFormattedDocs(docs);
  // await copyApp();
}

async function clearDSTFolder() {
  try {
    return await fs.rm('./static-build', { recursive: true });
  } catch (e) { }
}

async function readDocs() {
  return await readDocDir(SRC_FOLDER);
}

async function readDocDir(dir) {
  const contents = await fs.readdir(dir);

  let doc = null;
  const assets = [];
  const childResults = [];

  for await (const content of contents) {
    const relPath = path.join(dir, content);
    const stats = await fs.lstat(relPath);

    if (stats.isDirectory()) {
      childResults.push(...await readDocDir(relPath));
    } else if (stats.isFile()) {
      const isDoc = content === DOC_NAME;

      if (isDoc) {
        doc = relPath;
      } else {
        assets.push(relPath);
      }
    }
  }

  return doc ? [await formatDoc(doc, assets), ...childResults] : childResults;
}

async function formatDoc(doc, assets) {
  const {markdown, html} = await splitDoc(doc);

  return {
    html: html,
    slug: markdown.slug,
    title: markdown.title,
    assets: assets,
  };
}

async function splitDoc(docPath) {
  const doc = await fs.readFile(docPath, 'utf8');

  const [blank, markdownTxt, html] = doc.split('---');
  const markdown = markdownReader(markdownTxt);
  return {markdown, html};
}

function mapFormattedDocs(docs) {
  const mapped = new Map();

  for (const doc of docs) {
    mapped.set(doc.slug, doc);
  }

  return mapped;
}

async function writeFormattedDocs(docs) {
  for await (const doc of docs) {
    const dstDir = `${DST_FOLDER}/${doc.slug}`;
    await fs.mkdir(dstDir, {recursive: true});
    await fs.writeFile(`${dstDir}/index.html`, doc.html);

    for await (const asset of doc.assets) {
      const fileName = path.basename(asset);
      await fs.copyFile(asset, `${dstDir}/${fileName}`);
    }
  }
}

async function copyApp() {
  await copyAppDir(APP_FOLDER);
}

async function copyAppDir(dir) {
  const contents = await fs.readdir(dir);

  for await (const content of contents) {
    const relPath = path.join(dir, content);
    const stats = await fs.lstat(relPath);

    if (stats.isDirectory()) {
      await copyAppDir(relPath);
    } else {
      const copyDstFolder = dir.replace('app', 'static-build');
      await fs.mkdir(copyDstFolder, {recursive: true});
      await fs.copyFile(`./${relPath}`, `${copyDstFolder}/${content}`);
    }
  }
}

module.exports.staticBuild = main;
