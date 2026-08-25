# PRODUCT REQUIREMENTS DOCUMENT (PRD)

> **Current product decision:** Live View / Walk Mode has been removed. 5days is Management Mode only. The `/live` route, player, physics runtime, elevator ride, and Walk Mode marketing surface are out of scope unless requirements are explicitly changed.
## Interactive 3D Building Management / Digital Twin
**Codename: 5days**

| | |
|---|---|
| Versi dokumen | 1.0 (MVP) |
| Status | Draft final — source of truth development |
| Platform | Web application (desktop-first, responsive) |
| Stack inti | Next.js + React + TypeScript + Three.js/R3F + Supabase |
| Tim target | Solo developer / small team |

---

# 1. RINGKASAN EKSEKUTIF

5days adalah **web application yang sudah jadi** (bukan editor, bukan tool authoring) yang menghadirkan **landing page premium** dengan visual utama **bangunan 3D interaktif**, yang kemudian membawa user masuk ke **Interactive 3D Digital Twin Management Mode** untuk monitoring dan management building.

Bangunan 3D adalah **primary interaction interface**: user memilih floor, room, dan device langsung dari scene 3D, memonitor status, mengontrol device, dan melihat activity realtime.

Layout bangunan **predefined oleh developer** melalui configuration data-driven. Procedural Three.js hanyalah **strategi implementasi** untuk merender world tersebut — bukan fitur editor untuk user.

MVP mengirim satu building (3 floor, ±10 room, ±25–30 device: AC, Light, Door, Elevator, CCTV placeholder, Sensor) dengan backend Supabase (Auth, PostgreSQL, Realtime, RLS), tiga role (Viewer/Operator/Admin), dan persistent device state.

**Satu kalimat produk:** *"A polished web application where users interact with a predefined 3D building and manage the devices inside it."*

---

# 2. DEFINISI PRODUK

## 2.1 Konsep
"Interactive 3D Digital Twin untuk monitoring dan management building."

## 2.2 Karakter visual utama
Modern, clean, premium, minimal, stylized, semi-low-poly, isometric / semi-isometric, soft lighting, architectural visualization, mudah dipahami, fokus pada usability & interaction.

**Referensi visual:** smart home dashboard, smart office dashboard, smart building control center, digital twin interface, isometric 3D floor-plan interface.

## 2.3 Peran 3D building
3D building **bukan dekorasi**. Segala sesuatu yang bisa dilakukan user terhadap building (select, focus, monitor, control) harus bisa dimulai dari scene 3D. Panel HTML/React adalah pelengkap kontekstual — bukan pengganti interaksi 3D.

## 2.4 Komposisi produk
1. **Landing page** — etalase produk, hero 3D interaktif.
2. **Management Mode** — dashboard isometric untuk monitoring & control.
3. **Management Mode** — workspace monitoring dan control building berbasis 3D.

---

# 3. CRITICAL PRODUCT BOUNDARY (WAJIB DIPATUHI)

Produk ini **BUKAN**: 3D editor, floor-plan editor, CAD, BIM editor, building configurator, level editor, drag-and-drop builder, room designer, wall editor.

**User TIDAK dapat:** membuat/menghapus room, memindahkan wall, resize room, membuat/menghapus floor, menggeser furniture, membuat building baru, mengubah geometry, menyusun building dari nol.

**Rantai otoritas layout:**
Developer menentukan → Building → Floors → Rooms → Layout → Devices → Device positions → Visual style.
Website menampilkan → Building → Floors → Rooms → Devices sebagai interactive 3D experience.

**Aturan implementasi:**
- Procedural/modular Three.js = cara implementasi menghasilkan world yang sudah ditentukan. **Bukan** fitur editor.
- Tidak ada UI apa pun di MVP untuk mengedit layout/config.
- Tidak ada empty canvas, scene editor, object tree, transform gizmo, development controls, geometry controls, atau debug UI yang terlihat user.

**Mental model yang BENAR:** *"Build a polished web application where users interact with a predefined 3D building and manage the devices inside it."*
**Mental model yang SALAH:** *"Build a tool where users create and edit their own 3D building."*

Setiap pull request yang menambahkan kapabilitas authoring/editing geometry ke user-facing product **harus ditolak**.

---

# 4. PRODUCT EXPERIENCE & FLOW UTAMA

```
LANDING PAGE → Hero (3D building cinematic)
            → Interactive 3D Building Preview
            → Features / Benefits
            → CTA "Explore Building"
            → MANAGEMENT MODE (Interactive 3D Digital Twin)
            → ⇄ LIVE VIEW (Walk Mode)
```

**Prinsip pengalaman:**
- Sejak detik pertama website terasa seperti produk final, bukan demo teknologi.
- Loading state harus dirancang (skeleton/splash brand), tidak pernah terlihat canvas kosong.
- Transisi antar mode harus smooth (crossfade + camera handoff), tidak ada hard reload antar mode.
- Semua status device konsisten di semua permukaan (3D, panel, list, live view) — satu sumber kebenaran.

---

# 5. PRODUCT GOALS

## 5.1 Primary Goals
1. Landing page premium dengan interactive 3D building sebagai visual utama.
2. 3D building yang dapat di-explore secara interaktif.
3. User dapat memilih floor, room, dan device.
4. User dapat memonitor status device.
5. User dapat mengontrol device dari UI (panel & 3D & live view).
 6. Management workspace yang informatif, responsif, dan realtime.
 7. **Satu world/building** untuk seluruh permukaan Management Mode.
8. Architecture yang dapat berkembang menjadi digital twin nyata.
9. MVP sederhana & realistis untuk solo developer/small team.

## 5.2 Secondary Goals
Visual premium, smooth transitions, responsive UI, real-time data, extensible device system, scalable building structure.

## 5.3 Success Metrics (indikasi MVP sukses)
| Metrik | Target indikatif |
|---|---|
| Landing → masuk `/app` | ≥ 35% visitor |
| Session di Management Mode | ≥ 3 menit (user terautentikasi) |
| Device control actions / session (Operator) | ≥ 3 aksi |
| User yang mencoba Live View | ≥ 25% session terautentikasi |
| FPS Management Mode (desktop modern) | ≥ 55 fps p90 |
| Realtime latency state change → visual | < 1 detik p90 |
| Crash/error rate session | < 1% |

---

# 6. NON-GOALS (MVP)

3D editor, CAD, BIM, building designer, multiplayer, VR/AR/WebXR, combat/inventory/quest/game mechanics lanjutan, integrasi IoT hardware nyata, MQTT, real CCTV stream, BIM interoperability, multi-user collaborative editing, multiple buildings, analytics dashboard lanjutan, mobile native app.

---

# 7. TARGET USERS & ROLES

## 7.1 Personas
1. **Building Operator** (pengguna utama harian) — memonitor & mengontrol device, merespons alert.
2. **Facility Manager / Admin** — mengelola user, permission, audit.
3. **Viewer / Stakeholder** — melihat status tanpa mengubah apa pun (termasuk demo visitor).

## 7.2 Matriks Permission
| Kemampuan | Viewer | Operator | Admin |
|---|:---:|:---:|:---:|
| Lihat building/floor/room/device/status | ✓ | ✓ | ✓ |
| Camera control, focus, cutaway | ✓ | ✓ | ✓ |
| Live View (berjalan) | ✓ | ✓ | ✓ |
| Kontrol device (power, brightness, suhu, lock, panggil elevator) | ✗ | ✓ | ✓ |
| Lihat activity feed | ✓ | ✓ | ✓ |
| Acknowledge alert | ✗ | ✓ | ✓ |
| User management & role assignment | ✗ | ✗ | ✓ |
| System settings | ✗ | ✗ | ✓ |
| Lihat audit logs lengkap | ✗ | ✗ | ✓ |

Enforcement terjadi di **dua lapis**: UI (disable control) dan **server (RLS + RPC validation)** — lapis server adalah otoritas final.

---

# 8. LANDING PAGE

## 8.1 Prinsip
Premium, modern, clean, cinematic, interactive, 3D-focused, minimal typography, subtle animation. Hero 3D **tidak boleh terasa seperti editor** — tidak ada gizmo/grid editor/toolbar.

## 8.2 Struktur section (urutan)
1. **Navbar** — logo, anchor sections, tombol "Sign in", CTA "Explore Building". Sticky, blur backdrop.
2. **Hero** — headline, subheadline, 2 CTA, 3D building sebagai visual dominan (≥ 60% viewport height).
3. **Interactive 3D Building Preview** — canvas interaktif penuh (orbit terbatas, hover highlight device/floor, klik floor → tooltip nama floor).
4. **Value proposition** — 3 kartu: *"See everything in 3D"*, *"Control in seconds"*, *"Live, always in sync"*.
5. **Building management capabilities** — grid fitur: floor isolation, device control, cutaway view, activity & alerts.
6. **Device monitoring** — visual contoh device states (AC/Light/Door/Elevator) dengan mock status chip.
8. **Realtime / digital twin section** — penjelasan arsitektur realtime (device → cloud → 3D dalam < 1 detik).
9. **CTA band** — "Manage Your Building in 3D." + tombol Explore.
10. **Footer** — produk, docs (placeholder), copyright.

## 8.3 Hero — spesifikasi
- **Headline:** *"Manage Your Building in 3D."*
- **Subheadline:** *"5days is an interactive digital twin — monitor floors, rooms, and devices, and control them in real time from one browser workspace."*
- **CTA primary:** `Explore Building` → `/app` (jika belum login → `/login` lalu redirect).
- **Perilaku 3D hero:**
  - Bangunan sama dengan config utama, mode `preview`.
  - Subtle auto-orbit kamera (±0.5°/detik) + parallax ringan mengikuti pointer.
  - Interactive object highlights: hover floor/device → glow + label kecil.
  - Setiap ±8 detik, satu device "bercerita" (marker berdenyut + chip status, mis. *"AC_201 → 22°C · Cooling"*).
  - `prefers-reduced-motion` → auto-orbit mati.
  - Off-screen (IntersectionObserver) → render pause.
  - WebGL tidak tersedia → fallback gambar statis prerender (PNG/WebP) + pesan halus.
- **Performance hero:** DPR ≤ 1.5, tanpa shadow map dinamis (baked-look), frustum sederhana, target ≤ 60 draw calls.

---

# 9. MANAGEMENT MODE

## 9.1 Definisi
Mode utama monitoring & controlling. Kamera orthographic/semi-isometric dari sudut atas; clean architectural visualization; dinding bisa semi-transparent; floor terpilih punya emphasis; device punya marker; panel kontekstual di HTML/React.

## 9.2 Layout layar
```
┌──────────────────────────────────────────────────────────────┐
│ TOPBAR: mode badge · building name · realtime status · user  │
├──────────┬──────────────────────────────────────┬────────────┤
│ LEFT     │                                      │ RIGHT      │
│ SIDEBAR  │        3D BUILDING VIEWPORT          │ CONTEXTUAL │
│ Home     │        (Canvas R3F)                  │ PANEL      │
│ Live View│                                      │ (room/     │
│ Devices  │   + floating floor selector          │  device    │
│ Rooms    │   + view controls (kanan-atas)       │  details,  │
│ Activity │                                      │  controls) │
│ Settings │                                      │            │
└──────────┴──────────────────────────────────────┴────────────┘
```
- Left sidebar lebar 220–240px (collapsible).
- Right panel lebar 320–360px; muncul/berisi sesuai seleksi; kosong → overview ringkas.
- 3D viewport selalu menjadi area dominan (≥ 60% lebar).
- Floating **floor selector**: `[ All ] [ Floor 1 ] [ Floor 2 ] [ Floor 3 ]` di atas canvas (kiri-bawah).
- Floating **view controls** (kanan-bawah): Reset view, Transparent walls on/off, Hide upper floors, Isolate floor, Fit.

## 9.3 Fitur management (daftar fungsional)
Select building/floor/room/device (3D atau list) · focus camera · isolate floor · hide upper floors · show selected floor · transparent wall mode · filter devices (tipe/status) · view status · view alerts · view activity · control devices · deep-link `?device=AC_201`.

## 9.4 Aturan perilaku
- Klik area kosong → deselect (panel kembali ke overview).
- Double-click objek → camera focus ke objek.
- Seleksi dari list UI → objek di 3D highlight + camera focus (opsional auto-focus, dapat dimatikan di Settings).
- Setiap perubahan state device → visual 3D, marker, panel, dan list update serentak (realtime).

---

# 10. FLOOR SYSTEM

## 10.1 Scope MVP
2–3 floors (demo building menggunakan **3 floors**). Struktur demo:

```
Building "5days One"
├── Floor 1 → Lobby, Room 101, Room 102, Utility, (Elevator core, Stair core)
├── Floor 2 → Room 201, Room 202, Corridor, (Elevator core)
└── Floor 3 → Room 301, Meeting Room, Utility, (Elevator core)
```

## 10.2 Data model floor
```ts
interface FloorConfig {
  id: string;            // "floor-1"
  index: number;         // 0-based
  name: string;          // "Floor 1"
  elevation: number;     // meter, dihitung: index * FLOOR_HEIGHT
  rooms: RoomConfig[];
  cores: CoreConfig[];   // elevator/stair shaft positions
}
```
Konstanta bangunan demo: `FLOOR_HEIGHT = 3.4m` (clear 3.0 + slab 0.4), footprint `22m × 14m`, wall thickness `0.12m`.

## 10.3 Floor selector — perilaku
| Aksi | Perilaku |
|---|---|
| Klik `Floor 2` | Floor 2 active & highlighted; floor lain dimmed/translucent; camera smooth-transition memusatkan Floor 2 |
| Klik `All` | Overview penuh seluruh building |
| Mode `Isolate` | Hanya floor terpilih dirender solid; lainnya disembunyikan |
| Mode `Hide upper` | Floor di atas floor terpilih disembunyikan |
| Transisi | Camera tween 600–900ms, easing cubic-out; opacity floor dianimasikan 200ms |

Optional (stretch, tidak wajib MVP): vertical explode/cutaway animation.

---

# 11. ROOM SYSTEM

## 11.1 Data model
```ts
interface RoomConfig {
  id: string;            // "room-201"
  name: string;          // "Room 201"
  type: RoomType;        // 'office' | 'meeting' | 'lobby' | 'utility' | 'corridor'
  floorId: string;       // "floor-2"
  position: [number, number, number]; // pusat room [x, y, z], meter
  width: number; depth: number; height: number;
  doors: DoorOpeningConfig[];   // posisi & orientasi bukaan pintu
  windows: WindowConfig[];      // bukaan jendela (dinding luar)
  deviceIds: string[];
}
type RoomType = 'office' | 'meeting' | 'lobby' | 'utility' | 'corridor';
```

Contoh konkret:
```json
{
  "id": "room-201", "name": "Room 201", "type": "office", "floorId": "floor-2",
  "position": [4, 0, 3.5], "width": 8, "depth": 7, "height": 3
}
```

## 11.2 Room status
`occupied | vacant | warning | offline`
- MVP: status awal dari config + **derived rules**: ada device `warning` → room `warning`; semua device `offline` → room `offline`; occupancy statis dari config (dapat diubah future).
- Visual: warna chip pada RoomLabel & panel; room `warning` mendapat tint halus pada floor surface.

## 11.3 Interaksi
Room dapat dipilih dari 3D (klik floor surface / label / volume room) atau dari UI list. Room terpilih → Right Panel menampilkan: nama, tipe, floor, status, daftar device (dengan status ringkas), tombol *"Focus room"* dan *"Show devices"*.

---

# 12. DEVICE SYSTEM

## 12.1 Device types MVP (wajib seluruhnya)
Air Conditioner · Light · Door · Elevator · CCTV placeholder · Generic Sensor.

## 12.2 Base model
```ts
interface DeviceBase {
  id: string;            // stable, e.g. "AC_201"
  type: DeviceType;      // 'ac' | 'light' | 'door' | 'elevator' | 'cctv' | 'sensor'
  name: string;          // "AC Room 201"
  roomId: string | null; // elevator/cctv corridor bisa null
  floorId: string;
  position: [number, number, number];
  rotationY?: number;
  capabilities: Capability[];
  metadata?: Record<string, unknown>; // merk, model, dsb (display-only)
}
type Capability =
  | 'switchable' | 'dimmable' | 'temperatureControl'
  | 'lockable' | 'openable' | 'movable' | 'observable';
```

## 12.3 State schema per tipe (server-persistent, JSONB)
| Tipe | Shape state | Validasi command |
|---|---|---|
| AC | `{ power: boolean, targetTemperature: number, mode: 'cool'\|'fan'\|'auto' }` | temp ∈ [16..30] step 0.5; mode enum |
| Light | `{ power: boolean, brightness: number }` | brightness ∈ [0..100] integer |
| Door | `{ open: boolean, locked: boolean }` | `open` ditolak bila `locked` |
| Elevator | `{ currentFloor: number, targetFloor: number\|null, state: 'idle'\|'doors_closing'\|'moving'\|'doors_opening'\|'doors_open', moveStartedAt: string\|null }` | target ∈ floor valid; bukan currentFloor |
| CCTV | `{ online: boolean, recording: boolean }` | read-only (MVP) |
| Sensor | `{ value: number, unit: string, status: 'normal'\|'warning'\|'critical' }` | read-only |

## 12.4 Matriks capability
| Capability | AC | Light | Door | Elevator | CCTV | Sensor |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| switchable | ✓ | ✓ | | | | |
| dimmable | | ✓ | | | | |
| temperatureControl | ✓ | | | | | |
| lockable | | | ✓ | | | |
| openable | | | ✓ | ✓ (doors) | | |
| movable | | | | ✓ (cabin) | | |
| observable | | | | | ✓ | ✓ |

## 12.5 Command set (kontrak RPC)
| Device | Commands |
|---|---|
| AC | `SET_POWER {power}`, `SET_TEMPERATURE {targetTemperature}`, `SET_MODE {mode}` |
| Light | `SET_POWER {power}`, `SET_BRIGHTNESS {brightness}` |
| Door | `SET_OPEN {open}`, `SET_LOCKED {locked}` |
| Elevator | `CALL {targetFloor}` |
| CCTV / Sensor | — (read-only) |

Semua command melewati **satu endpoint server** (`control_device`) yang memvalidasi role, capability, dan range nilai — detail di §24.4.

## 12.6 ID convention
`{TYPE}_{LOKASI}` uppercase, stabil, tidak berubah: `AC_201`, `LIGHT_LOBBY_A`, `DOOR_201`, `ELEV_01`, `CCTV_LOBBY`, `SENSOR_201`. ID dipakai sebagai key 3D object, key state, key event — **stable ID adalah kontrak lintas sistem**.

## 12.7 Extensibility
Menambah device type baru = menambah (1) entry capability matrix, (2) state schema + validasi, (3) mesh component, (4) panel control — **tanpa mengubah core system**. Core tidak boleh mengenal tipe spesifik selain melalui registry.

---

# 13. DEVICE VISUALIZATION (3D, primitive-based — tanpa GLB)

| Device | Komposisi primitive | State-driven visual |
|---|---|---|
| AC | Box dinding + vent (slats) + indicator LED kecil | LED emissive hijau saat ON; animasi airflow halus (plane transparan ber-scroll) saat cooling; abu-abu saat OFF; merah berdenyut saat warning |
| Light | Fixture (silinder/box) + bulb (sphere emissive) | Emissive intensity = brightness; PointLight nyata hanya untuk ≤ 6 light terdekat (budget), sisanya fake emissive |
| Door | Panel box + frame + handle; pivot hinge | Animasi rotasi 0→95° (300ms ease) saat open; indikator lock (chip merah kecil) |
| Elevator | Shaft (box transparan samar), 2 panel pintu, cabin box, indikator lantai (Html/sprite) | Cabin Y = f(currentFloor/progress); pintu slide; indikator arah |
| CCTV | Box kecil + lensa silinder + bracket | LED merah = recording; abu-abu = offline |
| Sensor | Disk kecil di dinding/plafon | Ring warna sesuai status (normal/warning/critical) |

Semua mesh device menerima state dari store yang sama; tidak ada state visual lokal yang menyimpang dari server state.

---

# 14. DEVICE MARKERS

- Ikon kecil di atas device: AC, light, CCTV, door, sensor, elevator.
- **Status marker:** `online` (accent), `offline` (abu), `warning` (amber), `active` (berdenyut halus).
- **Interaksi:** hover → tooltip nama+status; click → select device (sama dengan klik mesh); double-click → camera focus.
- **Implementasi terpilih MVP:** `drei <Html>` + div CSS (≤ 30 marker → performant cukup, mudah styling, tajam di semua DPR), `transform` sprite-like scaling, `pointerEvents` aktif, occlusion sederhana (hide saat floor disembunyikan). Jika audit performa menunjukkan masalah → ganti ke instanced sprite/billboard (interface marker tetap sama).
- Marker dapat difilter (per tipe/status) dari Devices panel; filter menyembunyikan marker + meredupkan mesh terkait.

---

# 15. INTERACTIVE 3D OBJECT SYSTEM

Setiap interactive object memiliki: **stable ID, type (`room|floor|device`), metadata, interaction capability, current visual state.**

**Visual states:** `default | hover | selected | warning | offline`.
**Interaksi:** click (select), hover (highlight + cursor pointer + tooltip), double-click (camera focus), select (highlight + marker aktif + contextual panel terbuka).

**Selected object wajib:** highlighted (emissive tint accent + ring/edge halus di lantai), dapat di-focus camera, marker berubah state, contextual UI terbuka di Right Panel.

**Mekanisme teknis:** R3F pointer events; setiap mesh interaktif menandai `userData = { kind, id }`; raycast hit → resolve ID → dispatch ke store. Selection state hanya di Zustand; mesh membaca store via selector sempit (hindari re-render scene-wide).

---

# 16. CAMERA SYSTEM

## 16.1 Management Mode
- `OrthographicCamera` semi-isometric: elevation ≈ 35°, azimuth default 45°; zoom via scroll (clamp min/max), pan via right-drag / two-finger, orbit via left-drag — implementasi `drei CameraControls` (jangan buat ulang).
- **Camera commands** (event-driven via store, bukan state kontinu): `overview`, `focusFloor(id)`, `focusRoom(id)`, `focusDevice(id)`, `reset`.
- Transisi smooth 600–900ms (ease cubic-out); target = bounding box objek + padding 20–30%.
- **View presets:** building overview (default), floor overview, room focus, device focus.

## 16.2 Live View
Third-person follow camera: orbit mengikuti drag pointer, jarak 3–6m clamp, collision sederhana terhadap wall (cegah kamera menembus dinding), look-at player + offset bahu. First-person = future, bukan MVP.

## 16.3 Landing / Preview
Auto-orbit lambat + clamp polar; user hanya bisa orbit terbatas & zoom terbatas.

---

# 17. WALL / CUTAWAY SYSTEM

Mode visibilitas (enum tunggal `floorVisibilityMode` + boolean `transparentWalls`):

| Mode | Perilaku |
|---|---|
| 1. Full building | Semua solid (default overview) |
| 2. Selected floor | Floor terpilih solid + accent; floor lain translucent ~15–25% |
| 3. Hide upper floors | Floor di atas selected disembunyikan |
| 4. Transparent walls | Semua wall opacity ~0.22 (tetap depth-write off agar interior jelas) |
| 5. Isolated floor | Hanya floor terpilih dirender |
| 6. Cutaway view | Kombinasi 2 dinding terdekat kamera dibuat transparan (stretch — boleh MVP-late, boleh ditunda) |

Tujuan: user paham struktur building sekaligus melihat interior dengan jelas. Semua mode dapat dikombinasikan dengan floor selector dan berubah animatif (200ms opacity transition).

---

# 18. LIVE VIEW / WALK MODE

## 18.1 Konsep
Mini 3D game-like experience. Masuk dari sidebar (`Live View`) atau CTA. **Wajib memakai world yang SAMA** dengan Management Mode: same building, same rooms, same devices, same device state. Yang berbeda hanya: kamera, player, controls, HUD, interaction style. Tidak ada duplikasi scene; satu `<BuildingWorld>` di-mount, rig kamera/player ditukar menurut mode.

## 18.2 Player system (MVP)
| Aspek | Spesifikasi |
|---|---|
| Character | Stylized capsule + head (primitive), tinggi ±1.7m |
| Movement | WASD relatif yaw kamera; walk 3 m/s; sprint (Shift) 5.5 m/s |
| Jump | Opsional — MVP: **tidak ada jump** (mengurangi edge case) |
| Gravity & collision | Rapier character controller (kinematic); gravity −9.81 |
| Floor detection | Ground check dari character controller |
| Camera | Third-person orbit drag, follow smoothed |
| Spawn | Titik spawn per floor (dekat elevator); spawn default = Lobby Floor 1 |
| Reset | Tombol HUD "Reset position" + auto-reset jika jatuh/out-of-bounds |
| Batas | Tidak menembus wall, tidak jatuh menembus floor, tidak keluar building boundary |

**Collider strategy (kunci "one world"):** collider statis (wall, slab, core) **digenerate dari building config yang sama** dengan mesh visual — satu fungsi `buildCollidersFromConfig()` dipakai physics; mesh visual tetap dari komponen 3D. Pintu = collider dinamis yang nonaktif saat open.

## 18.3 Interaction system (Live View)
Kondisi prompt muncul: objek interactable **AND** player dalam radius (**2.5m**) **AND** permission tersedia. Prompt HUD: `[E] Interact — AC_201`.

| Device | Aksi `E` |
|---|---|
| AC | Buka control panel (overlay HTML) |
| Light | Toggle power langsung (+ feedback visual) |
| Door | Open/close (ditolak + toast bila locked; Viewer hanya lihat status) |
| Elevator | Buka elevator panel → pilih floor |
| CCTV / Sensor | Lihat status panel (read-only) |

Pemilihan target = interactable terdekat dalam radius & line-of-sight sederhana. Hanya satu prompt aktif pada satu waktu. Panel overlay tidak memblokir movement kecuali elevator panel (pilihan desain: movement tetap bisa, panel dismiss dengan Esc).

## 18.4 Elevator system (MVP)
**Komponen:** shaft, cabin, doors (2 panel slide), current floor, target floor, basic animation, indikator.

**Workflow player:**
```
Player masuk cabin → [E] → floor selector terbuka → pilih Floor 3
→ doors close (1.0s) → cabin move (1.5s per floor, eased)
→ floor indicator berubah realtime → doors open (1.0s) → player keluar
```

**Aturan state machine:** `idle/doors_open → doors_closing → moving → doors_opening → doors_open`. `CALL` saat moving → antrian tunggal (target terakhir menang; MVP tanpa antrian multi). Safety: bila player berada di ambang pintu saat closing → doors reopen (check zona pintu).

**Sinkronisasi lintas klien (deterministik, tanpa write beruntun):**
1. RPC `CALL {targetFloor}` → server set `state='doors_closing', targetFloor, moveStartedAt=now()`.
2. Setiap klien menghitung posisi cabin secara deterministik dari `(currentFloor, targetFloor, moveStartedAt)` dengan jadwal tetap (close 1s → move 1.5s/floor → open 1s) — visual konsisten di semua klien tanpa streaming posisi.
3. RPC `ARRIVE` (idempotent, dipanggil inisiator/edge cron fallback) → set `currentFloor=targetFloor, state='doors_open'`.
4. Management Mode memvisualisasikan state yang sama (posisi cabin + indikator) dari data yang sama.

**Player di dalam cabin:** cabin = kinematic platform; selama `moving`, posisi player mengikuti delta cabin (Rapier character controller mendukung platform; jika implementasi bermasalah, fallback MVP yang diizinkan: player diparent-kan manual ke delta Y cabin selama move).

## 18.5 HUD Live View
Prompt interaksi · indikator floor saat ini · mini kontrol help (`WASD` move · `Shift` sprint · `E` interact · `Esc` keluar) · tombol **Exit to Management** · realtime status dot. Mobile/touch: fallback orbit-preview + banner *"Live View optimal di desktop"* (keputusan sadar, §27).

---

# 19. PROCEDURAL 3D BUILDING SYSTEM (IMPLEMENTASI)

**Ketetapan MVP:** tidak memakai GLB/GLTF sebagai dependency utama; tidak ada ketergantungan Blender. Building dibuat langsung dengan Three.js + R3F + TypeScript, procedural geometry, reusable components, configuration data.

## 19.1 Komponen hierarchy
```tsx
<Canvas>
  <SceneRoot>                        // mode-aware
    <LightingRig />                  // 1 directional shadow + hemisphere/ambient
    <BuildingWorld mode={mode}>      // SATU world utk landing/management/live
      {floors.map(f => (
        <FloorGroup key={f.id} floor={f}>
          <Slab />
          {f.rooms.map(r => (
            <Room key={r.id} room={r}>
              <FloorSurface /><Walls />   // dgn bukaan door/window
              <Door />... <Window />...
              {devices => <DeviceMesh id={...} />...}
            </Room>
          ))}
          <ElevatorCore /><StairCore />
        </FloorGroup>
      ))}
    </BuildingWorld>
    {mode === 'management' && <ManagementRig />}  {/* CameraControls, markers, selection */}
    {mode === 'live'       && <LiveRig />}         {/* Physics, Player, InteractionScan */}
  </SceneRoot>
</Canvas>
```

## 19.2 Reusable components
`Building, FloorGroup, Room, Wall, FloorSurface, Ceiling, Door, Window, Stair, ElevatorCore, DeviceMesh (registry per tipe), DeviceMarker, RoomLabel, FloorLabel`.

## 19.3 Geometry & generator
- Primitives: `BoxGeometry`, `PlaneGeometry`, `CylinderGeometry`; custom `BufferGeometry` hanya bila perlu.
- Wall dengan bukaan: komposisi segment (left/right/top/bottom box) — hindari CSG (over-engineered untuk MVP).
- Utility generator bila lebih tepat: `createWall()`, `createFloorSurface()`, `createRoomWalls()`, `createDoor()`, `createWindow()` — mengembalikan geometry/material yang di-cache.

## 19.4 Data-driven layout
Layout 100% dari config TypeScript tervalidasi Zod pada build/startup:
```ts
const buildingConfig: BuildingConfig = {
  id: '5days-one', name: '5days One',
  footprint: { width: 22, depth: 14 }, floorHeight: 3.4,
  floors: [ { id: 'floor-1', rooms: [/* ... */], cores: [/* ... */] }, /* ... */ ],
  devices: [/* ... */ ],
};
```
Developer mengubah layout dengan mengedit config ini. **Tidak ada UI untuk mengedit config** (lihat §3).

## 19.5 Strategi render geometry statis
- Geometry & material **shared** via catalog module (1 instance per tipe material).
- Static geometry per floor (walls/slabs) di-**merge** (`BufferGeometryUtils.mergeGeometries`) atau di-**instance** → menekan draw call.
- Objek interaktif (door, device, elevator) tetap mesh terpisah.

---

# 20. VISUAL STYLE & DESIGN TOKENS

**Arah gaya:** isometric, clean, soft, architectural, minimal, stylized, semi-low-poly, slightly translucent walls, subtle AO, soft shadows, pastel accent, clear selected state. **Bukan photorealism.**

**Prioritas:** 1) readability, 2) interaction clarity, 3) performance, 4) aesthetic.

## 20.1 Token warna (light theme tunggal untuk MVP)
| Token | Nilai | Pemakaian |
|---|---|---|
| `bg.app` | `#F7F8FA` | Background app |
| `bg.panel` | `#FFFFFF` | Card/panel |
| `ink.primary` | `#111827` | Teks utama |
| `ink.secondary` | `#6B7280` | Teks sekunder |
| `accent` | `#4F6BED` | Selection, primary button, marker online |
| `status.success` | `#22C55E` | on/normal |
| `status.warning` | `#F59E0B` | warning |
| `status.danger` | `#EF4444` | critical/error |
| `status.offline` | `#9CA3AF` | offline |
| 3D `wall` | `#EDEFF3` | Wall solid |
| 3D `wall.transparent` | opacity `0.22` | Cutaway |
| 3D `slab` | `#E3E7EE` | Slab antar lantai |
| 3D floor per tipe | office `#F4F6FB` · meeting `#EAF3EF` · lobby `#F6F4EE` · utility `#F0EFEA` · corridor `#ECEEF2` | FloorSurface |

## 20.2 Lighting & mood
1 directional light (shadow-caster tunggal, map 1024–2048) + hemisphere/ambient; soft shadow (PCFSoft); subtle AO via baked vertex/material trick atau `ContactShadows` di ground — hindari SSAO postprocessing di MVP.

## 20.3 UI style
Rounded cards (12px), subtle borders (`#E5E7EB`), soft shadow, spacing 8px-grid, font **Inter**, palette minimal, accent untuk selection/status. UI tidak boleh dashboard-heavy sampai menggeser peran 3D sebagai visual utama.

---

# 21. UI/UX SISTEM

## 21.1 Routes
| Route | Isi | Akses |
|---|---|---|
| `/` | Landing page | Publik |
| `/login` | Auth (email/password) | Publik |
| `/app` | Management Mode (sidebar Home default) | Authenticated |
| `/app?tab=devices\|rooms\|activity\|settings` | Panel variant | Authenticated |
| `/live` | Live View full-screen | Authenticated |
| `/app?device=AC_201` | Deep-link seleksi device | Authenticated |

## 21.2 Komponen UI inti
Sidebar, TopBar, Panel (kanan), ListView (Devices/Rooms), DeviceControl widgets (Switch, Slider brightness, TemperatureStepper, LockToggle, ElevatorFloorPicker), ActivityFeed, AlertBanner + Toast, StatusChip, Modal, SettingsForm, UserManagementTable (admin), AuditLogTable (admin).

## 21.3 Keyboard shortcuts (Management)
`Esc` deselect/tutup panel · `F` focus seleksi · `1..3` pilih floor · `0` all floors · `T` transparent walls · `L` masuk Live View.

## 21.4 Accessibility
Semua aksi device tersedia via UI HTML (bukan hanya 3D) → setara untuk keyboard/screen reader; focus states jelas; kontras AA; `aria-label` pada kontrol; hormati `prefers-reduced-motion` (matikan auto-orbit & animasi dekoratif).

---

# 22. FRONTEND ARCHITECTURE

**Stack:** Next.js (App Router) + React 18 + TypeScript strict + Tailwind CSS.

```
src/
  app/                     # routes: /, /login, /app, /live
  components/              # UI generik (Button, Card, Toast, ...)
  features/
    landing/               # sections landing + hero canvas
    building/              # floor selector, view controls
    management/            # shell, panels, lists
    live-view/             # HUD, prompts, overlay panels
    devices/               # device control widgets
    rooms/
    floors/
  three/
    scene/                 # SceneRoot, LightingRig, mode switching
    building/              # Building, FloorGroup, Slab, Cores
    rooms/                 # Room, Wall, FloorSurface, Door, Window
    devices/               # registry mesh per tipe + markers
    player/                # character controller, spawn
    camera/                # CameraController, transitions
    interaction/           # raycast pipeline, live-view scan
    materials/             # shared material catalog
    geometry/              # generator utils + merge helpers
    physics/               # collider generation (rapier)
  stores/                  # zustand stores
  hooks/                   # useDeviceStates, useRealtime, usePermission...
  services/                # supabase client, rpc calls, command service
  lib/                     # utils, validation (zod), constants
  types/                   # domain types
  config/                  # buildingConfig, demoData, feature flags
```

**Prinsip:** 3D system (`src/three/**`) tidak mengimpor business/UI logic; komunikasi hanya via stores, props, dan event contracts. React UI tetap HTML/CSS/React — tidak ada 3D UI kecuali label/marker yang memang harus di scene.

---

# 23. STATE ARCHITECTURE (SERVER vs CLIENT — EKSPLISIT)

## 23.1 Pembagian
| SERVER STATE (Supabase, cache via TanStack Query) | CLIENT STATE (Zustand) |
|---|---|
| buildings, floors, rooms, devices | selectedBuilding/Floor/Room/Device |
| device_states (persistent) | activeMode, camera commands, panel state |
| device_events, activity history | player state, interaction target |
| users, roles, permissions | floor/wall visibility, filter devices |
| audit logs | temporary UI state (hover, toast) |

**Aturan:** Zustand tidak menyimpan duplikat server state kecuali sebagai **realtime mirror** kecil untuk konsumsi 3D (`deviceStates` map) yang di-hydrate dari query awal lalu di-update dari Realtime — dengan dokumentasi eksplisit bahwa sumber kebenaran adalah server.

## 23.2 Zustand stores (kontrak)
```ts
useSelectionStore  { selectedFloorId, selectedRoomId, selectedDeviceId, hoveredId, select(), clear() }
useModeStore       { mode: 'landing'|'management'|'live', setMode() }
useCameraStore     { command: {type:'overview'|'focusFloor'|'focusRoom'|'focusDevice'|'reset', id?, nonce}, issue() }
useVisibilityStore { floorMode:'full'|'selected'|'hideUpper'|'isolate', transparentWalls, floorFilter, deviceTypeFilter }
useDeviceStateStore{ states: Record<deviceId, DeviceState>, applyEvent(), hydrate() } // realtime mirror
usePlayerStore     { spawnFloorId, position?, interactionTargetId, setInteractionTarget() }
useUiStore         { rightPanelOpen, sidebarCollapsed, toasts }
```
Semua store memakai selector sempit di konsumen untuk menghindari re-render berlebihan di tree R3F.

---

# 24. BACKEND ARCHITECTURE (SUPABASE)

## 24.1 Komponen
PostgreSQL · Supabase Auth (email/password) · Realtime · Row Level Security · Edge Function (simulator, opsional).

## 24.2 Schema (DDL inti)
```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text, role text not null default 'viewer'
    check (role in ('viewer','operator','admin')),
  created_at timestamptz default now()
);

create table buildings (
  id text primary key, name text not null,
  config jsonb not null,            -- snapshot building config
  created_at timestamptz default now()
);

create table floors (
  id text primary key, building_id text references buildings not null,
  idx int not null, name text not null, elevation numeric not null
);

create table rooms (
  id text primary key, floor_id text references floors not null,
  name text not null, type text not null,
  position jsonb not null, width numeric, depth numeric, height numeric,
  status text not null default 'vacant'
);

create table devices (
  id text primary key,                 -- "AC_201"
  building_id text references buildings not null,
  floor_id text references floors not null,
  room_id text references rooms,
  type text not null, name text not null,
  position jsonb not null, rotation_y numeric default 0,
  capabilities text[] not null default '{}',
  metadata jsonb default '{}'
);

create table device_states (
  device_id text primary key references devices on delete cascade,
  state jsonb not null default '{}',
  updated_at timestamptz default now(),
  updated_by uuid references auth.users
);

create table device_events (
  id bigint generated always as identity primary key,
  device_id text references devices not null,
  event_type text not null,            -- 'state_change' | 'command' | 'alert'
  payload jsonb not null default '{}',
  actor uuid references auth.users,
  created_at timestamptz default now()
);

create table audit_logs (
  id bigint generated always as identity primary key,
  actor uuid references auth.users,
  action text not null,                -- 'device.command', 'user.role_change', ...
  target text, payload jsonb default '{}',
  created_at timestamptz default now()
);
```
Relasi: Building → Floors → Rooms → Devices. **Device state persistent** di `device_states`.

## 24.3 RLS (kebijakan inti)
```sql
-- helper
create function is_role(r text) returns boolean language sql stable as
$$ select exists (select 1 from profiles where id = auth.uid() and role = r) $$;

-- READ: semua authenticated
create policy read_all on device_states for select to authenticated using (true);

-- WRITE device state HANYA via RPC (deny direct update)
alter table device_states enable row level security;
-- (tidak ada policy update → direct update ditolak; RPC security definer)

-- audit_logs: insert hanya via trigger/RPC; select hanya admin
create policy audit_read on audit_logs for select using (is_role('admin'));
```

## 24.4 RPC `control_device` (jantung kontrol)
```sql
create function control_device(p_device_id text, p_command text, p_args jsonb)
returns jsonb language plpgsql security definer as $$
declare v_device devices; v_state jsonb; v_new jsonb;
begin
  if not is_role('operator') and not is_role('admin') then
    raise exception 'permission_denied';
  end if;
  select * into v_device from devices where id = p_device_id;
  if not found then raise exception 'device_not_found'; end if;
  select state into v_state from device_states where device_id = p_device_id;

  -- validasi capability + rentang nilai per (type, command) — tabel aturan di kode SQL
  v_new := apply_command(v_device.type, v_device.capabilities, v_state, p_command, p_args);
  -- apply_command RAISE 'invalid_command'/'invalid_value' bila melanggar

  update device_states set state = v_new, updated_at = now(), updated_by = auth.uid()
   where device_id = p_device_id;
  insert into device_events(device_id, event_type, payload, actor)
   values (p_device_id, 'command', jsonb_build_object('command', p_command, 'args', p_args, 'result', v_new), auth.uid());
  insert into audit_logs(actor, action, target, payload)
   values (auth.uid(), 'device.command', p_device_id, jsonb_build_object('command', p_command));
  return v_new;
end $$;
```
Klien menerima hasil final state sebagai response → optimistic UI dapat reconcile/rollback.

## 24.5 Seed
Script seed (TS CLI atau SQL) membaca `buildingConfig` → insert building/floors/rooms/devices + `device_states` awal. Demo users: `viewer@demo.5days.app`, `operator@demo.5days.app`, `admin@demo.5days.app` (password dev).

---

# 25. REALTIME ARCHITECTURE

**Channel Supabase Realtime `postgres_changes`:**
- `device_states` (UPDATE/INSERT) → update `useDeviceStateStore` → visual 3D + marker + panel + list tersinkron **tanpa reload**.
- `device_events` (INSERT) → Activity feed + toast/alert.

**Alur canonical:**
```
Operator toggle AC_201 → RPC control_device (server validasi + tulis)
→ Realtime broadcast → semua klien: state layer → 3D visual + UI update (< 1 detik)
```

**Keandalan:** indikator status koneksi realtime di TopBar & HUD; reconnect exponential backoff; saat reconnect → refetch snapshot penuh; saat offline sementara → perintah device di-queue maksimal 1 lalu gagal dengan toast (MVP sederhana, tanpa offline-first).

**Simulator (fitur MVP agar produk terasa hidup):** Edge Function terjadwal (±30 detik) menggeser nilai sensor (random walk), sesekali (±5% peluang) men-set satu device ke `warning` → memicu alert. Dapat dimatikan via feature flag.

---

# 26. SECURITY

1. **Authentication:** Supabase Auth email/password; session via cookie/token Next.js; route guard middleware `/app`, `/live`.
2. **Authorization:** role di `profiles`; enforcement ganda — UI disable + **RLS/RPC di server sebagai otoritas final**. Viewer read-only; Operator read+control; Admin full.
3. **Server-side validation:** semua command divalidasi di RPC (tipe, capability, rentang nilai, enum).
4. **Command validation:** tidak ada jalur tulis lain ke `device_states` selain RPC (RLS menolak direct write).
5. **Audit logs:** setiap command device + perubahan role tercatat (actor, target, payload, waktu).
6. Input validation Zod di client (fail-fast UX) — bukan pengganti server validation.
7. Tidak ada secret di client; service-role key hanya di Edge Function.

---

# 27. RESPONSIVE DESIGN

| Breakpoint | Perilaku |
|---|---|
| Desktop ≥ 1280px | Layout penuh 3 kolom (prioritas utama) |
| Tablet 768–1279px | Sidebar collapse jadi icon rail; right panel overlay |
| Mobile < 768px | Management tetap berfungsi: lihat building, pilih floor/room/device, panel jadi **bottom sheet**; navigasi bottom bar; 3D orbit touch |
| Mobile Live View | Fallback orbit-preview + banner "optimal di desktop" (physics/keyboard tidak nyaman) |

---

# 28. PERFORMANCE REQUIREMENTS

## 28.1 Strategi sejak hari pertama
Low-poly geometry · shared geometry & material (catalog) · instancing/merge geometry statis per floor · minimasi draw call · memoization komponen · state updates via selector sempit · frustum culling default · 1 shadow-caster · post-processing minimal (tanpa SSAO/Bloom di MVP).

**Dilarang:** terlalu banyak unique material, excessive dynamic lights, per-frame React state updates (gunakan ref/useFrame untuk animasi kontinu), recreasi object per render, ribuan React component untuk geometry statis.

## 28.2 Budget & target
| Metrik | Target desktop | Target mobile |
|---|---|---|
| FPS | 60 (min 55 p90) | ≥ 30 usable |
| Draw calls | ≤ 150 management, ≤ 200 live | ≤ 100 |
| Segitiga | ≤ 150k | ≤ 80k |
| Dynamic lights | 1 directional + ≤ 6 point/spot aktif | 1 directional, 0–2 point |
| DPR | ≤ 2 | ≤ 1.5 |
| Shadow map | 2048 | off / 1024 |
| JS initial bundle (app) | ≤ 450KB gzip (three + rapier dominan; route `/live` code-split) | sama |
| TTI landing | < 3.5s 4G desktop | < 5s |

- `frameloop="demand"` + `invalidate()` di Management/Landing saat idle; `always` di Live View.
- Rapier WASM di-load lazy hanya saat masuk `/live` (dynamic import) — landing & management tidak membayar biaya physics.
- Marker `Html` dibatasi ≤ 40; light point hanya untuk N light terdekat (distance culling).
- Audit performa = bagian Definition of Done tiap phase (bukan optimisasi akhir).

---

# 29. ERROR HANDLING

| Scenario | Handling |
|---|---|
| Building/room config invalid | Validasi Zod saat startup; dev: error overlay dengan path field; prod: fallback error page + log — jangan render scene rusak |
| Device ID tidak ditemukan | Toast "Device tidak ditemukan", deselect, sinkronkan ulang dari server |
| Realtime disconnect | Banner status "Reconnecting…", backoff, refetch snapshot saat tersambung |
| Failed device command | Rollback optimistic state + toast alasan (dari error RPC: permission_denied / invalid_value) |
| Permission denied | Kontrol di-disable sejak awal; jika tetap tembus → toast + audit |
| Invalid state transition | Ditolak server (mis. buka pintu terkunci) → toast |
| Player stuck / jatuh | Auto-reset ke spawn floor terdekat + toast halus |
| Collision issue | Character controller recovery; batas out-of-bounds → respawn |
| WebGL tidak tersedia | Landing: gambar statis; `/app`: pesan browser tidak didukung + saran |
| Rapier gagal load | Live View menampilkan pesan error + tombol kembali ke Management |

Prinsip umum: **graceful fallback**, tidak pernah white-screen; semua error user-facing punya pesan manusiawi + jalur pemulihan.

---

# 30. OBSERVABILITY

Minimal wajib:
1. Application error logging — client error boundary + logger service (level: error/warn/info), tujuan akhir Sentry (opsional; MVP: console + tabel `client_logs` sederhana boleh).
2. Device action logs — `device_events` (sudah di schema).
3. Audit trail — `audit_logs`.
4. Realtime connection status — indikator UI + log event connect/disconnect.
5. Basic performance monitoring — FPS meter hanya di dev/flag, tidak tampil di produksi.

---

# 31. MVP SCOPE & DEFINITION OF DONE

## 31.1 MVP In-scope (wajib semua)
**Landing:** polished hero 3D, interactive preview, CTA, feature sections, responsive nav.
**Management:** 1 building · 3 floors · ±10 rooms · seleksi floor/room/device · AC, Light, Door, Elevator, CCTV placeholder, Sensor · device panel · kontrol state · visual state changes · camera focus · wall/floor visibility controls.
**Live View:** third-person character · WASD · collision · camera · interaction prompt · interaksi AC/light/door/elevator.
**Backend:** Auth · database · persistent device state · realtime · permissions · audit logs.

## 31.2 MVP Out (tidak diperlukan)
GLB, Blender, 3D editor, CAD/BIM, multiplayer, IoT hardware, MQTT, VR, real CCTV stream.

## 31.3 Definition of Done MVP
Landing polished & responsive · 3D building terender · layout predefined · multi-floor bekerja · rooms selectable · devices selectable · device panel bekerja · state bisa diubah & persistent · realtime bekerja · auth bekerja · permission bekerja · Management Mode bekerja · Live View bekerja · movement & collision bekerja · interaksi bekerja · elevator dasar bekerja · **project dijalankan end-to-end tanpa manual editor setup** (`npm install && npm run dev` + seed script).

---

# 32. TECHNICAL TRADE-OFFS (KEPUTUSAN)

| Keputusan | Pilihan MVP | Alasan | Ditolak karena |
|---|---|---|---|
| R3F vs Three.js direct | **R3F + Drei** | Deklaratif, cocok dengan React/Next, ekosistem helper; maintainable solo dev | Three.js direct = boilerplate lifecycle besar |
| Zustand vs React state | **Zustand** untuk shared/UI state | Ringan, selector sempit, akses dari luar React (useFrame) | Context/Redux overkill atau re-render berat |
| Server state | **TanStack Query** | Caching, refetch, hidrasi Realtime rapi | Menyimpan server state penuh di Zustand |
| Procedural vs GLB | **Procedural** | Tanpa pipeline aset/Blender, ringan, data-driven, mudah diubah | GLB = dependency tooling; opsi future saja |
| Supabase Realtime vs polling | **Realtime** | Latency < 1s, native Postgres changes | Polling boros & terasa lambat |
| Rapier vs custom collision | **Rapier (lazy-load)** | Character controller matang (gravity, platform), WASM cepat | Custom collision = bug-prone, waktu besar |
| React HTML UI vs 3D UI | **HTML/React** | Aksesibilitas, kecepatan development, styling | 3D UI mahal & tidak aksesibel |
| Static config vs DB-driven layout | **Static config di code (MVP)**; snapshot disimpan di DB | Layout predefined oleh developer; menghindari building editor terselubung | DB-driven layout membuka pintu "configurator" (melanggar boundary) |
| Marker | **drei Html** (≤ 30) | Tajam, mudah, cukup performant | Sprite: fallback bila audit performa menuntut |
| Elevator sync | **Deterministic schedule + RPC** | Tanpa streaming posisi, konsisten lintas klien | Server tick posisi = kompleks & boros |

Prinsip pemilihan MVP: sederhana, maintainable, performant, mudah dikembangkan, cocok solo developer.

---

# 33. ARCHITECTURAL PRINCIPLES

1. Building is a **product experience**, not an editor.
2. **One world** powers Management Mode and Live View.
3. Building layout is **predefined by developer**.
4. Architecture is **data-driven**.
5. Devices are **generic & extensible** (capability-based).
6. **3D dan UI concerns terpisah.**
7. **Server state dan client state terpisah.**
8. **Performance dari hari pertama.**
9. **Avoid over-engineering.**
10. MVP harus **usable end-to-end**.
11. External 3D assets = **opsional future**.
12. Sistem harus **extensible ke real digital twin/IoT**.

---

# 34. MILESTONES & EXIT CRITERIA

| Phase | Fokus | Exit Criteria (wajib semua terpenuhi) | Estimasi solo-dev* |
|---|---|---|---|
| **0 — FOUNDATION** | Next.js, TS, R3F, Drei, Zustand, Tailwind, struktur folder, routing | Repo jalan; routes `/`, `/login`, `/app`, `/live` ada; canvas placeholder ter-render; design tokens terpasang; CI lint/build hijau | 2–4 hari |
| **1 — PROCEDURAL 3D ENGINE** | Building/Floor/Room/Wall/FloorSurface/Door/Window, camera, materials, lighting | Demo building 3 lantai ter-render penuh dari config; kamera ortho orbit/zoom/pan; visual style sesuai token; validasi config aktif; ≤ budget draw call | 1.5–2 minggu |
| **2 — INTERACTIVE BUILDING** | Selection, floor/room selection, markers dasar, highlight, camera focus, cutaway | Klik room/floor di 3D → state seleksi benar + highlight + camera focus; floor selector & 4 mode visibilitas bekerja; label tampil | 1–1.5 minggu |
| **3 — DEVICE SYSTEM** | Device model, capability registry, mesh AC/Light/Door/Elevator/CCTV/Sensor, visual state | Semua device tipe terender di posisi config; state mock mengubah visual (LED, emissive, pintu terbuka, cabin); markers status hidup; filter bekerja | 1.5–2 minggu |
| **4 — MANAGEMENT UI** | Shell, sidebar, panels, device controls, activity, alerts | Semua panel berfungsi dengan state mock; seluruh kontrol device interaktif; activity & alert tampil dari mock events; keyboard shortcuts | 1–1.5 minggu |
| **5 — BACKEND** | Supabase, schema, Auth, RLS, RPC, seed, persistence | Login bekerja; seed menghasilkan data; `control_device` menolak Viewer & menerima Operator dengan validasi; state persistent antar reload; admin user management | 1–1.5 minggu |
| **6 — REALTIME** | Subscription, optimistic update, connection handling, simulator | Toggle device di tab A terlihat di tab B < 1s; gagal command rollback + toast; indikator koneksi akurat; simulator menghasilkan data hidup | 3–5 hari |
| **7 — LIVE VIEW** | Physics, player, camera, interaction, elevator ride, mode switch | WASD + collision tanpa menembus wall/floor; [E] prompt & interaksi AC/light/door bekerja; elevator membawa player antar lantai; switch mode tanpa kehilangan state device; mobile fallback | 2–2.5 minggu |
| **8 — POLISH** | Landing final, transisi, performance, responsive, a11y, security pass | Landing lengkap sesuai §8; budget performa §28 tercapai (audit tercatat); mobile layout lulus; RLS test matrix lulus; DoD §31.3 checklist 100% | 1–1.5 minggu |

\* Estimasi indikatif total ± 9–13 minggu full-time; bukan commitment.

---

# 35. DEVELOPMENT PLAN (EPIC → FEATURE → TASK)

Format tiap task: **Objective/Output · Dependencies · Acceptance Criteria · Notes/Considerations & Risks.**

## EPIC A — FOUNDATION & SCAFFOLDING (Phase 0)

| ID | Task |
|---|---|
| A-01 | **Init project**: Next.js + TS strict + Tailwind + ESLint/Prettier + struktur folder §22. **Deps:** –. **AC:** `npm run dev/build/lint` hijau; struktur folder sesuai PRD. **Notes:** pilih App Router; tetapkan alias `@/`. *Risiko:* konfigurasi R3F+Next SSR — selesaikan di A-03. |
| A-02 | **Dependensi inti**: three, @react-three/fiber, @react-three/drei, @react-three/rapier, zustand, @tanstack/react-query, @supabase/supabase-js, zod. **Deps:** A-01. **AC:** semua terpasang, lockfile committed, bundle audit awal dicatat. **Notes:** rapier dipakai lazy. *Risiko:* versi incompat → kunci versi minor. |
| A-03 | **Canvas host SSR-safe**: komponen `<SceneCanvas>` via `next/dynamic` (`ssr:false`), deteksi WebGL, fallback UI. **Deps:** A-02. **AC:** canvas placeholder tampil di `/app`; tanpa WebGL muncul fallback rapi; tidak ada error SSR. **Notes:** pattern dipakai landing & live. |
| A-04 | **Design tokens + UI primitives**: warna/spacing/radius §20; Button, Card, Badge/StatusChip, Panel, Toggle, Slider, Toast, Modal. **Deps:** A-01. **AC:** storybook-lite halaman `/dev/ui` (dev-only) menampilkan semua primitif. |
| A-05 | **Routes & layouts**: `/`, `/login`, `/app`, `/live` + guard stub. **Deps:** A-01. **AC:** navigasi antar route bekerja; layout per route benar. |
| A-06 | **Config module & env**: `config/building.ts` (placeholder), feature flags, env loader (`NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`). **Deps:** A-01. **AC:** build gagal jelas bila env hilang (dev); flags terbaca. |

## EPIC B — PROCEDURAL 3D ENGINE (Phase 1)

| ID | Task |
|---|---|
| B-01 | **Building config schema (Zod)** + tipe TS penuh (§10–12). **Deps:** A-06. **AC:** config valid lolos, config salah → error dengan path field. **Notes:** satu sumber tipe untuk 3D, collider, seed. |
| B-02 | **Demo building config** 3 lantai sesuai §10 + daftar device §12.6. **Deps:** B-01. **AC:** config lolos validasi; review visual struktur. |
| B-03 | **Material & geometry catalog**: shared materials (wall/slab/floor-per-tipe/accent), cache geometry. **Deps:** A-03. **AC:** satu instance material per jenis; unit test sederhana jumlah material. *Risiko:* material unik per mesh → draw call meledak. |
| B-04 | **Wall generator** `createRoomWalls()` dengan bukaan door/window (komposisi segment). **Deps:** B-03. **AC:** dinding room dengan 1 pintu + 1 jendela terender benar dari config. |
| B-05 | **FloorSurface + Slab** per room/floor (warna per tipe room). **Deps:** B-03. **AC:** permukaan lantai per room tampil sesuai token. |
| B-06 | **Room component** merakit walls/floor/doors/windows dari `RoomConfig`. **Deps:** B-04, B-05. **AC:** 1 room utuh terender; pintu/jendela di posisi config. |
| B-07 | **Door & Window components** (mesh + frame; door siap animasi pivot). **Deps:** B-04. **AC:** pintu dapat beranimasi 0→95° via prop `open`. |
| B-08 | **FloorGroup + stacking + cores** (elevator shaft, stair visual). **Deps:** B-06. **AC:** 3 lantai tersusun pada elevation benar; core tampil. |
| B-09 | **Building component + merge geometry statis** per floor. **Deps:** B-08. **AC:** seluruh building terender; draw call ≤ budget §28 (tercatat). |
| B-10 | **LightingRig**: directional shadow tunggal + hemisphere + ContactShadows ground. **Deps:** B-09. **AC:** soft shadow terlihat; 1 shadow-caster. |
| B-11 | **Orthographic camera + CameraControls** (orbit/zoom/pan clamp) + framing overview otomatis. **Deps:** B-09. **AC:** building ter-frame pas saat load; kontrol smooth. |
| B-12 | **Visual style pass** token 3D final + state dev overlay config-error. **Deps:** B-10. **AC:** tampilan sesuai §20; error config tampil jelas di dev. |

## EPIC C — INTERACTIVE BUILDING (Phase 2)

| ID | Task |
|---|---|
| C-01 | **Interaction registry + raycast pipeline**: userData `{kind,id}`; hover/click handlers terpusat. **Deps:** B-09. **AC:** klik mesh apa pun mengembalikan ID benar (console/debug). |
| C-02 | **Hover state**: emissive ringan + cursor pointer + tooltip kecil. **Deps:** C-01. **AC:** hover room/device/floor memberi feedback ≤ 1 frame delay. **Notes:** throttling pointerover. |
| C-03 | **Selection store + visual selected** (emissive accent + ring lantai + marker aktif). **Deps:** C-01, A-04. **AC:** select/deselect konsisten dari 3D; hanya 1 objek selected. |
| C-04 | **Room selection** → Right Panel Room detail (data dari config). **Deps:** C-03. **AC:** klik room → panel tampil sesuai §11.3. |
| C-05 | **Floor selector UI** (All/1/2/3) + state active floor. **Deps:** C-03. **AC:** pilih floor mengubah active floor di store. |
| C-06 | **Camera focus system**: `focusFloor/focusRoom/focusDevice/overview/reset` + tween 600–900ms. **Deps:** B-11, C-03. **AC:** setiap command mem-frame target dengan padding benar; double-click = focus. |
| C-07 | **Visibility modes**: selected dim, hide upper, isolate, transparent walls (animasi 200ms). **Deps:** B-09, C-05. **AC:** keempat mode §17 bekerja & dapat dikombinasikan. *Risiko:* sorting transparency → set `depthWrite:false` & renderOrder. |
| C-08 | **Room & Floor labels** (drei Html/billboard; auto-hide saat zoom jauh/floor hidden). **Deps:** C-05, C-07. **AC:** label terbaca, tidak menumpuk, ikut visibilitas floor. |

## EPIC D — DEVICE SYSTEM (Phase 3)

| ID | Task |
|---|---|
| D-01 | **Device domain model + capability registry** (§12). **Deps:** B-01. **AC:** registry memetakan tipe→capabilities→state schema→validasi; type-safe. |
| D-02 | **Device state store + mock provider** (hydrasi dari config, `applyEvent`). **Deps:** D-01. **AC:** state berubah via mock command → subscriber ter-update. |
| D-03 | **AC mesh + visuals** (LED, airflow ON/OFF). **Deps:** B-09, D-02. **AC:** toggle power/state suhu mengubah visual sesuai §13. |
| D-04 | **Light mesh + light budget manager** (emissive + point light ≤ N terdekat). **Deps:** D-02. **AC:** brightness mengubah emissive; jumlah point light ≤ 6. |
| D-05 | **Door mesh + animasi open/close + lock indicator** (collider hook disiapkan). **Deps:** B-07, D-02. **AC:** state `open/locked` tercermin visual & animasi. |
| D-06 | **Elevator mesh + state machine visual** (cabin Y, pintu slide, indikator). **Deps:** B-08, D-02. **AC:** state `{currentFloor,targetFloor,state}` menggerakkan cabin deterministik (§18.4). *Risiko:* jadwal animasi tidak sinkron antar klien → gunakan rumus waktu bersama. |
| D-07 | **CCTV + Sensor mesh**. **Deps:** D-02. **AC:** status online/recording & sensor status tercermin. |
| D-08 | **Device markers** (drei Html: ikon, status warna, hover/click/dblclick). **Deps:** D-03..07, C-03. **AC:** marker sesuai §14; klik marker = select device. |
| D-09 | **Device filters** (tipe/status) → markers + mesh dim. **Deps:** D-08. **AC:** filter bekerja dari UI dan konsisten di 3D. |

## EPIC E — MANAGEMENT UI (Phase 4)

| ID | Task |
|---|---|
| E-01 | **App shell** 3 kolom (sidebar/canvas/panel) responsif. **Deps:** A-04, C-04. **AC:** layout §9.2; canvas dominan. |
| E-02 | **Sidebar navigation** Home/Live View/Devices/Rooms/Activity/Settings (tab query). **Deps:** E-01. **AC:** navigasi tab bekerja, state URL benar. |
| E-03 | **Home/Overview panel**: building stats (device on/off/warning), floor summary, alerts ringkas. **Deps:** D-02. **AC:** angka sesuai state store. |
| E-04 | **Devices panel**: list + filter + status chip; klik → select & focus. **Deps:** D-09, C-06. **AC:** list sinkron dengan scene. |
| E-05 | **Rooms panel**: list room + status + jumlah device. **Deps:** C-04. **AC:** klik room → seleksi & panel room. |
| E-06 | **Device detail panel + controls per capability** (Switch, Slider, TemperatureStepper, LockToggle, ElevatorPicker). **Deps:** D-01, D-02. **AC:** tiap capability punya kontrol benar; Viewer melihat read-only. |
| E-07 | **Room detail panel** (device list + aksi focus). **Deps:** C-04. **AC:** sesuai §11.3. |
| E-08 | **Activity feed panel** (mock events → live list + relative time). **Deps:** D-02. **AC:** event baru otomatis muncul. |
| E-09 | **Alerts**: AlertBanner + toast pipeline. **Deps:** E-08. **AC:** event `alert` memicu banner/toast. |
| E-10 | **Settings panel**: visual modes default, auto-focus toggle, quality (DPR/shadow), akun info. **Deps:** E-01. **AC:** setting tersimpan (localStorage) & berpengaruh. |
| E-11 | **Keyboard shortcuts** §21.3. **Deps:** C-06, E-02. **AC:** semua shortcut berfungsi, tidak bentrok dengan input form. |

## EPIC F — BACKEND (Phase 5)

| ID | Task |
|---|---|
| F-01 | **Supabase project + env + client service**. **Deps:** A-06. **AC:** koneksi auth & query dasar sukses di dev. |
| F-02 | **SQL schema + migrations** §24.2 (+ indexes, FK). **Deps:** F-01. **AC:** migration idempotent jalan di env baru. |
| F-03 | **Seed script** dari `buildingConfig` (building→devices→states) + demo users. **Deps:** F-02, B-02. **AC:** `npm run seed` menghasilkan data demo lengkap; resetable. |
| F-04 | **Auth flow**: `/login` (email/password), session, sign out, route guard. **Deps:** F-01. **AC:** login/logout bekerja; `/app` tanpa session → redirect. |
| F-05 | **Roles & RLS** §24.3 + trigger profile saat signup. **Deps:** F-02. **AC:** policy test (viewer/operator/admin) lulus semua kasus. *Risiko:* policy keliru → tulis test matrix eksplisit. |
| F-06 | **RPC `control_device`** §24.4 + `apply_command` validasi. **Deps:** F-05. **AC:** Viewer → `permission_denied`; command invalid → `invalid_value`; sukses → state+event+audit tertulis. |
| F-07 | **Server state hooks** (TanStack Query: snapshot building/devices/states; hidrasi store). **Deps:** F-03, F-04. **AC:** `/app` memuat data server, bukan mock. |
| F-08 | **Elevator RPCs**: `CALL` & `ARRIVE` idempotent. **Deps:** F-06. **AC:** kontrak §18.4 terpenuhi; double-ARRIVE aman. |
| F-09 | **Admin**: user list + change role RPC/UI; audit log view. **Deps:** F-05. **AC:** hanya admin dapat mengubah role; audit tercatat. |

## EPIC G — REALTIME (Phase 6)

| ID | Task |
|---|---|
| G-01 | **Realtime `device_states` subscription** → `useDeviceStateStore`. **Deps:** F-07. **AC:** perubahan DB → store & visual update tanpa reload. |
| G-02 | **Realtime `device_events`** → activity feed + toast/alert. **Deps:** G-01, E-08. **AC:** event baru muncul di feed semua klien. |
| G-03 | **Optimistic command flow + rollback** (command service terpusat). **Deps:** F-06, G-01. **AC:** UI instan; gagal → rollback + toast alasan. |
| G-04 | **Connection handling**: indikator, backoff, refetch snapshot. **Deps:** G-01. **AC:** matikan jaringan → status terlihat; pulih → state benar kembali. |
| G-05 | **Simulator service** (Edge Function/cron; flag). **Deps:** F-03. **AC:** sensor berubah berkala; warning sporadis memicu alert; bisa dimatikan. |
| G-06 | **Elevator realtime integration** (render deterministik lintas klien). **Deps:** F-08, G-01, D-06. **AC:** dua browser melihat posisi cabin sama dalam ±200ms. |

## EPIC H — LIVE VIEW (Phase 7)

| ID | Task |
|---|---|
| H-01 | **Physics world (rapier) lazy-load + collider generation dari config** (`buildCollidersFromConfig`). **Deps:** B-09. **AC:** wall/slab/core punya collider; bundle `/app` tidak memuat WASM rapier. |
| H-02 | **Player character controller**: WASD, walk/sprint, gravity, ground check. **Deps:** H-01. **AC:** gerakan stabil tanpa jitter; tidak menembus wall. |
| H-03 | **Third-person camera**: orbit drag, follow, collision clamp. **Deps:** H-02. **AC:** kamera tidak menembus dinding; motion smooth. |
| H-04 | **Spawn points + reset + out-of-bounds recovery**. **Deps:** H-02. **AC:** spawn di Lobby; reset bekerja; jatuh → respawn otomatis. |
| H-05 | **Live HUD**: prompt, floor indicator, help, Exit, realtime dot. **Deps:** H-02, A-04. **AC:** HUD §18.5 lengkap. |
| H-06 | **Interaction scanner**: radius 2.5m, nearest target, gating permission, prompt `[E]`. **Deps:** H-02, D-01. **AC:** prompt muncul/hilang akurat; Viewer tanpa prompt kontrol. |
| H-07 | **Device interactions**: door toggle, light toggle, AC panel, sensor/cctv panel (HTML overlay). **Deps:** H-06, G-03. **AC:** semua interaksi §18.3 bekerja end-to-end (termasuk realtime ke klien lain). |
| H-08 | **Dynamic door colliders** (nonaktif saat open). **Deps:** H-01, D-05. **AC:** pintu tertutup menghalangi; terbuka bisa dilewati. |
| H-09 | **Elevator ride**: zona masuk, panel pilih lantai, safety reopen, cabin platform mengikuti player. **Deps:** H-07, G-06. **AC:** workflow §18.4 penuh; player tiba di lantai tujuan tanpa jatuh/nyangkut. *Risiko:* platform follow — siapkan fallback parent-delta manual. |
| H-10 | **Mode switch management ⇄ live**: simpan seleksi/state, camera handoff, mount/unmount rig & physics aman. **Deps:** H-02, E-01. **AC:** bolak-balik tanpa kehilangan device state; tanpa memory leak (audit disposal). |
| H-11 | **Touch fallback**: orbit-preview + banner desktop recommended. **Deps:** H-05. **AC:** mobile tidak crash; pengalaman fallback jelas. |

## EPIC I — LANDING & POLISH (Phase 8)

| ID | Task |
|---|---|
| I-01 | **Landing page lengkap** 10 section §8 + hero behavior §8.3. **Deps:** B-12, C-02. **AC:** seluruh section & perilaku hero terpenuhi; Lighthouse UX ≥ 90 (desktop). |
| I-02 | **Transitions & micro-animations**: mode crossfade, panel slide, camera handoff. **Deps:** H-10. **AC:** perpindahan mode tanpa flash/blank. |
| I-03 | **Performance pass & audit**: draw call, instancing review, frameloop demand, DPR policy, mobile profile — hasil tercatat. **Deps:** semua epic. **AC:** budget §28.2 tercapai di device referensi. |
| I-04 | **Responsive pass**: tablet & mobile management (bottom sheet), nav mobile. **Deps:** E-01. **AC:** skenario §27 mobile lulus. |
| I-05 | **Accessibility pass**: keyboard, focus, kontras, aria, reduced-motion. **Deps:** E-11, I-01. **AC:** checklist §21.4 lulus manual test. |
| I-06 | **Security pass**: RLS test matrix penuh, command fuzz (nilai ekstrem), audit verification. **Deps:** F-05, F-06. **AC:** tidak ada jalur tulis ilegal; semua pelanggaran tercatat. |
| I-07 | **Error handling pass**: seluruh skenario §29 punya fallback; loading/empty states. **Deps:** G-04. **AC:** table §29 teruji manual satu per satu. |
| I-08 | **Observability**: logger service, audit trail review, indikator realtime final. **Deps:** G-04, F-09. **AC:** §30 terpenuhi. |
| I-09 | **DoD verification & smoke E2E**: jalankan checklist §31.3 + skenario §36; baca ulang boundary §3. **Deps:** semua. **AC:** 100% checklist hijau; zero editor-like surface. |

**Prioritas urutan:** A → B → C → D → E → F → G → H → I (paralel terbatas: F bisa mulai setelah A; I-01 mulai setelah B/C).

---

# 36. ACCEPTANCE CRITERIA (GIVEN / WHEN / THEN)

## Landing
1. **Given** user membuka website **When** landing page selesai loading **Then** user melihat polished landing page dengan interactive 3D building preview (tanpa canvas kosong/editor UI).
2. **Given** user berada di hero **When** user meng-hover floor/device pada 3D preview **Then** objek highlight + label/status singkat muncul.
3. **Given** user klik `Explore Building` **When** user belum login **Then** user diarahkan ke `/login` lalu kembali ke `/app` setelah autentikasi.

## Management — struktur
4. **Given** user berada di Management Mode **When** user selects Floor 2 **Then** Floor 2 active & kamera berfokus ke Floor 2 (transisi smooth), floor lain dimmed.
5. **Given** Floor 2 active **When** user mengaktifkan *Hide upper floors* **Then** Floor 3 tidak dirender; struktur tetap dapat dipahami.
6. **Given** user mengaktifkan *Transparent walls* **When** scene dirender **Then** interior semua room terlihat jelas tanpa kehilangan konteks bangunan.

## Management — device
7. **Given** user melihat Room 201 **When** user click AC_201 **Then** AC_201 selected dan Device Panel terbuka.
8. **Given** AC_201 selected **When** user toggles Power **Then** AC_201 berubah state, visual 3D berubah (LED/airflow), perubahan tersimpan di server.
9. **Given** user memilih Light_201 **When** user mengubah brightness **Then** brightness berubah dan visual scene (emissive/cahaya) ikut berubah.
10. **Given** Viewer login **When** membuka panel AC_201 **Then** kontrol tampil read-only (toggle disabled + penjelasan role).
11. **Given** Operator mengunci Door_201 **When** user lain mencoba membuka pintu **Then** command ditolak server dengan toast "pintu terkunci".

## Realtime
12. **Given** backend mengubah device state (tab/user lain/simulator) **When** Supabase Realtime event diterima **Then** UI dan 3D visual update tanpa reload (< 1 detik).
13. **Given** koneksi realtime terputus **When** indikator status tampil **Then** user melihat status "reconnecting" dan state disinkronkan ulang saat tersambung.

## Live View
14. **Given** user masuk Live View **When** player menggunakan WASD **Then** player bergerak sesuai input (relatif kamera), sprint dengan Shift.
15. **Given** player menabrak wall **When** movement terus dilakukan **Then** player tidak menembus wall/floor/boundary.
16. **Given** player mendekati AC_201 **When** player berada dalam interaction range **Then** `[E] Interact` muncul.
17. **Given** player menekan E **When** AC_201 interactive **Then** control panel terbuka dan dapat mengubah state (sesuai role).
18. **Given** player di dalam elevator **When** memilih Floor 3 **Then** pintu menutup → cabin bergerak → indikator berubah → pintu terbuka → player dapat keluar di Floor 3.
19. **Given** perubahan device terjadi saat user di Live View **When** event realtime tiba **Then** visual device di Live View ikut berubah (world sama dengan Management).
20. **Given** user keluar Live View **When** kembali ke Management **Then** seluruh device state konsisten dan kamera kembali ke view management.

## Auth & security
21. **Given** user belum login **When** mengakses `/app` atau `/live` **Then** redirect ke `/login`.
22. **Given** Viewer mencoba memanggil RPC `control_device` langsung **When** request sampai di server **Then** server menolak (`permission_denied`) dan mencatat audit.
23. **Given** Admin membuka Settings **When** melihat User Management **Then** admin dapat mengubah role; non-admin tidak melihat menu tersebut.

## Error handling
24. **Given** device ID tidak ditemukan (data korup) **When** user mencoba select **Then** tampil toast pemulihan, bukan crash.
25. **Given** browser tanpa WebGL **When** membuka landing/app **Then** fallback statis + pesan dukungan tampil.

---

# 37. RISKS & MITIGASI

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Scope creep menjadi editor | Melanggar inti produk | Gate §3 di code review; tidak ada API geometry-edit |
| Performa 3D di device lemah | UX buruk | Budget sejak Phase 1; audit tiap phase; quality settings |
| Elevator sync antar klien | State tidak konsisten | Skema deterministik §18.4 + ARRIVE idempotent + cron fallback |
| Rapier WASM berat | Load lambat | Lazy-load khusus `/live`; loading state |
| Realtime cost/limit | Update telat | Filter subscription per tabel; snapshot refetch saat reconnect |
| Player stuck/collision bug | Frustasi | Auto-reset, collider dari config tunggal, test manual checklist |
| Solo-dev bandwidth | Molor | Urutan phase ketat; stretch items ditandai (explode view, cutaway 6, first-person) |

---

# 38. FUTURE ROADMAP (POST-MVP)

Multiple buildings/sites + building selector · advanced analytics (energy, occupancy) · real IoT + MQTT + external device APIs · real CCTV feeds · alerts & notifications lanjutan · AI assistant · voice control · WebXR/VR · multiplayer/collaborative monitoring · digital twin synchronization dua arah · building data import (IFC/CSV) · optional GLB/GLTF assets · **optional visual configuration tool — HANYA untuk internal admin/developer, tidak pernah user-facing MVP**.

---

# 39. OPEN QUESTIONS

| # | Pertanyaan | Keputusan MVP | Kapan harus diputuskan |
|---|---|---|---|
| 1 | Building data seluruhnya di code/config vs database? | Config di code (snapshot di DB) | Saat fitur multi-building |
| 2 | Floor layout berubah runtime? | Tidak | Saat ada kebutuhan operasional nyata |
| 3 | Device terhubung hardware nyata? | Tidak (simulator) | Post-MVP roadmap IoT |
| 4 | MQTT diperlukan? | Tidak | Saat integrasi IoT |
| 5 | CCTV real stream? | Tidak (placeholder) | Saat vendor CCTV dipilih |
| 6 | Multiplayer dibutuhkan? | Tidak | Post-MVP, evaluasi use case |
| 7 | WebXR diperlukan? | Tidak | Evaluasi pasca-MVP |
| 8 | Multiple buildings? | Tidak (1 building) | Roadmap berikutnya |
| 9 | Internal building editor dibutuhkan? | Tidak di MVP | Hanya jika churn config tinggi |
| 10 | Format building schema untuk scalability? | Skema Zod §10–12 cukup | Sebelum multi-building |

Jika keputusan belum diperlukan untuk MVP, **jangan dipaksakan**.

---

# 40. GLOSSARY

**Digital Twin** — representasi digital bangunan yang mencerminkan status fisik/operasionalnya. **Management Mode** — mode dashboard isometric. **Live View** — mode berjalan third-person. **Cutaway** — teknik melihat interior (transparansi/sembunyi floor). **Capability** — kemampuan atomik device (switchable, dimmable, dst). **Stable ID** — identitas permanen objek lintas 3D/state/event. **One World** — satu scene building untuk semua mode.

---

*Dokumen ini adalah source of truth untuk seluruh development project 5days. Setiap perubahan scope harus mengacu pada §3 (Critical Product Boundary) sebelum diimplementasikan.*
