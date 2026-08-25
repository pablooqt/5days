# AGENTS.md

## Current Product Decision

Live View / Walk Mode has been removed from the product. 5days is Management Mode only: users inspect and control the predefined interactive 3D building from the browser. Do not reintroduce a `/live` route, player, walk-mode HUD, physics runtime, or Walk Mode marketing surface unless the product requirements are explicitly changed.

## 1. Project Mission

This repository contains a production-oriented web application for an **Interactive 3D Building Management / Digital Twin** experience.

The product is a finished website/web application where users interact with a predefined 3D building.

This is **NOT**:

* a 3D editor
* a CAD application
* a BIM application
* a floor-plan editor
* a building configurator
* a level editor
* a drag-and-drop building builder

The building layout is authored by developers through code/configuration.

Users consume and interact with the finished experience.

The core product experience is:

```text
Landing Page
    ↓
Interactive 3D Building
    ↓
Management Mode
```

The 3D building is the primary interaction interface, not an editor.

---

## 2. Source of Truth

Before making any meaningful change, read:

1. `PRD.md`
2. this `AGENTS.md`
3. relevant existing source files

`PRD.md` defines **what the product must do**.

`AGENTS.md` defines **how the codebase must be developed**.

When requirements conflict:

1. explicit user requirements
2. `PRD.md`
3. `AGENTS.md`
4. existing implementation assumptions

Do not silently invent requirements.

When something is unclear, preserve the simplest architecture consistent with the PRD and document the uncertainty.

---

## 3. Implementation Philosophy

Prioritize:

* simplicity
* maintainability
* performance
* predictable behavior
* incremental development
* clear separation of concerns
* reusable components
* strong typing
* testability

Avoid:

* premature abstraction
* speculative features
* unnecessary dependencies
* over-engineering
* large rewrites
* hidden magic
* duplicated business logic

Build the smallest correct implementation first.

Prefer a simple solution that can evolve over a clever solution that requires extensive infrastructure.

---

## 4. Product Boundary

The product is a **finished web application**.

Do not introduce user-facing features for:

* creating rooms
* editing walls
* moving walls
* resizing rooms
* creating floors
* deleting floors
* editing geometry
* arranging furniture
* changing building layout

The building is predefined by developer-authored configuration.

Procedural generation exists only to render that predefined building.

---

## 5. Core Technology

Preferred stack:

* Next.js
* React
* TypeScript
* React Three Fiber
* Three.js
* Drei
* Zustand
* Tailwind CSS
* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Realtime
* Rapier when physics/collision is needed

Use alternatives only when there is a concrete technical reason.

Do not add dependencies merely because they are popular.

---

## 6. 3D Architecture

### Core rule

**R3F is the primary 3D rendering layer.**

Use:

* R3F for React/Three.js integration
* Three.js for low-level 3D behavior
* Drei for common helpers
* Rapier for physics where appropriate

The building should be primarily procedural/modular.

MVP must NOT depend on:

* Blender
* GLB/GLTF
* external 3D asset pipelines

External 3D assets may be added later as optional enhancements.

---

## 7. Procedural Building System

The building should be generated from structured data/configuration.

Conceptual hierarchy:

```text
Building
├── Floors
│   ├── Rooms
│   │   ├── Walls
│   │   ├── FloorSurface
│   │   ├── Doors
│   │   └── Windows
│   └── Corridors/Common Areas
└── Vertical Systems
    ├── Stairs
    └── Elevators
```

Prefer reusable components such as:

```tsx
<Building />
<Floor />
<Room />
<Wall />
<FloorSurface />
<Door />
<Window />
<Stairs />
<Elevator />
<Device />
<DeviceMarker />
```

Use configuration/data to describe positions and dimensions.

Do not hardcode an entire building into one giant component.

---

## 8. 3D vs UI Separation

Keep 3D rendering and application UI separate.

### 3D layer

Responsible for:

* building rendering
* rooms
* walls
* doors
* windows
* devices
* markers
* cameras
* animations
* player
* physics
* interaction detection

### React UI layer

Responsible for:

* navigation
* sidebar
* contextual panels
* device controls
* room information
* settings
* activity
* authentication
* notifications

Prefer HTML/CSS/React for normal application UI.

Do not recreate normal dashboard UI as 3D geometry.

---

## 9. Management Mode

Management Mode is the primary control interface.

It should support:

* building overview
* floor selection
* room selection
* device selection
* device highlighting
* camera focus
* floor visibility
* wall transparency/cutaway
* device filtering
* contextual device panel
* device control
* realtime status

The 3D scene should remain readable at all times.

Do not allow complex UI to obscure the main 3D experience unnecessarily.

---

## 10. State Management

Use Zustand for client-side shared state.

Good candidates:

* active mode
* selected building
* selected floor
* selected room
* selected device
* UI panel state
* interaction target
* camera target
* visibility state
* local interaction state

Do NOT automatically put all application data into Zustand.

Server/persistent data should remain in the server/data layer.

Clearly distinguish:

```text
Server State
Client State
3D Runtime State
Persistent State
```

Do not duplicate the same state unnecessarily across multiple layers.

---

## 12. Device Architecture

Devices must be generic and extensible.

Base concept:

```text
Device
├── type
├── id
├── roomId
├── floorId
├── status
├── capabilities
└── metadata
```

Examples:

### Air Conditioner

* power
* temperature
* mode

### Light

* power
* brightness

### Door

* state
* locked

### Elevator

* currentFloor
* targetFloor
* state

### CCTV

* online
* recording

### Sensor

* value
* unit
* status

Prefer capability-based architecture where practical.

Adding a new device type should not require rewriting the entire device system.

---

## 13. Stable IDs

Every interactive building object must have a stable identifier.

Examples:

```text
room-201
AC_201
LIGHT_201
DOOR_201
ELEVATOR_01
CCTV_201
```

The same logical ID must remain consistent across:

* configuration
* 3D runtime
* UI
* database
* realtime events
* audit logs

Do not rely on generated random IDs for persistent domain objects.

---

## 14. Object Interaction

Interactive objects should support appropriate combinations of:

* click
* pointer over
* selection
* focus
* interaction
* deselection

Selection should have clear visual feedback.

Prefer a reusable interaction abstraction instead of implementing unique behavior for every device.

For example:

```text
Interactable
├── targetId
├── type
├── capabilities
├── select()
├── focus()
└── interact()
```

Keep interaction behavior separate from visual rendering where practical.

---

## 15. Camera Rules

Management Mode:

* orthographic or semi-isometric camera
* orbit
* pan
* zoom
* focus
* reset
* smooth transitions

Avoid abrupt camera jumps unless explicitly intended.

Camera logic should not be duplicated across unrelated components.

---

## 16. Performance Rules

3D performance is a first-class concern.

Prefer:

* shared geometries
* shared materials
* instancing where appropriate
* memoization where useful
* frustum culling
* minimal unnecessary re-renders
* controlled shadows
* restrained lighting
* efficient interaction handling

Avoid:

* creating new geometry every render
* creating new materials every render
* unnecessary per-frame React state updates
* expensive effects everywhere
* one React component for every tiny static primitive unless there is a reason
* large unnecessary scene graphs

When rendering many identical objects, consider instancing.

When performance becomes questionable, measure before optimizing blindly.

---

## 17. React Rules for 3D

Do not treat every Three.js runtime value as React state.

High-frequency runtime values such as:

* player position
* camera position
* velocity
* animation progress

should generally be handled in appropriate runtime mechanisms rather than causing React re-renders every frame.

Use React state for actual application/UI state.

Use refs or runtime systems for high-frequency 3D state where appropriate.

---

## 18. Drei Usage

Prefer Drei for common utilities instead of reimplementing them.

Potential examples:

* `OrbitControls`
* `CameraControls`
* `Html`
* `Text`
* `Environment`
* `ContactShadows`
* `Float`

Do not add unnecessary custom abstractions when Drei already provides a clean solution.

---

## 19. External 3D Assets

MVP must not depend on GLB/GLTF or Blender.

If external assets are introduced later:

* they must remain optional
* they must not become the architectural foundation
* they should be isolated behind reusable asset components
* asset IDs/names must remain stable
* performance and licensing must be checked

Do not restructure the entire application around an external asset pack.

---

## 20. @liveroom-tech/react-immersive

`@liveroom-tech/react-immersive` may be evaluated as an optional supporting library.

It must NOT automatically become a core dependency.

Evaluate it only if it provides concrete value for things such as:

* object selection
* named mesh interaction
* object binding
* camera/object focus
* visibility
* material state
* animation helpers

The core MVP must remain based on:

* Three.js
* R3F
* Drei
* TypeScript

Do not introduce the library merely because it exists.

If using it would conflict with the procedural-building architecture, do not use it.

---

## 21. Supabase Rules

Use Supabase for persistent/server-side concerns such as:

* authentication
* buildings
* floors
* rooms
* devices
* device state
* events
* activity
* audit logs

Use Row Level Security.

Never rely exclusively on frontend permission checks.

Device-changing operations must be validated server-side.

---

## 22. Realtime Rules

Realtime updates should update the minimum required state.

Example:

```text
Supabase event
    ↓
device state update
    ↓
relevant application state
    ↓
3D visual update
    ↓
UI update
```

Do not force a complete scene rebuild when a single device changes.

---

## 23. Security

Never put secrets in client-side code.

Do not expose service-role credentials in the browser.

Validate permissions server-side.

Roles:

```text
Viewer
Operator
Admin
```

Viewer:

* read only

Operator:

* read + device control

Admin:

* full management

Keep audit logs for meaningful control actions.

---

## 24. Error Handling

Every major subsystem must have an intentional error state.

Examples:

* invalid building config
* invalid room dimensions
* missing device
* invalid device state
* realtime disconnect
* failed command
* permission denied
* unsupported feature
* player stuck
* physics issue

Do not silently swallow important errors.

Use user-facing errors where appropriate and developer diagnostics where useful.

---

## 25. Testing

After meaningful changes, run appropriate validation.

At minimum where configured:

* typecheck
* lint
* unit tests
* integration tests
* browser/e2e tests

When UI changes are significant, verify the actual application in a browser if browser tooling is available.

For interaction-heavy 3D features, test:

* selecting objects
* switching floors
* opening panels
* changing device state
* selecting objects
* switching floors
* opening panels
* changing device state

---

## 26. Development Workflow

Do not implement the entire PRD in one uncontrolled pass.

Work incrementally.

Preferred sequence:

```text
PRD
 ↓
Architecture
 ↓
Task breakdown
 ↓
Phase
 ↓
Task
 ↓
Implementation
 ↓
Validation
 ↓
Review
 ↓
Next task
```

Before starting a task:

1. Read the relevant PRD section.
2. Inspect existing code.
3. Identify dependencies.
4. Determine the smallest implementation.
5. Implement only the requested scope.

After the task:

1. Run validation.
2. Inspect affected code.
3. Check for unintended regressions.
4. Summarize the change.
5. Identify blockers or follow-up work.

Do not silently implement unrelated future phases.

---

## 27. Task Scope

Tasks should be small and independently reviewable.

Bad:

```text
Build the complete digital twin system.
```

Good:

```text
Create the R3F scene foundation.
```

Then:

```text
Create orthographic camera system.
```

Then:

```text
Create procedural Wall component.
```

Then:

```text
Create Room configuration schema.
```

Then:

```text
Implement room selection.
```

Prefer incremental vertical progress.

---

## 28. Do Not Rewrite Working Code Without Reason

Before changing architecture:

* inspect existing implementation
* understand why it exists
* check dependencies
* consider backward compatibility

Do not replace a working subsystem simply because a different approach looks cleaner.

When a rewrite is genuinely required, explain why before doing it.

---

## 29. Documentation

Update documentation when there is a meaningful architectural change.

Important documentation may include:

* `PRD.md`
* `AGENTS.md`
* architecture notes
* README
* task/implementation plan

Do not maintain contradictory documentation.

---

## 30. Naming

Use clear, descriptive names.

Prefer:

```text
Building
Floor
Room
Device
DeviceMarker
ManagementMode
LiveView
InteractionSystem
CameraController
PlayerController
```

Avoid vague names like:

```text
Thing
ObjectManager
Utils2
TempManager
NewSystem
```

Domain terminology should be consistent throughout the project.

---

## 31. Folder Structure

Prefer separation by feature/domain rather than putting everything into a single directory.

Example:

```text
src/
├── app/
├── components/
├── features/
│   ├── landing/
│   ├── building/
│   ├── management/
│   ├── live-view/
│   ├── devices/
│   ├── rooms/
│   └── floors/
├── three/
│   ├── building/
│   ├── devices/
│   ├── player/
│   ├── camera/
│   ├── interaction/
│   ├── geometry/
│   ├── materials/
│   └── scene/
├── stores/
├── hooks/
├── services/
├── lib/
├── types/
└── config/
```

Adapt this to the actual codebase rather than following it mechanically.

---

## 32. Accessibility

Normal application UI must follow web accessibility practices.

Use:

* semantic buttons
* labels
* keyboard accessibility
* visible focus states
* sufficient contrast
* accessible status indicators

3D interaction must not be the only way to perform important actions.

For example, device lists/panels should provide an alternative path to selecting a device without requiring precise 3D clicking.

---

## 33. Responsive Design

Desktop is the primary target.

However:

* layout must adapt gracefully
* 3D viewport must remain usable
* panels must collapse/reflow
* important actions must remain accessible
* mobile must not become horizontally broken

Management Mode can use a reduced layout on mobile where necessary.

---

## 34. Visual Quality

The product should feel polished.

Prefer:

* subtle animation
* smooth transitions
* consistent spacing
* consistent typography
* restrained shadows
* consistent border radius
* clear hierarchy
* deliberate motion

Avoid:

* excessive gradients
* excessive glassmorphism
* excessive neon effects
* noisy animations
* visual clutter
* unnecessary 3D effects

The building should remain the visual hero.

---

## 35. Architecture Principles

Always preserve these principles:

1. The building is a product interface, not an editor.
2. Management Mode is the primary workspace for the predefined building.
3. Building layout is predefined by developers.
4. The building system is procedural/modular.
5. Devices are generic and extensible.
6. 3D and UI concerns are separated.
7. Server state and client state are separated.
8. Performance is considered from the beginning.
9. MVP remains intentionally limited.
10. Avoid dependencies that create unnecessary coupling.
11. Prefer data-driven behavior.
12. Keep future IoT/digital-twin expansion possible without over-engineering MVP.

---

## 36. Future Compatibility

The architecture should not block future features such as:

* multiple buildings
* multiple sites
* real IoT
* MQTT
* external device APIs
* CCTV streams
* energy monitoring
* occupancy monitoring
* analytics
* AI assistant
* VR
* WebXR
* multiplayer
* collaborative monitoring
* optional GLB/GLTF assets
* internal/admin building authoring tools

These are future concerns unless explicitly promoted into the current scope.

Do not implement future systems prematurely.

---

## 37. Agent Behavior

When asked to work on this project:

* read `PRD.md`
* read `AGENTS.md`
* inspect current code
* respect existing architecture
* identify the relevant phase/task
* implement only the intended scope
* validate the result
* avoid unrelated changes

Do not assume that "make it better" means "rewrite the architecture."

When requirements are ambiguous:

1. choose the smallest safe interpretation
2. preserve existing architecture
3. document the assumption
4. do not invent major product features

---

## 38. Completion Standard

A task is not considered complete merely because code was written.

A task is complete when:

* intended behavior is implemented
* code is integrated into the existing architecture
* types are valid
* relevant validation passes
* no obvious regression was introduced
* UI/3D interaction behaves as intended
* documentation is updated when necessary

---

## 39. Final Constraint

The most important product constraint is:

**This repository builds a finished Interactive 3D Building Management / Digital Twin web application.**

It does NOT build a 3D editor.

The developer defines the building.

The website renders the building.

The user explores and manages the building.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
