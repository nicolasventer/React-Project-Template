rmdir /Q /S old_docs
move docs old_docs
mkdir docs

rmdir /Q /S Preact-Project-Template
git cl git@github.com:nicolasventer/Preact-Project-Template.git
cd Preact-Project-Template

cd Client

git checkout preact/full
call bun install
call bun run buildProd
move dist ../../docs/preact_full

git checkout react/full
call bun install
call bun run buildProd
move dist ../../docs/react_full

git checkout react/light
call bun install
call bun run buildProd
move dist ../../docs/react_light

git checkout preact/light
call bun install
call bun run buildProd
move dist ../../docs/preact_light

cd ../..

copy old_docs\index.html docs\index.html

cd script

call bun install
call bun run start

cd ..
