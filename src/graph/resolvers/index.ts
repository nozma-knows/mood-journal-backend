const { prisma } = require("../../prisma/client");
// import { entryResolvers } from "./entry.resolvers";
// import { userResolvers } from "./user.resolvers";
import { loginMutationResolvers } from "./login.resolvers";
import { sessionMutationResolvers } from "./session.resolvers";

export const resolvers: any = {
  // Query: {
  //   ...entryResolvers,
  //   ...userResolvers,
  // },
  Mutation: {
    ...loginMutationResolvers,
    ...sessionMutationResolvers,
  },
};
