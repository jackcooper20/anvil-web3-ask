import { ChildProcess, spawn } from 'child_process';
import { Socket } from 'net';
import axios from 'axios';

interface AnvilConfig {
    host?: string;
    port?: string;
    [key: string]: string | boolean | undefined;
}

export class AnvilInstance {
    private config: AnvilConfig;
    private cliConfig: string[];
    private anvilProcess: ChildProcess;
    private readonly livelinessTimeout: number;

    private defaultConfigSetters: { [key: string]: () => string } = {
        host: () => "127.0.0.1",
        port: () => AnvilInstance.findFreePort(),
    };

    constructor(
        config: AnvilConfig = {},
        suppressAnvilOutput: boolean = true,
        livelinessTimeout: number = 60
    ) {
        this.config = {};
        this.cliConfig = [];
        this.livelinessTimeout = livelinessTimeout;

        // Populate config
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

        // Start anvil process
        this.anvilProcess = spawn("anvil", this.cliConfig, {
            stdio: suppressAnvilOutput ? 'ignore' : 'inherit'
        });

        // Setup cleanup handlers
        process.on('exit', () => this.kill());
        process.on('SIGINT', () => process.exit(0));
        process.on('SIGTERM', () => process.exit(0));

        // Wait for anvil to be ready
        this.waitUntilLive();
    }

    get url(): string {
        return `${this.config.host}:${this.config.port}`;
    }

    get httpUrl(): string {
        return `http://${this.url}`;
    }

    get wsUrl(): string {
        return `ws://${this.url}`;
    }

    kill(): void {
        this.anvilProcess.kill();
    }

    private static findFreePort(): string {
        const server = new Socket();
        server.listen(0);
        const address = server.address();
        server.close();
        
        if (address && typeof address !== 'string') {
            return address.port.toString();
        }
        throw new Error("Could not find free port");
    }

    private async waitUntilLive(): Promise<void> {
        const endTime = Date.now() + (this.livelinessTimeout * 1000);

        while (Date.now() < endTime) {
            try {
                const response = await axios.post(
                    this.httpUrl,
                    {
                        method: "web3_clientVersion",
                        params: [],
                        id: "0",
                        jsonrpc: "2.0",
                    }
                );
                
                if (response.status === 200) {
                    return;
                }
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, 1));
                continue;
            }
        }

        throw new Error(
            `Unable to connect to ${this.httpUrl} after ${this.livelinessTimeout} seconds.`
        );
    }
} 