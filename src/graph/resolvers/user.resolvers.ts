const { prisma } = require("../../prisma/client");
import { UserResolvers } from "../../__generated__/resolvers-types";

export const userResolvers: UserResolvers = {
  users: () => {
    return prisma.user.findMany();
  },
};
