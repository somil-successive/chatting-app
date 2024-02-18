import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";

import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";

import { PubSub } from "graphql-subscriptions";
import bodyParser from "body-parser";

export async function startServer() {
  const pubsub = new PubSub();

  const app = express();

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: { pubsub },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  app.use(cors());

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  app.use(bodyParser.json());
  await server.start();
  app.use("/graphql", expressMiddleware(server));

  httpServer.listen(5500, () => console.log(`Server running at PORT 5500`));
}