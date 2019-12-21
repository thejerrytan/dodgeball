import { Players, Workspace, RunService } from "@rbxts/services";
import { PLAYER_MAX_POWER_LEVEL, PLAYER_MAX_POWER_NUM_MILLISECONDS, PLAYER_MIN_POWER_NUM_MILLISECONDS } from "shared/constants";
import { assertFindFirstNamedChildWhichIsA, waitForNamedChildWhichIsA } from "shared/module";
import { PlayerGuiW } from "./PlayerGuiW";

const replicatedStorage = game.GetService("ReplicatedStorage")

export class BallManager {
    connections: RBXScriptConnection[]
    startTime: number
    isCharging: boolean
    count: number = 0
    playerGuiW: PlayerGuiW

    constructor (playerGuiW: PlayerGuiW) {
        this.connections = []
        this.startTime = os.time()
        this.isCharging = false
        this.playerGuiW = playerGuiW
        
        Players.LocalPlayer.CharacterAdded.Connect(character => this.onCharacterAdded(character))
        
        if (Players.LocalPlayer.Character !== undefined){
            this.onCharacterAdded(Players.LocalPlayer.Character)
        }

        RunService.Heartbeat.Connect(step => this.onTick(step))
    }
    
    private onCharacterAdded (character:Model) {
        character.ChildAdded.Connect(child => this.onChildAdded(child))
    }
    
    private onChildAdded(child:Instance){
        if (!child.IsA("Tool")){
            return
        }
        
        // Modfiy physicsl properties
        const handle = waitForNamedChildWhichIsA(child, "Handle", "Part")
        handle.Color = new Color3(1, 0, 0)
        
        // Attach behaviors
        this.connections.push(child.Activated.Connect(() => this.onToolActivate(child)))
        this.connections.push(child.Deactivated.Connect(() => this.onToolDeactivate(child)))
        print("Connected")
    }
    
    private onToolActivate(tool: Tool) {
        this.startTime = tick()
        this.isCharging = true
    }
    
    private onToolDeactivate(tool: Tool) {
        const power = this.getPowerLevel()
        const shootBallEvent = replicatedStorage.WaitForChild("ShootBallEvent")
    
        if (!shootBallEvent.IsA("RemoteEvent")){
            return
        }
        const targetPos = Players.LocalPlayer.GetMouse().Hit.Position
        const srcPos = Players.LocalPlayer.Character!.GetPrimaryPartCFrame().Position
        const fireDirection = targetPos.sub(srcPos).Unit
        shootBallEvent.FireServer(tool, fireDirection, power)

        this.isCharging = false
        this.playerGuiW.updatePowerBar(0)
        // tool.Parent = Workspace;

        // this.connections.forEach(connection => {
        //     connection.Disconnect();
        // })
    }

    public getPowerLevel() {
        if (!this.isCharging) {
            return 0
        }
        const timeElapsed = (tick() - this.startTime) * 1000 // milliseconds
        // const power = math.min(math.max(PLAYER_MIN_POWER_NUM_MILLISECONDS, timeElapsed), PLAYER_MAX_POWER_NUM_MILLISECONDS) / PLAYER_MAX_POWER_NUM_MILLISECONDS * PLAYER_MAX_POWER_LEVEL
        const power = math.min(math.max(0, timeElapsed), PLAYER_MAX_POWER_NUM_MILLISECONDS) / PLAYER_MAX_POWER_NUM_MILLISECONDS * PLAYER_MAX_POWER_LEVEL
        return power
    }

    private onTick(step: number) {
        this.count += 1
        if (this.isCharging) {
            const powerLevel = this.getPowerLevel()
            this.playerGuiW.updatePowerBar(powerLevel)
            if (this.count % 30 === 0) {
                print("Power level: ", powerLevel)
            }
        }
    }
}

