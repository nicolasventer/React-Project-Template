mklink /J "Server/src/Shared" "Client/src/Shared"

cd Client
call bun install
call bun run build

cd ../Server
call bun install

cd ..
