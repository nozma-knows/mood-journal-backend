const { prisma } = require("../../prisma/client");
import { EntryResolvers } from "../../__generated__/resolvers-types";

export const entryResolvers: EntryResolvers = {
  entries: () => {
    return prisma.entry.findMany();
  },
};
