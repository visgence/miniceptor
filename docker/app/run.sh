MINICEPTOR=$(cd $(dirname "${BASH_SOURCE[0]}")/../../ && pwd -P)
docker run -t -i -P \
    --rm=true \
    --name miniceptor \
    -v $MINICEPTOR:/home/miniceptor \
    -p 8000:8000 \
    miniceptor/app \
    bash
