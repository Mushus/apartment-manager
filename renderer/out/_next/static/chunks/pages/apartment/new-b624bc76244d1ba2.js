(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[264],{2077:function(e,n,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/apartment/new",function(){return r(6119)}])},8992:function(e,n,r){"use strict";var t=r(4246),a=r(309),l=r(6538);let i=e=>{let{children:n,mb:r}=e;return(0,t.jsx)(a.Z,{style:{overflow:"hidden"},children:(0,t.jsx)(l.Z,{my:"32px",mb:r,children:n})})};n.Z=i},9446:function(e,n,r){"use strict";var t=r(4246),a=r(6538);let l=e=>{let{children:n}=e;return(0,t.jsx)(a.Z,{display:"flex",flexDirection:"row-reverse",gap:"8px",children:n})};n.Z=l},6186:function(e,n,r){"use strict";var t=r(4246),a=r(6538);let l=e=>{let{children:n}=e;return(0,t.jsx)(a.Z,{position:"fixed",bottom:"16px",right:"16px",children:n})};n.Z=l},2910:function(e,n,r){"use strict";var t=r(4246),a=r(6538);let l=e=>{let{label:n,children:r}=e;return(0,t.jsxs)(a.Z,{mb:"16px",children:[(0,t.jsx)(a.Z,{mb:"4px",children:n}),(0,t.jsx)(a.Z,{children:r})]})};n.Z=l},188:function(e,n,r){"use strict";var t=r(4246);r(7378);var a=r(9894),l=r.n(a),i=r(8038),o=r.n(i),s=r(7545),c=r(2384),u=r(2133),h=r(2750),d=r(8666),m=r(1434),x=r(6538);let g=e=>{let{children:n,title:r,prev:a}=e,i="物件管理システム",g=void 0===r?i:"".concat(r," - ").concat(i);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(o(),{children:[(0,t.jsx)("title",{children:g}),(0,t.jsx)("meta",{charSet:"utf-8"}),(0,t.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width"})]}),(0,t.jsx)(s.Z,{position:"sticky",children:(0,t.jsxs)(c.Z,{children:[(0,t.jsx)(u.Z,{size:"large",edge:"start",color:"inherit","aria-label":"menu",sx:{mr:2},LinkComponent:l(),href:null!=a?a:"",disabled:void 0===a,children:(0,t.jsx)(m.Z,{})}),(0,t.jsx)(h.Z,{variant:"h6",component:"h1",flexGrow:1,children:null!=r?r:i}),(0,t.jsx)(x.Z,{display:"flex",flexGrow:0,children:[{title:"トップ",href:"/"},{title:"物件一覧",href:"/apartment"},{title:"入居状況",href:"/room"},{title:"レシート発行",href:"/invoice"}].map(e=>(0,t.jsx)(d.Z,{sx:{my:2,color:"white",display:"block"},LinkComponent:l(),href:e.href,children:e.title},e.href))})]})}),n]})};n.Z=g},1108:function(e,n,r){"use strict";var t=r(4246),a=r(2750),l=r(6233);let i=e=>{let{title:n,children:r}=e;return(0,t.jsxs)(l.Z,{children:[(0,t.jsx)(a.Z,{variant:"h6",component:"h2",children:n}),(0,t.jsx)(l.Z,{mb:"32px",children:r})]})};n.Z=i},3397:function(e,n,r){"use strict";var t=r(4246),a=r(5670);let l=e=>{let{onChange:n,...r}=e,l=e=>{n&&n(e.target.value)};return(0,t.jsx)(a.Z,{fullWidth:!0,inputMode:"decimal",onChange:l,...r})};n.Z=l},7308:function(e,n,r){"use strict";var t=r(4246),a=r(5670);let l=e=>{let{onChange:n,...r}=e,l=e=>{n&&n(e.target.value)};return(0,t.jsx)(a.Z,{fullWidth:!0,onChange:l,...r})};n.Z=l},9038:function(e,n,r){"use strict";var t=r(4246),a=r(7378),l=r(6968),i=r(6999),o=r(8784),s=r(8666),c=r(6538),u=r(7917),h=r(7308),d=r(2910),m=r(6186),x=r(8992),g=r(8103),j=r(1108),Z=r(9446),p=r(3397),f=r(2668);let C=e=>{let{apartment:n,onSave:r}=e,i=(0,a.useMemo)(()=>n?{...n,rent:(0,f.di)(n.rent),waterCharge:(0,f.di)(n.waterCharge),parkingFee:(0,f.di)(n.parkingFee),commonAreaCharge:(0,f.di)(n.commonAreaCharge)}:{id:null,name:"",rent:"",waterCharge:"",parkingFee:"",commonAreaCharge:"",admin:""},[n]),c=(0,a.useMemo)(()=>n?n.rooms.map(e=>({...e,key:(0,o.uniqueId)("room-d"),rent:(0,f.di)(e.rent),waterCharge:(0,f.di)(e.waterCharge),parkingFee:(0,f.di)(e.parkingFee),commonAreaCharge:(0,f.di)(e.commonAreaCharge)})):[],[n]),[C,v]=(0,a.useState)(i),[k,w]=(0,a.useState)(c),y=(0,g.R)(v,"name"),R=(0,g.R)(v,"rent"),F=(0,g.R)(v,"waterCharge"),A=(0,g.R)(v,"parkingFee"),_=(0,g.R)(v,"commonAreaCharge"),z=(0,g.R)(v,"admin"),q=(0,a.useCallback)(e=>{let{oldIndex:n,newIndex:r}=e;return w(e=>(0,l.q)(e,n,r))},[v]),N=(0,a.useCallback)((e,n)=>{w(r=>{let t=r.findIndex(n=>n.key===e);if(-1===t)return r;let a=[...r];return a[t]=n(a[t]),a})},[w]),S=(0,g.q)(()=>r({...C,rooms:k.map((e,n)=>({...e,index:n,rent:(0,f.zb)(e.rent),waterCharge:(0,f.zb)(e.waterCharge),parkingFee:(0,f.zb)(e.parkingFee),commonAreaCharge:(0,f.zb)(e.commonAreaCharge),admin:e.admin})),rent:(0,f.zb)(C.rent),waterCharge:(0,f.zb)(C.waterCharge),parkingFee:(0,f.zb)(C.parkingFee),commonAreaCharge:(0,f.zb)(C.commonAreaCharge),admin:C.admin}),[k,C,r]),D=(0,a.useCallback)(()=>{w(e=>[...e,{key:(0,o.uniqueId)("room"),id:null,name:"",rent:"",waterCharge:"",parkingFee:"",commonAreaCharge:"",admin:""}])},[v]),E=(0,a.useCallback)(e=>{w(n=>{let r=n.findIndex(n=>n.key===e);if(-1===r)return n;let t=[...n];return t.splice(r,1),t})},[v]);return(0,t.jsx)(x.Z,{mb:"68px",children:(0,t.jsxs)("form",{onSubmit:S,children:[(0,t.jsx)(d.Z,{label:"名前",children:(0,t.jsx)(h.Z,{value:C.name,onChange:y})}),(0,t.jsx)(d.Z,{label:"家賃(円)",children:(0,t.jsx)(p.Z,{value:C.rent,onChange:R})}),(0,t.jsx)(d.Z,{label:"水道料金(円)",children:(0,t.jsx)(p.Z,{value:C.waterCharge,onChange:F})}),(0,t.jsx)(d.Z,{label:"駐車場料金(円)",children:(0,t.jsx)(p.Z,{value:C.parkingFee,onChange:A})}),(0,t.jsx)(d.Z,{label:"共益費(円)",children:(0,t.jsx)(p.Z,{value:C.commonAreaCharge,onChange:_})}),(0,t.jsx)(d.Z,{label:"管理者",children:(0,t.jsx)(p.Z,{value:C.admin,onChange:z})}),(0,t.jsxs)(j.Z,{title:"部屋",children:[(0,t.jsx)(b,{rooms:k,onSortEnd:q,onUpdateRoom:N,onDeleteRoom:E}),(0,t.jsx)(Z.Z,{children:(0,t.jsx)(s.Z,{variant:"contained",onClick:D,children:"部屋追加"})})]}),(0,t.jsx)(m.Z,{children:(0,t.jsx)(s.Z,{variant:"contained",type:"submit",endIcon:(0,t.jsx)(u.Z,{}),children:"保存"})})]})})},b=(0,i.JN)(e=>{let{rooms:n,onUpdateRoom:r,onDeleteRoom:a}=e;return(0,t.jsx)(c.Z,{bgcolor:"#eee",children:n.map((e,n)=>(0,t.jsx)(v,{room:e,index:n,onUpdateRoom:r,onDeleteRoom:a},e.key))})}),v=(0,i.W8)(e=>{let{room:n,onUpdateRoom:r,onDeleteRoom:l}=e,i=(0,a.useCallback)(e=>r(n.key,e),[r,n.key]),[o,u]=(0,a.useState)(!1),m=(0,a.useCallback)(()=>{l(n.key)},[l,n.key]),x=(0,g.R)(i,"name"),j=(0,g.R)(i,"rent"),Z=(0,g.R)(i,"waterCharge"),f=(0,g.R)(i,"parkingFee"),C=(0,g.R)(i,"commonAreaCharge"),b=(0,g.R)(i,"admin");return(0,t.jsxs)(c.Z,{border:"1px solid #ddd",bgcolor:"#fff",position:"relative",padding:"16px",children:[(0,t.jsx)(c.Z,{position:"absolute",top:"0",right:"0",children:(0,t.jsx)(s.Z,{variant:"contained",onClick:m,children:"削除"})}),(0,t.jsx)(d.Z,{label:"部屋名",children:(0,t.jsx)(h.Z,{value:n.name,onChange:x})}),(0,t.jsx)(d.Z,{label:"家賃(円)",children:(0,t.jsx)(p.Z,{value:n.rent,onChange:j})}),(0,t.jsx)(s.Z,{onClick:()=>u(e=>!e),children:"詳細"}),o&&(0,t.jsxs)(c.Z,{children:[(0,t.jsx)(d.Z,{label:"水道料金(円)",children:(0,t.jsx)(p.Z,{value:n.waterCharge,onChange:Z})}),(0,t.jsx)(d.Z,{label:"駐車場料金(円)",children:(0,t.jsx)(p.Z,{value:n.parkingFee,onChange:f})}),(0,t.jsx)(d.Z,{label:"共益費(円)",children:(0,t.jsx)(p.Z,{value:n.commonAreaCharge,onChange:C})}),(0,t.jsx)(d.Z,{label:"管理者",children:(0,t.jsx)(p.Z,{value:n.admin,onChange:b})})]})]})});n.Z=C},4366:function(e,n,r){"use strict";r.d(n,{M:function(){return l}});var t=r(4246),a=r(6677);let l=e=>()=>{let n;let r=e.layout,l=e.page;if(e.query){let{query:i,isReady:o}=(0,a.useRouter)();if(!o)return(0,t.jsx)(r,{query:void 0});n=e.query.parse(i)}return(0,t.jsx)(r,{query:n,children:(0,t.jsx)(l,{query:n})})}},8103:function(e,n,r){"use strict";r.d(n,{R:function(){return l},q:function(){return a}});var t=r(7378);let a=(e,n)=>(0,t.useCallback)(n=>{n.preventDefault(),e()},n),l=(e,n)=>(0,t.useCallback)(r=>e(e=>({...e,[n]:r})),[e])},6119:function(e,n,r){"use strict";r.r(n);var t=r(4246),a=r(188),l=r(4366),i=r(9038),o=r(6677),s=r(473);n.default=(0,l.M)({layout:e=>{let{children:n}=e;return(0,t.jsx)(a.Z,{title:"新しいアパート",prev:"/apartment",children:n})},page:()=>{let e=(0,o.useRouter)(),n=async n=>{s.L.apartment.create.mutate(n),e.push("/apartment")};return(0,t.jsx)(i.Z,{onSave:n})}})},2668:function(e,n,r){"use strict";r.d(n,{OE:function(){return s},di:function(){return l},zb:function(){return i},zf:function(){return o}});var t=r(7693),a=r.n(t);let l=e=>e||0===e?String(e):"",i=e=>{let n=Number.parseFloat(e);return Number.isInteger(n)?n:null},o=e=>null===e?null:a()(e).format("YYYY-MM-DD"),s=e=>null===e?null:a()(e).toDate()}},function(e){e.O(0,[33,933,55,132,466,774,888,179],function(){return e(e.s=2077)}),_N_E=e.O()}]);