import { AnvilInstance } from "../wrapper";
import axios from "axios";
import { Socket } from "net";

jest.mock("axios");
jest.mock("net");

describe("AnvilInstance", () => {
  let instance: AnvilInstance;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock successful axios response
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: { result: "anvil/v0.1.0" },
    });

    // Mock Socket for port finding
    (Socket as jest.Mock).mockImplementation(() => ({
      listen: jest.fn(),
      address: jest.fn().mockReturnValue({ port: 8545 }),
      close: jest.fn(),
    }));
  });

  afterEach(() => {
    if (instance) {
      instance.kill();
    }
  });

  describe("constructor", () => {
    it("should initialize with default config", () => {
      instance = new AnvilInstance();
      expect(instance.httpUrl).toBe("http://127.0.0.1:8545");
      expect(instance.wsUrl).toBe("ws://127.0.0.1:8545");
    });

    it("should initialize with custom config", () => {
      instance = new AnvilInstance({
        host: "localhost",
        port: "8546",
        accounts: 20,
        blockTime: 5,
      });
      expect(instance.httpUrl).toBe("http://localhost:8546");
    });
  });

  describe("URL getters", () => {
    beforeEach(() => {
      instance = new AnvilInstance({
        host: "localhost",
        port: "8545",
      });
    });

    it("should return correct url", () => {
      expect(instance.url).toBe("localhost:8545");
    });

    it("should return correct http url", () => {
      expect(instance.httpUrl).toBe("http://localhost:8545");
    });

    it("should return correct ws url", () => {
      expect(instance.wsUrl).toBe("ws://localhost:8545");
    });
  });

  describe("waitUntilLive", () => {
    it("should resolve when anvil is ready", async () => {
      instance = new AnvilInstance();
      // The constructor calls waitUntilLive internally
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        method: "web3_clientVersion",
        params: [],
        id: "0",
        jsonrpc: "2.0",
      });
    });

    it("should throw error after timeout", async () => {
      (axios.post as jest.Mock).mockRejectedValue(
        new Error("Connection refused")
      );

      await expect(async () => {
        instance = new AnvilInstance({}, true, 1); // 1 second timeout
      }).rejects.toThrow("Unable to connect");
    });
  });

  describe("port finding", () => {
    it("should find a free port when none specified", () => {
      instance = new AnvilInstance();
      expect(Socket).toHaveBeenCalled();
    });

    it("should use specified port when provided", () => {
      instance = new AnvilInstance({ port: "8545" });
      expect(Socket).not.toHaveBeenCalled();
    });
  });
});
