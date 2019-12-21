import { BallManager } from "./BallManager";
import { RunService } from "@rbxts/services";
import { LauncherManager } from "./LauncherManager";
import { PlayerController } from "./PlayerCntroller";
import { PlayerGuiW } from "./PlayerGuiW";

const playerController = new PlayerController()
const playerGuiW = new PlayerGuiW()
const ballManager = new BallManager(playerGuiW)
const launcherManager = new LauncherManager()