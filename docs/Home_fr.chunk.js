import{j as e}from"./index.js";function c(s){const t={br:"br",code:"code",em:"em",h3:"h3",p:"p",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(t.h3,{children:"Qu'est-ce que React Project Template ?"}),`
`,e.jsxs(t.p,{children:["C'est un template dogmatique pour un projet React avec de nombreuses fonctionnalités déjà configurées.",e.jsx(t.br,{}),`
`,"Il peut être utilisé en tant que template ",e.jsx(t.code,{children:"Full"})," ou ",e.jsx(t.code,{children:"Light"}),". ",e.jsx(t.em,{children:"(Version Light en cours)"})]}),`
`,e.jsxs(t.p,{children:["La ",e.jsx(t.code,{children:"version Light"})," retire les dépendances avec ",e.jsx(t.code,{children:"typebox"}),", ",e.jsx(t.code,{children:"mantine"}),", ",e.jsx(t.code,{children:"react-hot-toast"}),", ",e.jsx(t.code,{children:"lucide-react"})," et ",e.jsx(t.code,{children:"react-icons"}),"."]}),`
`,e.jsx(t.h3,{children:"Stack technique"}),`
`,e.jsxs("div",{style:{display:"flex",gap:"10px",flexWrap:"wrap"},children:[e.jsx("p",{style:{maxWidth:"50%"},children:e.jsx("img",{src:"src/assets/images/client_tech_stack.png",alt:"client_tech_stack",width:"auto",height:400})}),e.jsx("p",{style:{maxWidth:"50%"},children:e.jsx("img",{src:"src/assets/images/server_tech_stack.png",alt:"server_tech_stack",width:"auto",height:400})})]}),`
`,e.jsx(t.h3,{children:"Architecture"}),`
`,e.jsx("img",{src:"src/assets/images/project_structure.png",alt:"project_structure",width:"auto",height:400})]})}function r(s={}){const{wrapper:t}=s.components||{};return t?e.jsx(t,{...s,children:e.jsx(c,{...s})}):c(s)}export{r as default};
