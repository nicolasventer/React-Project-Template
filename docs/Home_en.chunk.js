import{j as e}from"./index.js";function c(s){const t={br:"br",code:"code",em:"em",h3:"h3",p:"p",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(t.h3,{children:"What is React Project Template?"}),`
`,e.jsxs(t.p,{children:["It is an opinionated template for a React project with many features already set up.",e.jsx(t.br,{}),`
`,"It can either be used as a ",e.jsx(t.code,{children:"Full"})," or ",e.jsx(t.code,{children:"Light"})," template. ",e.jsx(t.em,{children:"(Light version WIP)"})]}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.code,{children:"Light version"})," remove the dependencies with ",e.jsx(t.code,{children:"typebox"}),", ",e.jsx(t.code,{children:"mantine"}),", ",e.jsx(t.code,{children:"react-hot-toast"}),", ",e.jsx(t.code,{children:"lucide-react"})," and ",e.jsx(t.code,{children:"react-icons"}),"."]}),`
`,e.jsx(t.h3,{children:"Tech Stack"}),`
`,e.jsxs("div",{style:{display:"flex",gap:"10px",flexWrap:"wrap"},children:[e.jsx("p",{style:{maxWidth:"50%"},children:e.jsx("img",{src:"src/assets/images/client_tech_stack.png",alt:"client_tech_stack",width:"auto",height:400})}),e.jsx("p",{style:{maxWidth:"50%"},children:e.jsx("img",{src:"src/assets/images/server_tech_stack.png",alt:"server_tech_stack",width:"auto",height:400})})]}),`
`,e.jsx(t.h3,{children:"Architecture"}),`
`,e.jsx("img",{src:"src/assets/images/project_structure.png",alt:"project_structure",width:"auto",height:400})]})}function r(s={}){const{wrapper:t}=s.components||{};return t?e.jsx(t,{...s,children:e.jsx(c,{...s})}):c(s)}export{r as default};
