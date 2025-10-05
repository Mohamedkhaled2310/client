export interface Project {
    _id: string;
    title: string;
    description?: string;
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    members?: {
      _id: string;
      name: string;
      email: string;
    }[];
  }
  