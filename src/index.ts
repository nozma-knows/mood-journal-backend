import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { readFileSync } from "fs";
import { resolvers } from "./graph/resolvers";
const { prisma } = require("./prisma/client");

const typeDefs = readFileSync("./src/graph/schema.graphql", {
  encoding: "utf-8",
});

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/api",
  });

  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  );
};

startServer();
