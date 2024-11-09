'use client'
import { residents } from "../data/residents"
import { Table } from "../components/Table"
  
  export default function Room() {
    return (
      <Table residents={residents} description="A list of all residents in by the time of made this app including their name, room, seating and observation." />
    )
  }
  