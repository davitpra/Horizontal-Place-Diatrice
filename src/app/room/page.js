"use client";
import { residents } from "../data/residents";
import { Table } from "../components/Table";
import Title from "../components/Title";

export default function Room() {
  const observations =[
    "A list of all residents in by the time of made this app including their name, room, seating and observation.",
  ]

  return (
    <>
      <Title observations={observations} />
      <Table
        residents={residents}
      />
    </>
  );
}
