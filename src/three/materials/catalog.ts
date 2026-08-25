import * as THREE from 'three';
import { RoomType } from '@/types/domain';

class MaterialCatalog {
  private static instance: MaterialCatalog;

  // Structural Materials
  public readonly wallMaterial: THREE.MeshStandardMaterial;
  public readonly wallTransparentMaterial: THREE.MeshStandardMaterial;
  public readonly wallSelectedMaterial: THREE.MeshStandardMaterial;
  public readonly slabMaterial: THREE.MeshStandardMaterial;
  public readonly groundMaterial: THREE.MeshStandardMaterial;
  public readonly coreMaterial: THREE.MeshStandardMaterial;

  // Window / Glass / Door Materials
  public readonly glassMaterial: THREE.MeshStandardMaterial;
  public readonly doorMaterial: THREE.MeshStandardMaterial;
  public readonly frameMaterial: THREE.MeshStandardMaterial;

  // Floor Room Materials
  public readonly floorMaterials: Record<RoomType, THREE.MeshStandardMaterial>;

  // Selection and Accent
  public readonly selectionAccentMaterial: THREE.MeshStandardMaterial;
  public readonly hoverMaterial: THREE.MeshStandardMaterial;

  private constructor() {
    // 3D Wall (solid per PRD #EDEFF3)
    this.wallMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8FC5DC'),
      emissive: new THREE.Color('#BDE8F2'),
      emissiveIntensity: 0.28,
      roughness: 0.24,
      metalness: 0.04,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });

    // 3D Wall (transparent per PRD opacity 0.22)
    this.wallTransparentMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#70B4D1'),
      roughness: 0.2,
      metalness: 0.05,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });

    // Selected Wall
    this.wallSelectedMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8BE0C3'),
      emissive: new THREE.Color('#72DAB8'),
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.02,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
    });

    // Structural Slab (#E3E7EE)
    this.slabMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E6ECEF'),
      emissive: new THREE.Color('#EEF2F4'),
      emissiveIntensity: 0.08,
      roughness: 0.86,
      metalness: 0.05,
    });

    // Ground Plane (#F3F5F9)
    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E9EFF1'),
      roughness: 0.92,
      metalness: 0.0,
    });

    // Vertical Core / Elevator Shaft (#D8DEE9)
    this.coreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D6E0E4'),
      roughness: 0.75,
      metalness: 0.1,
    });

    // Glass / Window Pane
    this.glassMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9D9EE'),
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });

    // Door Panel
    this.doorMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8C97A8'),
      roughness: 0.6,
      metalness: 0.1,
    });

    // Frame
    this.frameMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#475569'),
      roughness: 0.7,
      metalness: 0.2,
    });

    // Floor surfaces per Room Type (PRD §20.1)
    this.floorMaterials = {
      office: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#BDEDDD'),
        emissive: new THREE.Color('#A6E4D1'),
        emissiveIntensity: 0.16,
        roughness: 0.85,
        metalness: 0.02,
      }),
      meeting: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#A8E8CB'),
        emissive: new THREE.Color('#88DDB5'),
        emissiveIntensity: 0.16,
        roughness: 0.85,
        metalness: 0.02,
      }),
      lobby: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F5E0B8'),
        emissive: new THREE.Color('#F1D19B'),
        emissiveIntensity: 0.14,
        roughness: 0.82,
        metalness: 0.02,
      }),
      utility: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E8D7C0'),
        roughness: 0.9,
        metalness: 0.02,
      }),
      corridor: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#BFD9E7'),
        emissive: new THREE.Color('#A9D2E2'),
        emissiveIntensity: 0.14,
        roughness: 0.85,
        metalness: 0.02,
      }),
    };

    // Selection Accent
    this.selectionAccentMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B8F0DE'),
      emissive: new THREE.Color('#65D6B2'),
      emissiveIntensity: 0.18,
      roughness: 0.58,
      metalness: 0.02,
    });

    // Hover Material
    this.hoverMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D9F5EC'),
      emissive: new THREE.Color('#72DAB8'),
      emissiveIntensity: 0.1,
      roughness: 0.68,
    });
  }

  public static getInstance(): MaterialCatalog {
    if (!MaterialCatalog.instance) {
      MaterialCatalog.instance = new MaterialCatalog();
    }
    return MaterialCatalog.instance;
  }
}

export const materials = MaterialCatalog.getInstance();
