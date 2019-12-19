import { Workspace, RunService, PhysicsService, Players } from "@rbxts/services"
import { compare, decelerate, calculateNewSpeed } from "shared/module"
import { VELOCITY_DIFF, AIR_RESISTANCE_FACTOR, PROJECTILES_COLLISION_GROUP_NAME, PLAYERS_COLLISION_GROUP_NAME, PLAYER_THROW_BALL_VELOCITY_FACTOR } from "shared/constants"

// Global data structures
const freeBalls:BasePart[] = []

const freeBallTouchConnections = new Map<BasePart, RBXScriptConnection>();

// Run everything here once when server starts
function init() {
    // Handle collision groups
    const projectilesCollisionGroupId = PhysicsService.CreateCollisionGroup(PROJECTILES_COLLISION_GROUP_NAME)
    const playersCollisionGroupId = PhysicsService.CreateCollisionGroup(PLAYERS_COLLISION_GROUP_NAME)
    PhysicsService.CollisionGroupSetCollidable(PLAYERS_COLLISION_GROUP_NAME, PROJECTILES_COLLISION_GROUP_NAME, false)
    
    // Connect events
    const shootBallEvent = new Instance("RemoteEvent", game.GetService("ReplicatedStorage"))
    shootBallEvent.Name = "ShootBallEvent"
    shootBallEvent.OnServerEvent.Connect(onShootBallEventFired)
    Players.PlayerAdded.Connect(player => {
        player.CharacterAdded.Connect(char => {
            const onChildAdded = (child: Instance) => {
                if (!child.IsA("BasePart")){
                    return
                }
                PhysicsService.SetPartCollisionGroup(child, PLAYERS_COLLISION_GROUP_NAME)
            }
            char.ChildAdded.Connect(onChildAdded)
            char.GetChildren().forEach(onChildAdded)
        })
    })

    RunService.Heartbeat.Connect((step: number) => {
        // Wrap a tool around balls that have stopped moving
        const ballsToRemove: number[] = []
        freeBalls.forEach((ball, idx) => {
            if (compare(ball.Velocity, VELOCITY_DIFF)) {
                const tool = new Instance("Tool")
                ball.Parent = tool
                tool.Parent = Workspace
                ball.Velocity = new Vector3(0,0,0)
                ball.RotVelocity = new Vector3(0,0,0)
                ball.Massless = true
                const connection = freeBallTouchConnections.get(ball)
                if (connection !== undefined){
                    connection.Disconnect()
                }
                ballsToRemove.insert(0, idx)
            }
        })
        ballsToRemove.forEach(idx => {
            freeBalls.remove(idx)
        })
        
    })
    
    RunService.Stepped.Connect((step: number) =>{
        // attenuate the velocity of the balls over time to simulate air resistance
        freeBalls.forEach(ball => {
            ball.Velocity = decelerate(ball.Velocity, AIR_RESISTANCE_FACTOR)
        })
    })
}

function onShootBallEventFired(player: Player, ball: unknown, direction: unknown, power: unknown){
    print(`${player.Name} just shot a ball`)
    
    if (!typeIs(ball, "Instance") || !ball.IsA("Tool")){
        return
    }

    if (!typeIs(direction, "Vector3")){
        return
    }

    if (!typeIs(power, "number")){
        return
    }
    
    const handle = ball.FindFirstChild("Handle")
    
    if (handle === undefined){
        return
    }
    
    if (!handle.IsA("Part")){
        return 
    }
    
    const newHandle = handle.Clone()
    newHandle.Massless = false
    PhysicsService.SetPartCollisionGroup(newHandle, PROJECTILES_COLLISION_GROUP_NAME)
    ball.Destroy()

    // Apply anti-gravity
    applyAntiGravityToPart(newHandle)

    newHandle.Parent = Workspace
    newHandle.CanCollide = true
    const newSpeed = calculateNewSpeed(power)
    print("POWER: ", power, "VELOCITY: ", newSpeed)
    newHandle.Velocity = direction.mul(newSpeed)
    const connection = newHandle.Touched.Connect(part => onTouchPlayer(part, player))
    freeBallTouchConnections.set(newHandle, connection)
    freeBalls.push(newHandle)
}

function applyAntiGravityToPart(part: BasePart) {
    const counterGravity = new Instance("VectorForce", Workspace)
    counterGravity.Attachment0 = new Instance("Attachment", part)
    counterGravity.Force = new Vector3(0, part.GetMass() * Workspace.Gravity, 0)
    counterGravity.ApplyAtCenterOfMass = true
    counterGravity.RelativeTo = Enum.ActuatorRelativeTo.World
}

// Kills a player if ball touches player other than yourself
function onTouchPlayer(part: BasePart, localPlayer: Player) {
    if (part.Parent!.IsA("Model") && part.Parent!.FindFirstChildOfClass("Humanoid") !== undefined){
        const associatedPlayer = Players.GetPlayerFromCharacter(part.Parent!)
        if (associatedPlayer === localPlayer) {
            return
        }
        part.Parent.FindFirstChildOfClass("Humanoid")!.Health = 0
    }
}

// init server script
init()


export {}