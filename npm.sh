#!/bin/bash

sudo docker run --rm -it \
    -v $(pwd):/build \
    -w /build \
    --entrypoint /bin/sh \
    node:18-alpine3.15