/** @jest-environment ./src/utils/enableVersionCheck.ts */
import {
  createTestNode,
  matchServerVersion,
  optionalDescribe,
} from "@test-utils";
import { KurrentDBClient, jsonEvent } from "@kurrent/kurrentdb-client";

describe("appendToStream - batch append - flood", () => {
  const supported = matchServerVersion`>=21.10`;

  const node = createTestNode();
  let client!: KurrentDBClient;

  beforeAll(async () => {
    await node.up();
    client = KurrentDBClient.connectionString(node.connectionString());
  });

  afterAll(async () => {
    await node.down();
  });

  optionalDescribe(supported)("Supported (>=21.10)", () => {
    test("Can handle multiple appends within the same event loop", async () => {
      const streamName = "batchFlood";
      const numberOfEvents = 10_000;
      const value = "A".repeat(904);

      const oneKiloByteEvent = () =>
        jsonEvent({
          type: "AnyEventType",
          data: { value },
        });

      const requests = [];
      for (let i = 0; i < numberOfEvents; i++) {
        requests.push(client.appendToStream(streamName, oneKiloByteEvent()));
      }
      await Promise.all(requests);

      await client.dispose();
    });
  });
});
