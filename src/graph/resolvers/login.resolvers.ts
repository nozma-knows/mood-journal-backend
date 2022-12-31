import {
  LoginResolvers,
  CreateLoginInput,
} from "./../../__generated__/resolvers-types";
const { prisma } = require("../../prisma/client");
import { User } from "@prisma/client";
const bcrypt = require("bcrypt");

export const loginMutationResolvers: LoginResolvers = {
  createLogin: async (parent: any, args: { input: CreateLoginInput }) => {
    const { firstName, lastName, email, password } = args.input;
    // HANDLE ERROR PARSING INPUTS
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
      },
    });
    // HANDLE ERROR CREATING USER
    const hashedPassword = await bcrypt.hash(password, 10);
    // HANDLE ERROR HASHING PASSWORD
    const login = await prisma.login.create({
      data: {
        email,
        hashedPassword,
        userId: user.id,
      },
    });
    // HANDLE ERROR CREATING LOGIN
    return login;
  },
};
