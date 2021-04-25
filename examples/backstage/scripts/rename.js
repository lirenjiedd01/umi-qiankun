const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const renamePath = path.join(projectRoot, process.argv[2]); // 要批量修改的目录

function rename(dir) {
  fs.readdir(dir, 'utf-8', (err, data) => {
    if (!err) {
      data.forEach(filename => {
        const tempPath = path.join(dir, filename);
        const info = fs.statSync(tempPath);
        if (info.isDirectory()) {
          rename(tempPath);
        } else {
          // js -> ts
          // jsx -> tsx
          const pathParse = path.parse(tempPath);
          if (pathParse.ext === '.jsx') {
            const newPath = `${pathParse.dir}/${pathParse.name}.tsx`;
            fs.renameSync(tempPath, newPath);
          } else if (pathParse.ext === '.js') {
            const newPath = `${pathParse.dir}/${pathParse.name}.ts`;
            fs.renameSync(tempPath, newPath);
          }
        }
      });
    } else {
      console.error('读取目录出错: ', err);
    }
  });
}

rename(renamePath);
