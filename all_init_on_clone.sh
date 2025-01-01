#!/usr/bin/sh

cd Client
bun install
bun run build

cd ../Server/src
ln -s ../../Client/src/Shared .

cd ..
bun install

cd ..
