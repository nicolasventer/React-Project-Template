#!/usr/bin/sh

cd Server
bun install

cd ../Client/src
ln -s ../../Server/src/Common .

cd ..
bun install
bun run build

cd ..
