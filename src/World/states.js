export default [
    {
        name: "initial",
        sharedStates: ["obelisk"],
    },
    {
        name: "obelisk",
        sharedStates: ["initial", "obelisk_ring1", "obelisk_ring2", "obelisk_ring3", "obelisk_ring4",],
    },
    {
        name: "obelisk_ring1",
        sharedStates: ["obelisk", "obelisk_ring1", "obelisk_ring2", "obelisk_ring3", "obelisk_ring4",],
    },
    {
        name: "obelisk_ring2",
        sharedStates: ["obelisk", "obelisk_ring1", "obelisk_ring2", "obelisk_ring3", "obelisk_ring4",],
    },
    {
        name: "obelisk_ring3",
        sharedStates: ["obelisk", "obelisk_ring1", "obelisk_ring2", "obelisk_ring3", "obelisk_ring4",],
    },
    {
        name: "obelisk_ring4",
        sharedStates: ["obelisk", "obelisk_ring1", "obelisk_ring2", "obelisk_ring3", "obelisk_ring4",],
    },
]