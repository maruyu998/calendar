import { fetchItem as mongoFetchItem } from "@server/mongoose/CaleventModel";
import { CaleventSchema, CaleventType } from "@share/types/calevent";
import { CaleventIdType } from "@share/types/calevent";
import { UserIdType } from "maruyu-webcommons/commons/types/user";
import { InternalServerError } from "@ymwc/errors";
import { z } from "zod";

export function validateCalevent<T extends z.ZodRawShape>(
  calevent: CaleventType,
  caleventSchema: z.ZodObject<T>,
):z.infer<typeof caleventSchema>{
  const { success, error, data: parsedCalevent } = caleventSchema.safeParse(calevent);
  if(!success){
    console.dir(error.format());
    throw new InternalServerError("[validateCalevent]:calevent schema does not match.");
  }
  return parsedCalevent;
}

export async function fetchCalevent({
  userId,
  caleventId,
}:{
  userId: UserIdType,
  caleventId: CaleventIdType,
}):Promise<CaleventType>{
  const calevent = await mongoFetchItem({ userId, caleventId });
  if(calevent == null) throw new InternalServerError("calevent is not found");
  const { success, error, data: parsedCalevent } = CaleventSchema.safeParse(calevent);
  if(!success){
    console.dir(error.format());
    throw new InternalServerError("[fetchCalevent]:calevent schema does not match.");
  }
  return parsedCalevent;
}

