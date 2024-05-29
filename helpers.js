const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const posts = require('./data/data.json');

function writeDataToFile(dataFilePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function findPostBySlug(slug) {
    return posts.find(post => post.slug === slug);
}

function generateUniqueSlug(title) {
    let slug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = slug;
    let i = 1;
    while (posts.some(post => post.slug === uniqueSlug)) {
        uniqueSlug = `${slug}-${i++}`;
    }
    return uniqueSlug;
}

module.exports = {
    writeDataToFile,
    findPostBySlug,
    generateUniqueSlug
};
