import{c as n}from"./createLucideIcon-CahhIbKj.js";import{r as m,j as t}from"./index-x0LnCo4S.js";import{c as l}from"./clsx-B-dksMZM.js";import{C as j}from"./Card-CcIy8g3V.js";/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=n("ArrowDownRight",[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]]);/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=n("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=n("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),a={blue:{bg:"bg-[#3B82F6]/10",text:"text-[#3B82F6]"},green:{bg:"bg-[#22C55E]/10",text:"text-[#22C55E]"},amber:{bg:"bg-[#F59E0B]/10",text:"text-[#F59E0B]"},red:{bg:"bg-[#EF4444]/10",text:"text-[#EF4444]"},purple:{bg:"bg-[#8B5CF6]/10",text:"text-[#8B5CF6]"}},C=({title:d,value:o,prefix:h="",suffix:p="",icon:u,trend:e,color:s="blue",sparklineData:g})=>{const[f,c]=m.useState(0);return m.useEffect(()=>{let r=0;const i=o,v=i/(1e3/16),x=setInterval(()=>{r+=v,r>=i?(c(i),clearInterval(x)):c(Math.ceil(r))},16);return()=>clearInterval(x)},[o]),t.jsxs(j,{className:"relative overflow-hidden group",children:[t.jsxs("div",{className:"flex justify-between items-start",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-[#94A3B8]",children:d}),t.jsx("div",{className:"mt-2 flex items-baseline",children:t.jsxs("span",{className:"text-3xl font-bold text-white tracking-tight",children:[h,f.toLocaleString(),p]})}),e&&t.jsxs("div",{className:l("flex items-center mt-2 text-sm font-medium",e.isPositive?"text-[#22C55E]":"text-[#EF4444]"),children:[e.isPositive?t.jsx(w,{className:"w-4 h-4 mr-1"}):t.jsx(b,{className:"w-4 h-4 mr-1"}),t.jsxs("span",{children:[Math.abs(e.value),"%"]}),t.jsx("span",{className:"text-[#94A3B8] ml-2 font-normal",children:"vs last week"})]})]}),t.jsx("div",{className:l("p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",a[s].bg),children:t.jsx(u,{className:l("w-6 h-6",a[s].text)})})]}),g&&t.jsx("div",{className:"absolute bottom-0 left-0 right-0 h-12 opacity-30",children:t.jsxs("svg",{className:"w-full h-full",preserveAspectRatio:"none",viewBox:"0 0 100 100",children:[t.jsx("path",{d:"M0 100 L 20 80 L 40 90 L 60 40 L 80 50 L 100 20 L 100 100 Z",fill:"currentColor",className:a[s].text,opacity:"0.2"}),t.jsx("path",{d:"M0 100 L 20 80 L 40 90 L 60 40 L 80 50 L 100 20",fill:"none",stroke:"currentColor",strokeWidth:"2",className:a[s].text})]})})]})};export{C as S,A as T};
