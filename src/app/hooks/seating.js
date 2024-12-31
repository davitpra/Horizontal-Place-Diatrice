'use client'

import { useSeatingConfigure } from "./useSeatingConfigure"

export function Seating() {
    return useSeatingConfigure((state) => state.seating);
}