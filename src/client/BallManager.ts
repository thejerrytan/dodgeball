import { Players, Workspace } from "@rbxts/services";

const replicatedStorage = game.GetService("ReplicatedStorage")

export class BallManager {
    connections: RBXScriptConnection[]
    
    constructor () {
        this.connections = []
        
        Players.LocalPlayer.CharacterAdded.Connect(character => this.onCharacterAdded(character))
        
        if (Players.LocalPlayer.Character !== undefined){
            this.onCharacterAdded(Players.LocalPlayer.Character)
        }
    }
    
    private onCharacterAdded (character:Model) {
        character.ChildAdded.Connect(child => this.onChildAdded(child))
    }
    
    private onChildAdded(child:Instance){
        if (!child.IsA("Tool")){
            return
        }
        
        print("Added tool!");
        this.connections.push(child.Activated.Connect(() => this.onToolActivate(child)))
        // this.connections.push(child.Deactivated.Connect(() => this.onToolDeactivate(child)))
    }
    
    private onToolActivate(tool: Tool) {
        print("tool activated")
        const shootBallEvent = replicatedStorage.WaitForChild("ShootBallEvent")

        if (!shootBallEvent.IsA("RemoteEvent")){
            return
        }
        const targetPos = Players.LocalPlayer.GetMouse().Hit.Position
        const srcPos = Players.LocalPlayer.Character!.GetPrimaryPartCFrame().Position
        const fireDirection = targetPos.sub(srcPos).Unit
        shootBallEvent.FireServer(tool, fireDirection)
    }

    private onToolDeactivate(tool: Tool) {
        print("tool deactivated")
        tool.Parent = Workspace;

        this.connections.forEach(connection => {
            connection.Disconnect();
        })
    }
}

