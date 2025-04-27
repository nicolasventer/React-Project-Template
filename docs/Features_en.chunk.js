import{j as e}from"./index.js";function t(s){const n={a:"a",code:"code",em:"em",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h3,{children:"Client routing (Client-side)"}),`
`,e.jsxs(n.p,{children:["The client routing is made with the ",e.jsx(n.code,{children:"easy-react-router"})," library, see ",e.jsx(n.a,{href:"https://github.com/nicolasventer/Easy-React-Router",children:"easy-react-router"})," for more information."]}),`
`,e.jsx(n.h3,{children:"Lazy loading (Client-side)"}),`
`,e.jsxs(n.p,{children:["The lazy loading is made with the ",e.jsx(n.code,{children:"easy-react-router"})," library, see ",e.jsx(n.a,{href:"https://github.com/nicolasventer/Easy-React-Router",children:"easy-react-router"})," for more information."]}),`
`,e.jsx(n.h3,{children:"Auto memoization (Client-side)"}),`
`,`
`,e.jsxs(n.p,{children:["The auto memoization is made with the ",e.jsx(n.code,{children:"auto-memo"})," plugin."]}),`
`,e.jsx(n.h3,{children:"Code structure"}),`
`,e.jsxs(n.p,{children:["The code is structured with the ",e.jsx(n.code,{children:"eslint-plugin-project-structure"})," plugin, see ",e.jsx(n.a,{href:"https://github.com/Igorkowalski94/eslint-plugin-project-structure",children:"eslint-plugin-project-structure"})," for more information."]}),`
`,e.jsx(n.p,{children:"There is 2 parts of this plugin that are used:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"folder-structure"}),": that ensures the name of the files and folders created,"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"independent-modules"}),": that ensures the dependencies between each files."]}),`
`]}),`
`,e.jsx(n.p,{children:"Visually check that the project structure is respected:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run depgraph
`})}),`
`,e.jsxs("details",{children:[e.jsx("summary",{children:e.jsx("h4",{style:{display:"inline-block"},children:"Client Project Structure"})}),e.jsx("img",{src:"src/assets/images/client_project_structure.png",alt:"client_project_structure",width:"auto",height:1e3}),e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"(readOnlyGlobalState)"})," is not a folder."]}),`
`,e.jsxs(n.li,{children:["All components placed in a folder that start with ",e.jsx(n.code,{children:"_"})," are common components."]}),`
`]})]}),`
`,e.jsx(n.h4,{children:e.jsx(n.em,{children:"Server Project Structure (WIP)"})}),`
`,e.jsx(n.h3,{children:"Tests and coverage"}),`
`,e.jsx(n.p,{children:"Execute tests with:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run test
`})}),`
`,e.jsx(n.p,{children:"Execute tests coverage with:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run cov
`})}),`
`,e.jsx(n.h4,{children:"Tests Client-side"}),`
`,e.jsxs(n.p,{children:["The Client is using ",e.jsx(n.a,{href:"https://playwright.dev/",children:"PlayWright"})," for the tests and ",e.jsx(n.a,{href:"https://github.com/cenfun/monocart-coverage-reports",children:"monocart-coverage-reports"})," for the coverage."]}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.a,{href:"https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright",children:"VS Code extension for PlayWright"})," is also available."]}),`
`,e.jsx(n.p,{children:"Open the PlayWright UI with:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run testui
`})}),`
`,e.jsx(n.p,{children:"Open the PlayWright test generator with:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run codegen
`})}),`
`,e.jsxs(n.p,{children:["Enable the mock of the api by calling the ",e.jsx(n.code,{children:"enableApiMock"})," in the ",e.jsx(n.code,{children:"src/index.ts"})," file."]}),`
`,e.jsx(n.h4,{children:"Tests Server-side"}),`
`,e.jsxs(n.p,{children:["The Server is using ",e.jsx(n.a,{href:"https://bun.sh/docs/cli/test",children:"bun test"})," for the tests and ",e.jsx(n.a,{href:"https://community.chocolatey.org/packages/lcov",children:"lcov"})," for the coverage."]}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.a,{href:"https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters",children:"VS Code extension for Coverage Gutter"})," is also available."]}),`
`,e.jsxs(n.p,{children:["For behavior specific to tests, use the variable ",e.jsx(n.code,{children:"testConfig.enable"})," defined in ",e.jsx(n.code,{children:"src/testConfig.ts"}),"."]}),`
`,e.jsx(n.h3,{children:"Documentation"}),`
`,e.jsxs(n.p,{children:["The code documentation is made with ",e.jsx(n.a,{href:"https://typedoc.org/",children:"TypeDoc"}),"."]}),`
`,e.jsx(n.p,{children:"Generate the code documentation with:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run doc
`})}),`
`,e.jsxs(n.p,{children:["The images used in the project documentation are made with ",e.jsx(n.a,{href:"https://d2lang.com/",children:"D2"}),"."]}),`
`,e.jsxs(n.p,{children:["The folder containing the d2 files contains the script ",e.jsx(n.code,{children:"build_2d.sh"})," to generate the images."]}),`
`,e.jsx(n.h3,{children:"Linting"}),`
`,e.jsxs(n.p,{children:["The linting is made with ",e.jsx(n.a,{href:"https://eslint.org/",children:"ESLint"}),"."]}),`
`,e.jsx(n.p,{children:"Get the linting report with:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run lint
`})}),`
`,e.jsx(n.p,{children:"Fix the linting issues with:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run lintfix
`})}),`
`,e.jsx(n.h3,{children:"API type safety"}),`
`,e.jsxs(n.p,{children:["The API type safety is made with ",e.jsx(n.a,{href:"https://elysiajs.com/eden/treaty/overview.html",children:"Eden treaty"}),"."]}),`
`,e.jsx(n.p,{children:"Instead of getting the API type from the server, it is generated from the client side with:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-sh",children:`bun run genApi
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.em,{children:"The usual way slows down VS Code too much."})}),`
`,e.jsxs(n.p,{children:["Edit the file ",e.jsx(n.code,{children:"_genApi.ts"})," if you want to change the api generation."]})]})}function i(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(t,{...s})}):t(s)}export{i as default};
