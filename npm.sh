#!/bin/bash

docker run --rm -it \
    -v $(pwd):/build \
    -p 3000:3000 \
    -w /build \
    --entrypoint /bin/sh \
    node:18-alpine3.15