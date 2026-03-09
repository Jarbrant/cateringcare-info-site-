"use client"

import {useState} from "react"

export default function ChatWidget(){

const [messages,setMessages] = useState<any[]>([])
const [input,setInput] = useState("")

async function send(){

 if(!input.trim()) return

 const res = await fetch("/api/search",{

  method:"POST",

  headers:{ "Content-Type":"application/json" },

  body:JSON.stringify({question:input})

 })

 const data = await res.json()

 setMessages([

  ...messages,

  {role:"user",text:input},

  {role:"bot",text:data.answer}

 ])

 setInput("")

}

return(

<div style={{

 position:"fixed",
 bottom:20,
 right:20,
 width:320,
 background:"#fff",
 border:"1px solid #ddd",
 padding:15

}}>

<div style={{height:200,overflow:"auto"}}>

{messages.map((m,i)=>(

<div key={i}>

<strong>{m.role==="user"?"Du":"Support"}:</strong>

<p>{m.text}</p>

</div>

))}

</div>

<input

value={input}
onChange={e=>setInput(e.target.value)}
placeholder="Ställ en fråga..."

/>

<button onClick={send}>Skicka</button>

</div>

)

}
