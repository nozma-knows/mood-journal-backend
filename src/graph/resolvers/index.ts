const { prisma } = require("../../prisma/client");
import { entryResolvers } from "./entry.resolvers";

export const resolvers: any = {
  Query: {
    ...entryResolvers,
  },
};
