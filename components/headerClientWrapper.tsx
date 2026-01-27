"use client"

import { Session } from "next-auth";
import { useState } from "react";
import HeaderClient from "./headerClient";

export default function HeaderClientWrapper({country_value, session}: {country_value:string, session: Session}) {
    const [country, setCountry] = useState<string>(country_value || "us");
    return (
        <>
        <HeaderClient session={session} country={country} setCountry={setCountry}/>
        </>
    )
}
