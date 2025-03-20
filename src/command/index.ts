/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {ChildProcess} from "node:child_process";
import { spawn, spawnSync} from "node:child_process";

export class Command {
	private readonly process: ChildProcess;
	private readonly promise!: Promise<number | null>;
	private resolve!: (value: number | null) => void;
	private terminated = false;
	private outputBuffers: any[] = [];


 	constructor(
		private readonly command: string,
		private readonly debug?: boolean
	) {
		this.promise = new Promise((resolve) => {
			this.resolve = resolve;
		});
		this.process = spawn("sh", ["-c", this.command] );
		if(this.debug){
			this.process.stdout?.on("data", (data) => {
				this.outputBuffers.push(data);
			});
			this.process.stderr?.on("data", (data) => {
				this.outputBuffers.push(data);
			});
		}
		this.process.on("close", (exitCode) => this.onClose(exitCode));
		this.process.on("exit", (exitCode) => this.onExit(exitCode));
		this.terminated = false;
  	}

	public getPromise(): Promise<number | null> {
		return this.promise;
	}

	private onExit(exitCode: number | null) {
		this.resolve(exitCode);
		if(this.debug) {
			console.log(this.outputBuffers.join(""));
		}
		this.terminated = true;
	}

	private onClose(exitCode: number | null) {
		this.resolve(exitCode);
		if (!this.terminated) this.kill();
	}

	private kill() {
		try {
			const processPid = spawnSync(
				"ps",
				[
					"-o",
					"pid",
					"--no-headers",
					"--ppid",
					this.process.pid!.toString()
				],
				{
					encoding: "utf8"
				});

			const pid = parseInt(processPid.output[1]!);

			process.kill(pid, "SIGTERM");
			this.process.kill();

		} catch (error) {
			if (error instanceof Error) {
				console.warn(error.message);
			}
			else {
				console.warn(error);
			}
		}
	}
}
