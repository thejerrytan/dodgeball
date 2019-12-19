import { Players, InsertService, UserInputService, RunService } from "@rbxts/services";
import { assertFindFirstNamedChildWhichIsA, waitForNamedChildWhichIsA } from "shared/module";

export class PlayerController {
    player: Player = Players.LocalPlayer
    humanoid: Humanoid | undefined

    constructor () {
        this.player.CharacterAdded.Connect(character => this.onCharacterAdded(character))
        if (Players.LocalPlayer.Character !== undefined){
            this.onCharacterAdded(Players.LocalPlayer.Character)
        }
        this.init()
    }

    private init() {
        RunService.Heartbeat.Connect(() => {
            this.setCharacterMovementSpeed()
        })
    }

    private onCharacterAdded(character: Model){
        const humanoid = waitForNamedChildWhichIsA(character, "Humanoid", "Humanoid")
        this.humanoid = humanoid        
    }

    private setCharacterMovementSpeed() {
        if (UserInputService.IsKeyDown(Enum.KeyCode.LeftShift) && this.isCharacterMoving()) {
            this.humanoid!.WalkSpeed = 30
        } else {
            this.humanoid!.WalkSpeed = 16 // TODO: What is the roblox constant here for normal walkspeed?
        }
    }

    private isCharacterMoving() {
        return UserInputService.IsKeyDown(Enum.KeyCode.W) ||
            UserInputService.IsKeyDown(Enum.KeyCode.A) ||
            UserInputService.IsKeyDown(Enum.KeyCode.D) ||
            UserInputService.IsKeyDown(Enum.KeyCode.S) // Not sure if we want to allow running backwards
    }
}