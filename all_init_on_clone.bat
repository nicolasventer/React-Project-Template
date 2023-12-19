mklink /J "Client/src/Common" "Server/src/Common"

cd Server
call bun install

cd ../Client
call bun install
call bun run build

cd ..
