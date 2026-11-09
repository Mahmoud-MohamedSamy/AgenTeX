zrun(){ node -e 'const fs=require("fs");fs.writeFileSync("zn-gen.js",fs.readFileSync("zn-gen.tpl","utf8").replace("__A__",process.argv[1]))' "$1"; MAXC=${2:-1500} timeout 200 bash zn.sh zn-gen.js; }
