"use strict";(()=>{var a={};a.id=438,a.ids=[220,438],a.modules={361:a=>{a.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},1400:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.d(b,{Pq:()=>t});var e=c(2600),f=a([e]);function g(a,...b){let c="";return a.forEach((a,d)=>{c+=a+(b[d]||"")}),c}e=(f.then?(await f)():f)[0];let h=g`
    fragment UpdateParts on Update {
  __typename
  title
  summary
  publishedDate
  published
  category
  featuredImage
  imageAlt
  body
  showInAnnouncementBar
  announcementText
  announcementLinkLabel
  announcementStart
  announcementEnd
  announcementPriority
}
    `,i=g`
    fragment PostParts on Post {
  __typename
  title
  body
}
    `,j=g`
    fragment ProjectParts on Project {
  __typename
  title
  description
  year
  location
  projectType
  website
  coverImage
  gallery
  pillars
  criteria
  rating
  score
  relatedBaselines
  published
  body
}
    `,k=g`
    fragment BaselineParts on Baseline {
  __typename
  title
  slug
  summary
  projectType
  format
  region
  year
  coverImage
  gallery
  pillars
  criteria
  sdgs
  rating
  estimatedCarbonKg
  estimatedWasteKg
  estimatedLifespanUses
  recyclability
  productionAssumptions
  materialAssumptions
  transportAssumptions
  disposalAssumptions
  evidenceNotes
  sources {
    __typename
    label
    url
  }
  relatedProjects
  published
  body
}
    `,l=g`
    query update($relativePath: String!) {
  update(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...UpdateParts
  }
}
    ${h}`,m=g`
    query updateConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: UpdateFilter) {
  updateConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...UpdateParts
      }
    }
  }
}
    ${h}`,n=g`
    query post($relativePath: String!) {
  post(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PostParts
  }
}
    ${i}`,o=g`
    query postConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PostFilter) {
  postConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PostParts
      }
    }
  }
}
    ${i}`,p=g`
    query project($relativePath: String!) {
  project(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ProjectParts
  }
}
    ${j}`,q=g`
    query projectConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ProjectFilter) {
  projectConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ProjectParts
      }
    }
  }
}
    ${j}`,r=g`
    query baseline($relativePath: String!) {
  baseline(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...BaselineParts
  }
}
    ${k}`,s=g`
    query baselineConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: BaselineFilter) {
  baselineConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...BaselineParts
      }
    }
  }
}
    ${k}`,t=a=>{let b=(a=>async(b,c,d)=>{let e=a.apiUrl;if(d?.branch){let b=a.apiUrl.lastIndexOf("/");e=a.apiUrl.substring(0,b+1)+d.branch}let f=await a.request({query:b,variables:c,url:e},d);return{data:f?.data,errors:f?.errors,query:b,variables:c||{}}})(a);return function(a){return{update:(b,c)=>a(l,b,c),updateConnection:(b,c)=>a(m,b,c),post:(b,c)=>a(n,b,c),postConnection:(b,c)=>a(o,b,c),project:(b,c)=>a(p,b,c),projectConnection:(b,c)=>a(q,b,c),baseline:(b,c)=>a(r,b,c),baselineConnection:(b,c)=>a(s,b,c)}}(b)};d()}catch(a){d(a)}})},2015:a=>{a.exports=require("react")},2600:a=>{a.exports=import("tinacms/dist/client")},3024:a=>{a.exports=require("node:fs")},3473:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{default:()=>l,getStaticPaths:()=>k,getStaticProps:()=>j});var e=c(8732),f=c(9282),g=c(6267),h=c(6102),i=a([f,g,h]);[f,g,h]=i.then?(await i)():i;let j=async({params:a})=>{let b=o(a.filename),c="",d={relativePath:`${a.filename}.md`};try{let a=await h.A.queries.post(d);c=a.query,b=a.data,d=a.variables}catch{}return{props:{variables:d,data:b,query:c}}},k=async()=>{try{return{paths:(await h.A.queries.postConnection()).data.postConnection.edges.map(a=>({params:{filename:a.node._sys.filename}})),fallback:!1}}catch{let a=await Promise.resolve().then(c.t.bind(c,3024,23)),b=(await Promise.resolve().then(c.t.bind(c,6760,23))).join(process.cwd(),"content","posts");return{paths:a.existsSync(b)?a.readdirSync(b).filter(a=>a.endsWith(".md")).map(a=>({params:{filename:a.replace(/\.md$/,"")}})):[],fallback:!1}}},l=a=>{let{data:b}=a.query?(0,f.useTina)({query:a.query,variables:a.variables,data:a.data}):{data:a.data};return(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{children:[(0,e.jsxs)("div",{style:{textAlign:"center"},children:[(0,e.jsx)("h1",{className:"text-3xl m-8 text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl",children:b.post.title}),(0,e.jsx)(n,{content:b.post.body})]}),(0,e.jsxs)("div",{className:"bg-green-100 text-center",children:["Lost and looking for a place to start?",(0,e.jsxs)("a",{href:"https://tina.io/docs/r/beginner-series",className:"text-blue-500 underline",children:[" ","Check out this guide"]})," ","to see how add TinaCMS to an existing Next.js site."]})]})})},m={PageSection:a=>(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("h2",{children:a.heading}),(0,e.jsx)("p",{children:a.content})]})},n=({content:a})=>(0,e.jsxs)("div",{className:"relative py-16 bg-white overflow-hidden text-black",children:[(0,e.jsx)("div",{className:"hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full",children:(0,e.jsxs)("div",{className:"relative h-full text-lg max-w-prose mx-auto","aria-hidden":"true",children:[(0,e.jsxs)("svg",{className:"absolute top-12 left-full transform translate-x-32",width:404,height:384,fill:"none",viewBox:"0 0 404 384",children:[(0,e.jsx)("defs",{children:(0,e.jsx)("pattern",{id:"74b3fd99-0a6f-4271-bef2-e80eeafdf357",x:0,y:0,width:20,height:20,patternUnits:"userSpaceOnUse",children:(0,e.jsx)("rect",{x:0,y:0,width:4,height:4,className:"text-gray-200",fill:"currentColor"})})}),(0,e.jsx)("rect",{width:404,height:384,fill:"url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"})]}),(0,e.jsxs)("svg",{className:"absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32",width:404,height:384,fill:"none",viewBox:"0 0 404 384",children:[(0,e.jsx)("defs",{children:(0,e.jsx)("pattern",{id:"f210dbf6-a58d-4871-961e-36d5016a0f49",x:0,y:0,width:20,height:20,patternUnits:"userSpaceOnUse",children:(0,e.jsx)("rect",{x:0,y:0,width:4,height:4,className:"text-gray-200",fill:"currentColor"})})}),(0,e.jsx)("rect",{width:404,height:384,fill:"url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"})]}),(0,e.jsxs)("svg",{className:"absolute bottom-12 left-full transform translate-x-32",width:404,height:384,fill:"none",viewBox:"0 0 404 384",children:[(0,e.jsx)("defs",{children:(0,e.jsx)("pattern",{id:"d3eb07ae-5182-43e6-857d-35c643af9034",x:0,y:0,width:20,height:20,patternUnits:"userSpaceOnUse",children:(0,e.jsx)("rect",{x:0,y:0,width:4,height:4,className:"text-gray-200",fill:"currentColor"})})}),(0,e.jsx)("rect",{width:404,height:384,fill:"url(#d3eb07ae-5182-43e6-857d-35c643af9034)"})]})]})}),(0,e.jsx)("div",{className:"relative px-4 sm:px-6 lg:px-8",children:(0,e.jsx)("div",{className:"text-lg max-w-prose mx-auto",children:(0,e.jsx)(g.TinaMarkdown,{components:m,content:a})})})]}),o=a=>{let b=c(3024),d=c(6760).join(process.cwd(),"content","posts",`${a}.md`);if(!b.existsSync(d))return{post:{title:"Untitled post",body:{type:"root",children:[]}}};let e=b.readFileSync(d,"utf8"),[,f="",g=e]=e.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)??[];return{post:{title:f.split(/\r?\n/).find(a=>a.startsWith("title:"))?.replace(/^title:\s*/,"").replace(/^["']|["']$/g,"")??a,body:p(g.trim())}}},p=a=>({type:"root",children:a.split(/\n{2,}/).filter(Boolean).map(a=>a.startsWith("## ")?{type:"h2",children:[{type:"text",text:a.replace(/^## /,"")}]}:{type:"p",children:[{type:"text",text:a.replace(/\r?\n/g," ")}]})});d()}catch(a){d(a)}})},3679:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external.js")},3873:a=>{a.exports=require("path")},5109:(a,b,c)=>{c.r(b),c.d(b,{default:()=>f});var d=c(8732),e=c(2341);function f(){return(0,d.jsxs)(e.Html,{lang:"en",children:[(0,d.jsxs)(e.Head,{children:[(0,d.jsx)("script",{async:!0,src:"https://www.googletagmanager.com/gtag/js?id=G-N1FKMBM1KL"}),(0,d.jsx)("script",{dangerouslySetInnerHTML:{__html:`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-N1FKMBM1KL');
            `}}),(0,d.jsx)("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.7/tailwind.min.css",integrity:"sha512-y6ZMKFUQrn+UUEVoqYe8ApScqbjuhjqzTuwUMEGMDuhS2niI8KA3vhH2LenreqJXQS+iIXVTRL2iaNfJbDNA1Q==",crossOrigin:"anonymous",referrerPolicy:"no-referrer"})]}),(0,d.jsxs)("body",{children:[(0,d.jsx)(e.Main,{}),(0,d.jsx)(e.NextScript,{})]})]})}},6102:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.d(b,{A:()=>h});var e=c(2600),f=c(1400),g=a([e,f]);[e,f]=g.then?(await g)():g;let h=(0,e.createClient)({url:"http://localhost:4001/graphql",token:"undefined",queries:f.Pq});d()}catch(a){d(a)}})},6157:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{config:()=>r,default:()=>n,getServerSideProps:()=>q,getStaticPaths:()=>p,getStaticProps:()=>o,handler:()=>z,reportWebVitals:()=>s,routeModule:()=>y,unstable_getServerProps:()=>w,unstable_getServerSideProps:()=>x,unstable_getStaticParams:()=>v,unstable_getStaticPaths:()=>u,unstable_getStaticProps:()=>t});var e=c(3885),f=c(237),g=c(1413),h=c(5109),i=c(625),j=c.n(i),k=c(3473),l=c(2289),m=a([k]);k=(m.then?(await m)():m)[0];let n=(0,g.M)(k,"default"),o=(0,g.M)(k,"getStaticProps"),p=(0,g.M)(k,"getStaticPaths"),q=(0,g.M)(k,"getServerSideProps"),r=(0,g.M)(k,"config"),s=(0,g.M)(k,"reportWebVitals"),t=(0,g.M)(k,"unstable_getStaticProps"),u=(0,g.M)(k,"unstable_getStaticPaths"),v=(0,g.M)(k,"unstable_getStaticParams"),w=(0,g.M)(k,"unstable_getServerProps"),x=(0,g.M)(k,"unstable_getServerSideProps"),y=new e.PagesRouteModule({definition:{kind:f.RouteKind.PAGES,page:"/demo/blog/[filename]",pathname:"/demo/blog/[filename]",bundlePath:"",filename:""},distDir:".next",relativeProjectDir:"",components:{App:j(),Document:h.default},userland:k}),z=(0,l.U)({srcPage:"/demo/blog/[filename]",config:r,userland:k,routeModule:y,getStaticPaths:p,getStaticProps:o,getServerSideProps:q});d()}catch(a){d(a)}})},6267:a=>{a.exports=import("tinacms/dist/rich-text")},6472:a=>{a.exports=require("@opentelemetry/api")},6760:a=>{a.exports=require("node:path")},8732:a=>{a.exports=require("react/jsx-runtime")},9282:a=>{a.exports=import("tinacms/dist/react")}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[341,157],()=>b(b.s=6157));module.exports=c})();