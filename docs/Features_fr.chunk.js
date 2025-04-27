import{j as e}from"./index.js";function r(s){const n={a:"a",code:"code",em:"em",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h3,{children:"Routage client (coté client)"}),`
`,e.jsxs(n.p,{children:["Le routage est fait avec la librairie ",e.jsx(n.code,{children:"easy-react-router"}),", voir ",e.jsx(n.a,{href:"https://github.com/nicolasventer/Easy-React-Router",children:"easy-react-router"})," pour plus d'informations."]}),`
`,e.jsx(n.h3,{children:"Lazy loading (coté client)"}),`
`,e.jsxs(n.p,{children:["Le lazy loading est fait avec la librairie ",e.jsx(n.code,{children:"easy-react-router"}),", voir ",e.jsx(n.a,{href:"https://github.com/nicolasventer/Easy-React-Router",children:"easy-react-router"})," pour plus d'informations."]}),`
`,e.jsx(n.h3,{children:"Memoization automatique (coté client)"}),`
`,`
`,e.jsxs(n.p,{children:["La memoization automatique est faite avec le plugin ",e.jsx(n.code,{children:"auto-memo"}),"."]}),`
`,e.jsx(n.h3,{children:"Structure du code"}),`
`,e.jsxs(n.p,{children:["Le code est structuré avec le plugin ",e.jsx(n.code,{children:"eslint-plugin-project-structure"}),", voir ",e.jsx(n.a,{href:"https://github.com/Igorkowalski94/eslint-plugin-project-structure",children:"eslint-plugin-project-structure"})," pour plus d'informations."]}),`
`,e.jsx(n.p,{children:"Il y a 2 parties de ce plugin qui sont utilisées:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"folder-structure"}),": qui garantit le nom des fichiers et des dossiers créés,"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"independent-modules"}),": qui garantit les dépendances entre les fichiers."]}),`
`]}),`
`,e.jsx(n.p,{children:"vérifier visuellement que la structure du code est respectée:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run depgraph
`})}),`
`,e.jsxs("details",{children:[e.jsx("summary",{children:e.jsx("h4",{style:{display:"inline-block"},children:"Structure du projet client"})}),e.jsx("img",{src:"src/assets/images/client_project_structure.png",alt:"client_project_structure",width:"auto",height:1e3}),e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"(readOnlyGlobalState)"})," n'est pas un dossier."]}),`
`,e.jsxs(n.li,{children:["Tous les composants placés dans un dossier qui commence par ",e.jsx(n.code,{children:"_"})," sont des composants communs."]}),`
`]})]}),`
`,e.jsx(n.h4,{children:e.jsx(n.em,{children:"Structure du projet serveur (WIP)"})}),`
`,e.jsx(n.h3,{children:"Tests et couverture"}),`
`,e.jsx(n.p,{children:"Exécuter les tests avec:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run test
`})}),`
`,e.jsx(n.p,{children:"Exécuter la couverture des tests avec:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run cov
`})}),`
`,e.jsx(n.h4,{children:"Tests coté client"}),`
`,e.jsxs(n.p,{children:["Le client utilise ",e.jsx(n.a,{href:"https://playwright.dev/",children:"PlayWright"})," pour les tests et ",e.jsx(n.a,{href:"https://github.com/cenfun/monocart-coverage-reports",children:"monocart-coverage-reports"})," pour la couverture."]}),`
`,e.jsxs(n.p,{children:["Une ",e.jsx(n.a,{href:"https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright",children:"extension VS Code pour PlayWright"})," est également disponible."]}),`
`,e.jsx(n.p,{children:"Ouvrir l'interface de PlayWright avec:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run testui
`})}),`
`,e.jsx(n.p,{children:"Ouvrir le générateur de tests PlayWright avec:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run codegen
`})}),`
`,e.jsxs(n.p,{children:["Activer le mock de l'API en appelant la fonction ",e.jsx(n.code,{children:"enableApiMock"})," dans le fichier ",e.jsx(n.code,{children:"src/index.ts"}),"."]}),`
`,e.jsx(n.h4,{children:"Tests coté serveur"}),`
`,e.jsxs(n.p,{children:["Le serveur utilise ",e.jsx(n.a,{href:"https://bun.sh/docs/cli/test",children:"bun test"})," pour les tests et ",e.jsx(n.a,{href:"https://community.chocolatey.org/packages/lcov",children:"lcov"})," pour la couverture."]}),`
`,e.jsxs(n.p,{children:["Une ",e.jsx(n.a,{href:"https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters",children:"extension VS Code pour Coverage Gutter"})," est également disponible."]}),`
`,e.jsxs(n.p,{children:["Pour les comportements spécifiques aux tests, utiliser la variable ",e.jsx(n.code,{children:"testConfig.enable"})," définie dans ",e.jsx(n.code,{children:"src/testConfig.ts"}),"."]}),`
`,e.jsx(n.h3,{children:"Documentation"}),`
`,e.jsxs(n.p,{children:["La documentation du code est faite avec ",e.jsx(n.a,{href:"https://typedoc.org/",children:"TypeDoc"}),"."]}),`
`,e.jsx(n.p,{children:"Générer la documentation du code avec:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run doc
`})}),`
`,e.jsxs(n.p,{children:["Les images utilisées dans la documentation du projet sont faites avec ",e.jsx(n.a,{href:"https://d2lang.com/",children:"D2"}),"."]}),`
`,e.jsxs(n.p,{children:["Le dossier contenant les fichiers D2 contient le script ",e.jsx(n.code,{children:"build_2d.sh"})," pour générer les images."]}),`
`,e.jsx(n.h3,{children:"Linting"}),`
`,e.jsxs(n.p,{children:["Le linting est fait avec ",e.jsx(n.a,{href:"https://eslint.org/",children:"ESLint"}),"."]}),`
`,e.jsx(n.p,{children:"Obtenir le rapport de linting avec:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run lint
`})}),`
`,e.jsx(n.p,{children:"Corriger les erreurs de linting avec:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run lintfix
`})}),`
`,e.jsx(n.h3,{children:"Typage de l'API"}),`
`,e.jsxs(n.p,{children:["Le typage de l'API côté client est fait avec ",e.jsx(n.a,{href:"https://elysiajs.com/eden/treaty/overview.html",children:"Eden treaty"}),"."]}),`
`,e.jsx(n.p,{children:"Au lieu de récupérer le typage de l'API à partir du serveur, il est généré du côté client avec:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run genApi
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.em,{children:"La manière habituelle ralentie beaucoup trop VS Code."})}),`
`,e.jsxs(n.p,{children:["Modifier le fichier ",e.jsx(n.code,{children:"_genApi.ts"})," si vous voulez changer la génération de l'API."]})]})}function i(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}export{i as default};
