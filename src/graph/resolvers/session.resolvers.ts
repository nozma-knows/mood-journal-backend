import {
  SessionResolvers,
  LoginInput,
  LogoutInput,
} from "./../../__generated__/resolvers-types";
const { prisma } = require("../../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mutation Resolvers for managing a users session
export const sessionMutationResolvers: SessionResolvers = {
  // Login Mutation
  login: async (parent: any, args: { input: LoginInput }) => {
    // Grab args
    const { email, password } = args.input;

    // Grab args error handling
    if (!email || !password) {
      throw new Error("Required parameter is missing.");
    }

    // Grab login
    const login = await prisma.login.findUnique({
      where: {
        email: email,
      },
    });

    // Grab login error handling
    if (!login) {
      throw new Error("Invalid email or password");
    }

    // Verify if password is correct
    const correctPassword = await bcrypt.compare(
      password,
      login.hashedPassword
    );

    // Incorrect password error handling
    if (!correctPassword) {
      throw new Error("Invalid email or password");
    }

    // Grab user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Grab user error handling
    if (!user) {
      throw new Error("Grabbing user");
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_PRIVATE_KEY
    );

    // Create JWT token error handling
    if (!token) {
      throw new Error("Error creating JWT token");
    }

    // Grab session
    const session = await prisma.session.findUnique({
      where: {
        userId: user.id,
      },
    });

    // Create exiry and set to now + 4 hours
    const date = new Date();
    const expiry = new Date(date.setHours(date.getHours() + 4));

    // If session exists, update and return session
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

    // If session doesn't exist, create and return session
    return await prisma.session.create({
      data: {
        token,
        expiry,
        userId: user.id,
      },
    });
  },

  // Logout Mutaiton
  logout: async (parent: any, args: { input: LogoutInput }) => {
    // Grab args
    const { sessionId } = args.input;

    // Grab args error handling
    if (!sessionId) {
      throw new Error("Required parameter is missing.");
    }

    // Delete session
    const logout = await prisma.session.delete({
      where: {
        id: Number(args.input.sessionId),
      },
    });

    // Delete session error handling
    if (!logout) {
      throw new Error("Invalid session id");
    }

    // return deleted session
    return logout;
  },
};
