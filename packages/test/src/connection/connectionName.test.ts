import { KurrentDBClient } from "@kurrent/kurrentdb-client";

describe("connectionName", () => {
  test("connection string", async () => {
    const CONNECTION_NAME = "my great connection";
    const client = KurrentDBClient.connectionString`esdb://host?connectionName=${CONNECTION_NAME}`;

    expect(client.connectionName).toBe(CONNECTION_NAME);
  });

  test("default", async () => {
    const client = KurrentDBClient.connectionString`esdb://somewhere`;
    expect(client.connectionName).toMatch(
      // a (v4) uuid
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    );
  });
});
