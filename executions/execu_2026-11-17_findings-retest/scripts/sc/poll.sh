cd "$(dirname "$0")"
for i in $(seq 1 26); do sh run.sh f04.js | tr -d '\n ' ; echo; case "$(tail -c 0 /dev/null)" in *) ;; esac; sleep 60; done
