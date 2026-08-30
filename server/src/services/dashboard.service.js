const data = {
  priorityJobs: [
    { id:"DJ-2026-084", title:"Festive Campaign Creatives", client:"Nexa Retail", designer:"Maya Rao", status:"In progress", statusClass:"in-progress", due:"Today" },
    { id:"DJ-2026-079", title:"Product Catalogue 2026", client:"Arbor Living", designer:"Rohan Mehta", status:"In review", statusClass:"review", due:"Today" },
    { id:"DJ-2026-077", title:"Restaurant Menu Refresh", client:"Saffron Table", designer:"Isha Nair", status:"Revision", statusClass:"revision", due:"Sep 01" },
    { id:"DJ-2026-072", title:"Corporate Brand Deck", client:"Vantage Labs", designer:"Dev Shah", status:"Approval", statusClass:"approval", due:"Sep 02" }
  ],
  activities: [
    { icon:"bi-patch-check", text:"<strong>Nexa Retail</strong> approved proof V3", time:"12 minutes ago" },
    { icon:"bi-upload", text:"<strong>Maya Rao</strong> uploaded 4 design files", time:"38 minutes ago" },
    { icon:"bi-chat-left-text", text:"A revision was requested for <strong>DJ-2026-077</strong>", time:"1 hour ago" },
    { icon:"bi-credit-card", text:"Payment of <strong>₹32,500</strong> was recorded", time:"2 hours ago" }
  ],
  workload: [
    { name:"Maya Rao", active:5, load:92 }, { name:"Rohan Mehta", active:4, load:76 },
    { name:"Isha Nair", active:3, load:58 }, { name:"Dev Shah", active:2, load:42 }
  ],
  deadlines: [
    { month:"AUG", day:"31", title:"Festive Campaign Creatives", client:"Nexa Retail" },
    { month:"SEP", day:"01", title:"Restaurant Menu Refresh", client:"Saffron Table" },
    { month:"SEP", day:"02", title:"Corporate Brand Deck", client:"Vantage Labs" }
  ]
};
export const dashboardService = { getSummary: () => data };
