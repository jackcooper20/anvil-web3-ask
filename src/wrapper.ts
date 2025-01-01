import { ChildProcess, spawn } from "child_process";
import { Socket, AddressInfo } from "net";
import axios, { AxiosResponse, AxiosError } from "axios";

interface AnvilConfig {
  host?: string;
  port?: string;
  accounts?: number;
  blockTime?: number;
  balance?: string;
  forkUrl?: string;
  forkBlockNumber?: number;
  [key: string]: string | number | boolean | undefined;
}

interface JsonRpcRequest {
  method: string;
  params: unknown[];
  id: string;
  jsonrpc: "2.0";
}

export class AnvilInstance {
  private readonly config: AnvilConfig;
  private readonly cliConfig: string[];
  private readonly anvilProcess: ChildProcess;
  private readonly livelinessTimeout: number;

  private readonly defaultConfigSetters: Record<string, () => string> = {
    host: () => "127.0.0.1",
    port: () => AnvilInstance.findFreePort(),
  };

  constructor(
    config: AnvilConfig = {},
    suppressAnvilOutput = true,
    livelinessTimeout = 60
  ) {
    this.config = {};
    this.cliConfig = [];
    this.livelinessTimeout = livelinessTimeout;

    this.initializeConfig(config);
    this.startAnvilProcess(suppressAnvilOutput);
    this.setupCleanupHandlers();
    void this.waitUntilLive();
  }

  public get url(): string {
    return `${this.config.host}:${this.config.port}`;
  }

  public get httpUrl(): string {
    return `http://${this.url}`;
  }

  public get wsUrl(): string {
    return `ws://${this.url}`;
  }

  public kill(): void {
    this.anvilProcess.kill();
  }

  private initializeConfig(config: AnvilConfig): void {
    for (const [key, value] of Object.entries(config)) {
      if (value === undefined && this.defaultConfigSetters[key]) {
        this.config[key] = this.defaultConfigSetters[key]();
      } else {
        this.config[key] = value;
      }

      if (this.config[key] !== undefined) {
        const formattedKey = key.replace(/_/g, "-");
        if (typeof this.config[key] === "boolean") {
          this.cliConfig.push(`--${formattedKey}`);
        } else {
          this.cliConfig.push(`--${formattedKey}`, String(this.config[key]));
        }
      }
    }
  }

  private startAnvilProcess(suppressAnvilOutput: boolean): void {
    this.anvilProcess = spawn("anvil", this.cliConfig, {
      stdio: suppressAnvilOutput ? "ignore" : "inherit",
    });
  }

  private setupCleanupHandlers(): void {
    process.on("exit", () => this.kill());
    process.on("SIGINT", () => process.exit(0));
    process.on("SIGTERM", () => process.exit(0));
  }

  private static findFreePort(): string {
    const server = new Socket();
    server.listen(0);
    const address = server.address() as AddressInfo;
    server.close();

    if (!address) {
      throw new Error("Could not find free port");
    }

    return address.port.toString();
  }

  private async waitUntilLive(): Promise<void> {
    const endTime = Date.now() + this.livelinessTimeout * 1000;
    const request: JsonRpcRequest = {
      method: "web3_clientVersion",
      params: [],
      id: "0",
      jsonrpc: "2.0",
    };

    while (Date.now() < endTime) {
      try {
        const response: AxiosResponse = await axios.post(this.httpUrl, request);
        if (response.status === 200) {
          return;
        }
      } catch (error) {
        if (error instanceof AxiosError && error.code === "ECONNREFUSED") {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    throw new Error(
      `Unable to connect to ${this.httpUrl} after ${this.livelinessTimeout} seconds.`
    );
  }
}
