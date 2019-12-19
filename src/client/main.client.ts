import { BallManager } from "./BallManager";
import { RunService } from "@rbxts/services";
import { LauncherManager } from "./LauncherManager";
import { PlayerController } from "./PlayerCntroller";

const playerController = new PlayerController()
const ballManager = new BallManager()
const launcherManager = new LauncherManager()

let ranCount = 0

function onTick(step: number) {
    ranCount += 1
    if (ballManager.isCharging && (ranCount % 30) === 0) {
        print("Power level: ", ballManager.getPowerLevel())
    }
}

RunService.Heartbeat.Connect(onTick)