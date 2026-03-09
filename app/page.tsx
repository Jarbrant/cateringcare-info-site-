import ChatWidget from "@/components/ChatWidget"

export default function Home(){

return(

<main style={{padding:40,maxWidth:900,margin:"auto"}}>

<h1>CateringCare</h1>

<p>

Information och support för matleveranser
till äldreomsorgen.

</p>

<h2>Vanliga frågor</h2>

<ul>

<li>Hur fungerar faktureringen?</li>
<li>Jag har inte fått någon mat</li>
<li>Hur ändrar jag en beställning?</li>

</ul>

<ChatWidget/>

</main>

)

}
