import { clientRepository } from "../repositories/client.repository.js";
const clean = (value, max=500) => String(value||"").trim().slice(0,max);
function validate(body){const input={client_name:clean(body.client_name,120),company_name:clean(body.company_name,160),phone:clean(body.phone,30),whatsapp:clean(body.whatsapp,30),email:clean(body.email,254).toLowerCase(),address:clean(body.address,1000),city:clean(body.city,100),state:clean(body.state,100),postal_code:clean(body.postal_code,20),notes:clean(body.notes,2000),status:body.status==="INACTIVE"?"INACTIVE":"ACTIVE"};const errors={};if(input.client_name.length<2)errors.client_name="Client name must contain at least 2 characters";if(input.email&&!/^\S+@\S+\.\S+$/.test(input.email))errors.email="Enter a valid email address";if(input.phone&&!/^[+\d][\d\s()-]{6,29}$/.test(input.phone))errors.phone="Enter a valid phone number";return {input,errors};}
export const clientService={
  list:(filters)=>clientRepository.list(filters), find:(id)=>clientRepository.find(id),
  async create(body){const {input,errors}=validate(body);if(Object.keys(errors).length)throw Object.assign(new Error("Please correct the highlighted fields"),{status:422,errors});return clientRepository.create(input)},
  async update(id,body){const {input,errors}=validate(body);if(Object.keys(errors).length)throw Object.assign(new Error("Please correct the highlighted fields"),{status:422,errors});return clientRepository.update(id,input)},
  remove:(id)=>clientRepository.remove(id)
};
