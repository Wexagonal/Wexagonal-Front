//NodeJS 调用fs深搜列出当前文件夹下所有文件,并以数组存储为list.json
const fs = require('fs');
const res = []
const ignore = [
    'node_modules',
    '.git',
    'package.json',
    '.gitattributes',
    'CNAME',
    'GList.js',
]
const list = (path) => {
    const dir = fs.readdirSync(path);
    dir.forEach(file => {
        const stat = fs.statSync(path + '/' + file);
        if (ignore.indexOf(file) === -1) {
            if (stat.isDirectory()) {
                return list(path + '/' + file);
            } else {
                res.push(path + '/' + file);
            }
        }
    })
}
list('.')
for(let i = 0; i < res.length; i++){
    res[i] = res[i].replace('./', 'https://SOURCE_CDN/');
}
fs.writeFileSync('list.json', JSON.stringify(res));