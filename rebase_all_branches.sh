git co react/full
git reset --hard preact/full
git cpi origin/react/full || (echo "Conflicts detected! Press any key to exit..." && read -n 1 && exit 1)
git pushfwl
git co react/light
git reset --hard react/full
git cpi origin/react/light || (echo "Conflicts detected! Press any key to exit..." && read -n 1 && exit 1)
git pushfwl
git co preact/light
git reset --hard react/light
git cpi origin/preact/light || (echo "Conflicts detected! Press any key to exit..." && read -n 1 && exit 1)
git pushfwl
git co preact/full
