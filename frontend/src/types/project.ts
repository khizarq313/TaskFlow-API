// export interface ProjectMember {
//   userId: number;
//   email: string;
//   displayName: string;
//   role: string;
// }

// export interface Project {
//   id: number;
//   name: string;
//   description: string | null;
//   ownerName: string;
//   ownerEmail: string;
//   createdAt: string;
//   updatedAt: string;
//   taskCount: number;
//   members: ProjectMember[];
// }

export interface ProjectRequest {
  name: string;
  description?: string;
}


export interface ProjectMember {
  userId: string; // changed
  email: string;
  displayName: string;
  role: string;
}

export interface Project {
  id: string; // ✅ changed
  name: string;
  description: string | null;
  ownerId: string; // ✅ added
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  memberCount: number; // ✅ added
}