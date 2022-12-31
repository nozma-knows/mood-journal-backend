import {
  SessionResolvers,
  LoginInput,
  LogoutInput,
} from "./../../__generated__/resolvers-types";
const { prisma } = require("../../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const sessionMutationResolvers: SessionResolvers = {
  login: async (parent: any, args: { input: LoginInput }) => {
    const login = await prisma.login.findUnique({
      where: {
        email: args.input.email,
      },
    });
    if (!login) {
      throw new Error("Invalid email or password");
    }

    const correctPassword = await bcrypt.compare(
      args.input.password,
      login.hashedPassword
    );

    if (!correctPassword) {
      throw new Error("Invalid email or password");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: args.input.email,
      },
    });

    if (!user) {
      throw new Error("Grabbing user");
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_PRIVATE_KEY
    );

    const session = await prisma.session.findUnique({
      where: {
        userId: user.id,
      },
    });

    const date = new Date();
    const expiry = new Date(date.setHours(date.getHours() + 4));

    if (session) {
      return await prisma.session.update({
        where: {
          userId: user.id,
        },
        data: {
          token,
          expiry,
        },
      });
    }

    return await prisma.session.create({
      data: {
        token,
        expiry,
        userId: user.id,
      },
    });
  },

  logout: async (parent: any, args: { input: LogoutInput }) => {
    const logout = await prisma.session.delete({
      where: {
        id: Number(args.input.sessionId),
      },
    });

    if (!logout) {
      throw new Error("Invalid session id");
    }

    return logout;
  },
};
